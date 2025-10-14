#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..', '..');
const LEDGER_PATH = path.join(REPO_ROOT, 'ai-docs', 'knowledge-ledger', 'ledger.md');

const ENTRY_HEADER_REGEX = /^###\s+(KL-\d+)\s+[—-]\s+(.*?)\s+\(Adopted\s+([0-9]{4}-[0-9]{2}-[0-9]{2})\)/;
const FIELD_REGEX = /^\s*-\s+\*\*(.+?)\*\*\s*:?(.*)$/;

function normalizeWhitespace(value = '') {
  return value
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTagsText(value = '') {
  return value
    .split(/[,;]+/g)
    .map(token => token.trim().toLowerCase())
    .filter(Boolean);
}

function finalizeEntry({ entry, section, adopted, superseded, warnings }) {
  if (!entry) {
    return;
  }

  const target = section === 'superseded' ? superseded : adopted;
  const normalized = {
    id: entry.id,
    title: entry.title,
    adoptedOn: entry.adoptedOn,
    what: normalizeWhitespace(entry.what),
    why: normalizeWhitespace(entry.why),
    how: normalizeWhitespace(entry.how),
    tags: Array.from(new Set((entry.tags || []).map(tag => tag.toLowerCase()))).sort()
  };

  if (section === 'adopted') {
    const missing = ['what', 'why', 'how'].filter(key => !normalized[key]);
    if (missing.length > 0) {
      warnings.push(`Knowledge ledger entry ${entry.id} is missing: ${missing.join(', ')}`);
    }
    if (!normalized.tags.length) {
      warnings.push(`Knowledge ledger entry ${entry.id} is missing tags to aid discovery.`);
    }
  }

  target.push(normalized);
}

function parseKnowledgeLedger(markdownContent) {
  const adopted = [];
  const superseded = [];
  const warnings = [];

  const lines = markdownContent.split(/\r?\n/);

  let section = null;
  let entry = null;
  let activeField = null;

  const commitEntry = () => {
    finalizeEntry({ entry, section, adopted, superseded, warnings });
    entry = null;
    activeField = null;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (/^##\s+Adopted Decisions/i.test(trimmed)) {
      commitEntry();
      section = 'adopted';
      return;
    }

    if (/^##\s+Superseded Decisions/i.test(trimmed)) {
      commitEntry();
      section = 'superseded';
      return;
    }

    if (trimmed.startsWith('## ')) {
      commitEntry();
      section = null;
      return;
    }

    if (!section) {
      return;
    }

    const headerMatch = line.match(ENTRY_HEADER_REGEX);
    if (headerMatch) {
      commitEntry();
      entry = {
        id: headerMatch[1],
        title: headerMatch[2].trim(),
        adoptedOn: headerMatch[3],
        what: '',
        why: '',
        how: '',
        tags: []
      };
      activeField = null;
      return;
    }

    if (!entry) {
      return;
    }

    const fieldMatch = line.match(FIELD_REGEX);
    if (fieldMatch) {
      const rawKey = fieldMatch[1].trim().replace(/:$/, '');
      const key = rawKey.toLowerCase();
      const value = fieldMatch[2].trim();
      if (['what', 'why', 'how'].includes(key)) {
        entry[key] = value;
        activeField = key;
      } else if (key === 'tags') {
        entry.tags = parseTagsText(value);
        activeField = 'tags';
      } else {
        warnings.push(
          `Knowledge ledger entry ${entry.id} has an unrecognized field '${rawKey}' on line ${index + 1}`
        );
        activeField = null;
      }
      return;
    }

    if (activeField && trimmed.length > 0) {
      if (activeField === 'tags') {
        entry.tags = Array.from(new Set([...entry.tags, ...parseTagsText(trimmed)]));
      } else {
        entry[activeField] = `${entry[activeField]} ${trimmed}`.trim();
      }
      return;
    }

    if (trimmed.length === 0) {
      activeField = null;
    }
  });

  commitEntry();

  return {
    version: '1.1',
    adopted,
    superseded,
    warnings
  };
}

async function loadKnowledgeLedgerIndex() {
  try {
    const raw = await fs.readFile(LEDGER_PATH, 'utf8');
    const parsed = parseKnowledgeLedger(raw);
    return {
      ...parsed,
      source: LEDGER_PATH
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {
        version: '1.1',
        adopted: [],
        superseded: [],
        warnings: [`Knowledge ledger not found at ${path.relative(REPO_ROOT, LEDGER_PATH)}`],
        source: LEDGER_PATH
      };
    }
    throw error;
  }
}

module.exports = {
  LEDGER_PATH,
  parseKnowledgeLedger,
  loadKnowledgeLedgerIndex
};
