#!/usr/bin/env node

/**
 * Unified Dashboard (Workflow Focused)
 *
 * Reads aggregated workflow status and prints a concise dashboard of
 * in-flight features, their current phases, and resume commands.
 */

const {syncWorkflowStatus} = require('./workflow-status');

function formatFeature(feature, index) {
  const lines = [];
  lines.push(`   ${index}. ${feature.title} (${feature.featureId})`);
  lines.push(`      Phase: ${feature.currentPhase} • Status: ${feature.status}`);
  if (feature.lastCommand) {
    lines.push(`      Last Command: ${feature.lastCommand}`);
  }
  if (feature.nextCommand) {
    lines.push(`      ▶️  Resume: ${feature.nextCommand}`);
  }
  if (feature.summary) {
    lines.push(`      📝 ${feature.summary}`);
  }
  if (feature.documentation?.length) {
    lines.push(`      📚 Docs: ${feature.documentation.join(', ')}`);
  }
  if (feature.outputPath) {
    lines.push(`      📂 Output: ${feature.outputPath}`);
  }
  if (feature.notes) {
    lines.push(`      🧠 ${feature.notes}`);
  }
  return lines.join('\n');
}

function summarizeByPhase(features) {
  return features.reduce((acc, feature) => {
    const phase = feature.currentPhase || 'unknown';
    acc[phase] = (acc[phase] || 0) + 1;
    return acc;
  }, {});
}

async function showDashboard() {
  const {index, warnings} = await syncWorkflowStatus({silent: true});
  const features = index.features || [];
  const phaseSummary = summarizeByPhase(features);
  const ledger = index.knowledgeLedger || { adopted: [], superseded: [], source: 'ai-docs/knowledge-ledger/ledger.md' };

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎯 WORKFLOW DASHBOARD');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log(`Features tracked: ${features.length}`);
  if (features.length > 0) {
    console.log('Phase distribution:');
    Object.entries(phaseSummary)
      .sort((a, b) => b[1] - a[1])
      .forEach(([phase, count]) => {
        console.log(`  • ${phase}: ${count}`);
      });
  }
  console.log('');

  if (features.length === 0) {
    console.log('No workflow entries found. Run a slash command (e.g., /baw_dev_discovery or /baw_dev_plan) to create status JSON and then rerun this dashboard.\n');
  } else {
    console.log('Top features:');
    features
      .slice(0, 10)
      .forEach((feature, idx) => {
        console.log(formatFeature(feature, idx + 1));
        console.log('');
      });
    if (features.length > 10) {
      console.log(`…and ${features.length - 10} more. Use 'npm run baw:workflow:sync' to inspect the full index.`);
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
