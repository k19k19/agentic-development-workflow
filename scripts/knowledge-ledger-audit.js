#!/usr/bin/env node

/**
 * Audit the knowledge ledger for missing metadata so the KL- system stays healthy.
 *
 * Usage:
 *   npm run baw:knowledge:audit
 */

const path = require('path');
const { loadKnowledgeLedgerIndex, LEDGER_PATH } = require('./utils/knowledge-ledger');

function formatList(items) {
  return items.map(item => `  - ${item.id} — ${item.title}`).join('\n');
}

(async () => {
  try {
    const index = await loadKnowledgeLedgerIndex();
    const adopted = index.adopted || [];
    const superseded = index.superseded || [];

    console.log(`Ledger source: ${path.relative(process.cwd(), LEDGER_PATH)}`);
    console.log(`Adopted decisions: ${adopted.length}`);
    console.log(`Superseded decisions: ${superseded.length}`);

    const missingTags = adopted.filter(entry => !entry.tags || entry.tags.length === 0);
    const missingHow = adopted.filter(entry => !entry.how);
    const missingWhat = adopted.filter(entry => !entry.what);
    const missingWhy = adopted.filter(entry => !entry.why);

    const issues = [];
    if (missingTags.length > 0) {
      issues.push(`Missing tags (${missingTags.length})\n${formatList(missingTags)}`);
    }
    if (missingHow.length > 0) {
      issues.push(`Missing "How" field (${missingHow.length})\n${formatList(missingHow)}`);
    }
    if (missingWhat.length > 0) {
      issues.push(`Missing "What" field (${missingWhat.length})\n${formatList(missingWhat)}`);
    }
    if (missingWhy.length > 0) {
      issues.push(`Missing "Why" field (${missingWhy.length})\n${formatList(missingWhy)}`);
    }

    if (issues.length === 0) {
      console.log('\n✅ Ledger looks healthy. No missing fields detected.');
    } else {
      console.log('\n⚠️  Ledger issues detected:\n');
      console.log(issues.join('\n\n'));
    }

    if (index.warnings && index.warnings.length) {
      console.log('\nParser warnings:');
      index.warnings.forEach(message => console.log(`  - ${message}`));
    }
  } catch (error) {
    console.error(`Failed to audit knowledge ledger: ${error.message}`);
    process.exit(1);
  }
})();
