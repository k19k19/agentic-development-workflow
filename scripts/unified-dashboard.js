#!/usr/bin/env node

/**
 * Unified Dashboard (Workflow Focused)
 *
 * Reads aggregated workflow status and prints a concise dashboard of
 * in-flight capabilities, their current phases, and resume commands.
 */

const {syncWorkflowStatus} = require('./workflow-status');

function formatCapability(capability, index) {
  const lines = [];
  lines.push(`   ${index}. ${capability.title} (${capability.capabilityId})`);
  lines.push(`      Phase: ${capability.currentPhase} • Status: ${capability.status}`);
  if (capability.lastCommand) {
    lines.push(`      Last Command: ${capability.lastCommand}`);
  }
  if (capability.nextCommand) {
    lines.push(`      ▶️  Resume: ${capability.nextCommand}`);
  }
  if (capability.summary) {
    lines.push(`      📝 ${capability.summary}`);
  }
  if (capability.documentation?.length) {
    lines.push(`      📚 Docs: ${capability.documentation.join(', ')}`);
  }
  if (capability.outputPath) {
    lines.push(`      📂 Output: ${capability.outputPath}`);
  }
  if (capability.notes) {
    lines.push(`      🧠 ${capability.notes}`);
  }
  return lines.join('\n');
}

function summarizeByPhase(capabilities) {
  return capabilities.reduce((acc, capability) => {
    const phase = capability.currentPhase || 'unknown';
    acc[phase] = (acc[phase] || 0) + 1;
    return acc;
  }, {});
}

async function showDashboard() {
  const {index, warnings} = await syncWorkflowStatus({silent: true});
  const capabilities = index.capabilities || [];
  const phaseSummary = summarizeByPhase(capabilities);
  const ledger = index.knowledgeLedger || { adopted: [], superseded: [], source: 'ai-docs/knowledge-ledger/ledger.md' };

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎯 WORKFLOW DASHBOARD');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log(`Capabilities tracked: ${capabilities.length}`);
  if (capabilities.length > 0) {
    console.log('Phase distribution:');
    Object.entries(phaseSummary)
      .sort((a, b) => b[1] - a[1])
      .forEach(([phase, count]) => {
        console.log(`  • ${phase}: ${count}`);
      });
  }
  console.log('');

  if (capabilities.length === 0) {
    console.log('No workflow entries found. Run a slash command (e.g., /baw_dev_discovery or /baw_dev_plan) to create status JSON and then rerun this dashboard.\n');
  } else {
    console.log('Top capabilities:');
    capabilities
      .slice(0, 10)
      .forEach((capability, idx) => {
        console.log(formatCapability(capability, idx + 1));
        console.log('');
      });
    if (capabilities.length > 10) {
      console.log(`…and ${capabilities.length - 10} more. Use 'npm run baw:workflow:sync' to inspect the full index.`);
      console.log('');
    }
  }

  console.log('Knowledge ledger summary:');
  if (ledger.adopted.length === 0 && ledger.superseded.length === 0) {
    console.log(`  • No decisions adopted yet (source: ${ledger.source})`);
  } else {
    console.log(`  • Adopted decisions: ${ledger.adopted.length}`);
    const latestDecisions = [...ledger.adopted]
      .sort((a, b) => new Date(b.adoptedOn) - new Date(a.adoptedOn))
      .slice(0, 3);
    latestDecisions.forEach(decision => {
      console.log(`    - ${decision.id} (${decision.adoptedOn}): ${decision.title} — ${decision.what}`);
    });
    if (ledger.adopted.length > latestDecisions.length) {
      console.log(`    …and ${ledger.adopted.length - latestDecisions.length} more. See ${ledger.source}.`);
    }
    if (ledger.superseded.length > 0) {
      console.log(`  • Superseded decisions: ${ledger.superseded.length}`);
    }
  }
  console.log('');

  if (warnings.length > 0) {
    console.log('⚠️  Warnings');
    warnings.forEach(message => {
      console.log(`  - ${message}`);
    });
    console.log('');
  }

  console.log('Next actions:');
  console.log("  1. Update docs in app-docs/ if anything changed.");
  console.log("  2. Run 'npm run baw:workflow:sync' whenever new command output is available.");
  console.log("  3. Re-run 'npm run baw:work' to refresh this dashboard.");
  console.log('');
}

showDashboard().catch(error => {
  console.error('❌ Failed to render dashboard');
  console.error(error);
  process.exit(1);
});
