#!/usr/bin/env node

const path = require('path');
const { syncWorkflowStatus, INDEX_FILE } = require('./workflow-status');

(async () => {
  try {
    const { index, warnings } = await syncWorkflowStatus();
    console.log(`\n📦 Capabilities tracked: ${index.capabilities.length}`);
    if (warnings.length > 0) {
      console.log('⚠️  Some workflow entries were skipped:');
      warnings.forEach(message => {
        console.log(`   - ${message}`);
      });
    }
    const ledger = index.knowledgeLedger || { adopted: [], superseded: [], source: 'ai-docs/knowledge-ledger/ledger.md' };
    console.log(
      `📚 Knowledge ledger: ${ledger.adopted.length} adopted / ${ledger.superseded.length} superseded (source: ${ledger.source})`
    );
    console.log(`📝 Index written to ${path.relative(process.cwd(), INDEX_FILE)}`);
  } catch (error) {
    console.error('❌ Failed to sync workflow status');
    console.error(error);
    process.exit(1);
  }
})();
