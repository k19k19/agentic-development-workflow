#!/usr/bin/env node

const path = require('path');
const { syncWorkflowStatus, INDEX_FILE } = require('./workflow-status');
const { runImport } = require('./utils/token-usage-import');

(async () => {
  try {
    let tokenLogMessage = 'Token log: no new entries discovered.';
    try {
      const { processed, skipped } = await runImport({ source: 'workflow-sync' });
      const tokensProcessed = processed.length;
      const tokensSkipped = skipped.length;
      if (tokensProcessed > 0) {
        tokenLogMessage = `Token log: captured ${tokensProcessed} entr${tokensProcessed === 1 ? 'y' : 'ies'} (skipped ${tokensSkipped}).`;
      } else if (tokensSkipped > 0) {
        tokenLogMessage = `Token log: skipped ${tokensSkipped} files (already logged or no usage found).`;
      }
    } catch (tokenError) {
      tokenLogMessage = `⚠️  Token log import failed: ${tokenError.message}`;
    }
    console.log(`\n🔄 ${tokenLogMessage}`);

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
