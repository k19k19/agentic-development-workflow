#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

let matter;
try {
  matter = require('gray-matter');
} catch (error) {
  console.error('Missing dependency: gray-matter. Install it with `npm install gray-matter`');
  process.exit(1);
}

const LEDGER_DIR = path.join(__dirname, '..', 'ai-docs', 'knowledge-ledger');
const REQUIRED_FIELDS = ['id', 'title', 'status', 'date', 'replaces', 'links', 'tags'];
const REQUIRED_SECTIONS = ['Summary', 'Rationale', 'Implementation', 'Validation'];
const ALLOWED_STATUSES = new Set(['proposed', 'adopted', 'superseded']);
const ID_REGEX = /^KL-\d{3,}$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const CHECK = '\u2705';
const CROSS = '\u274C';

function isIsoDate(value) {
  if (typeof value !== 'string' || !ISO_DATE_REGEX.test(value)) {
    return false;
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function findMissingSections(content) {
  return REQUIRED_SECTIONS.filter((section) => {
    const pattern = new RegExp(`^#{1,6}\\s+${section}\\b`, 'm');
    return !pattern.test(content);
  });
}

async function main() {
  let files;
  try {
    files = await fs.readdir(LEDGER_DIR);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`${RED}Knowledge ledger directory not found at ${LEDGER_DIR}${RESET}`);
      process.exit(1);
    }
    throw error;
  }

  const markdownFiles = files.filter(
    (file) => file.endsWith('.md') && !['README.md', 'template.md'].includes(file)
  );

  if (!markdownFiles.length) {
    console.log(`${GREEN}${CHECK} No ledger articles found.${RESET}`);
    console.log('Summary: 0/0 articles valid');
    process.exit(0);
  }

  const articles = [];
  const idToArticles = new Map();

  for (const file of markdownFiles) {
    const articlePath = path.join(LEDGER_DIR, file);
    const article = {
      file,
      path: articlePath,
      data: {},
      content: '',
      errors: [],
    };

    let raw;
    try {
      raw = await fs.readFile(articlePath, 'utf8');
    } catch (error) {
      article.errors.push(`Failed to read file: ${error.message}`);
      articles.push(article);
      continue;
    }

    let parsed;
    try {
      parsed = matter(raw);
    } catch (error) {
      article.errors.push(`Failed to parse frontmatter: ${error.message}`);
      articles.push(article);
      continue;
    }

    article.data = parsed.data || {};
    article.content = parsed.content || '';

    for (const field of REQUIRED_FIELDS) {
      if (!(field in article.data)) {
        article.errors.push(`Missing required frontmatter field "${field}"`);
      }
    }

    const { id, status, date, replaces, links, tags, title } = article.data;

    if (typeof id === 'string') {
      if (!ID_REGEX.test(id)) {
        article.errors.push(`Invalid id format "${id}" (expected KL-XXX)`);
      }
      if (!idToArticles.has(id)) {
        idToArticles.set(id, []);
      }
      idToArticles.get(id).push(article);
    } else {
      article.errors.push('Frontmatter field "id" must be a string');
    }

    if (typeof title !== 'string' || !title.trim()) {
      article.errors.push('Frontmatter field "title" must be a non-empty string');
    }

    if (typeof status !== 'string' || !ALLOWED_STATUSES.has(status)) {
      article.errors.push('Frontmatter field "status" must be one of: proposed, adopted, superseded');
    }

    // gray-matter may auto-parse dates to Date objects
    const dateValue = date instanceof Date ? date.toISOString().split('T')[0] : date;
    if (typeof dateValue !== 'string' || !isIsoDate(dateValue)) {
      article.errors.push('Frontmatter field "date" must be a valid ISO date (YYYY-MM-DD)');
    }

    if (replaces !== null && typeof replaces !== 'string') {
      article.errors.push('Frontmatter field "replaces" must be null or a string id');
    }

    if (!Array.isArray(links)) {
      article.errors.push('Frontmatter field "links" must be an array of ids');
    }

    if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== 'string' || !tag.trim())) {
      article.errors.push('Frontmatter field "tags" must be an array of non-empty strings');
    }

    if (!article.content.trim()) {
      article.errors.push('Markdown body is empty');
    } else {
      const missingSections = findMissingSections(article.content);
      missingSections.forEach((section) => {
        article.errors.push(`Missing required section heading "${section}"`);
      });
    }

    articles.push(article);
  }

  for (const [id, owners] of idToArticles.entries()) {
    if (owners.length > 1) {
      owners.forEach((owner) => {
        const others = owners
          .filter((candidate) => candidate !== owner)
          .map((candidate) => candidate.file)
          .join(', ');
        owner.errors.push(`Duplicate id "${id}" also used in: ${others}`);
      });
    }
  }

  const knownIds = new Set([...idToArticles.keys()]);

  for (const article of articles) {
    const { replaces, links } = article.data;

    if (typeof replaces === 'string') {
      if (!ID_REGEX.test(replaces)) {
        article.errors.push(`Field "replaces" must reference an id in KL-XXX format (found "${replaces}")`);
      } else if (!knownIds.has(replaces)) {
        article.errors.push(`Field "replaces" references missing id "${replaces}"`);
      }
    }

    if (Array.isArray(links)) {
      links.forEach((link) => {
        if (typeof link !== 'string' || !ID_REGEX.test(link)) {
          article.errors.push(`Links must be KL-XXX ids (invalid entry "${link}")`);
        } else if (!knownIds.has(link)) {
          article.errors.push(`Link references missing id "${link}"`);
        }
      });
    }
  }

  let validCount = 0;
  for (const article of articles) {
    const articleId = typeof article.data.id === 'string' ? ` (${article.data.id})` : '';
    if (article.errors.length === 0) {
      validCount += 1;
      console.log(`${GREEN}${CHECK} ${article.file}${articleId}${RESET}`);
    } else {
      console.log(`${CROSS} ${article.file}${articleId}`);
      article.errors.forEach((error) => {
        console.log(`${RED}  - ${error}${RESET}`);
      });
    }
  }

  console.log(`Summary: ${validCount}/${articles.length} articles valid`);
  process.exit(validCount === articles.length ? 0 : 1);
}

main().catch((error) => {
  console.error(`${RED}Unexpected error: ${error.message}${RESET}`);
  process.exit(1);
});
