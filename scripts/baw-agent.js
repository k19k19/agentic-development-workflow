#!/usr/bin/env node

/**
 * Lightweight conversational router that maps natural language requests
 * to the closest `/baw:` command. It keeps the command catalogue in one place
 * so humans can type plain language without leaving the workflow.
 *
 * Usage:
 *   npm run baw:agent -- "I need a test plan for billing"
 *   npm run baw:agent -- --persona dev "ship password reset fix"
 *   npm run baw:agent -- --list
 */

const { exit } = require('process');

const ROUTES = [
  {
    id: 'product_charter',
    template: '/baw:product_charter "{subject}"',
    persona: 'product',
    description: 'Define personas, value proposition, and success metrics.',
    keywords: ['charter', 'persona', 'vision', 'positioning', 'value prop', 'market fit'],
    followUps: ['/baw:product_features "{subject}"', '/baw:product_helper "{subject} discovery gap"']
  },
  {
    id: 'product_features',
    template: '/baw:product_features "{subject}"',
    persona: 'product',
    description: 'Break a product vision into a feature catalogue with dependencies.',
    keywords: ['feature map', 'roadmap', 'dependency graph', 'catalogue', 'feature list', 'epic plan'],
    followUps: ['/baw:product_wishlist "{subject}"', '/baw:product_helper "{subject} research"']
  },
  {
    id: 'product_helper',
    template: '/baw:product_helper "{subject}"',
    persona: 'product',
    description: 'Run focused research to close discovery gaps.',
    keywords: ['research', 'market', 'analysis', 'competitive', 'regulation', 'compliance', 'sizing'],
    followUps: ['/baw:product_features "{subject}"']
  },
  {
    id: 'dev_dependency_plan',
    template: '/baw:dev_dependency_plan "{subject}"',
    persona: 'dev',
    description: 'Sequence milestones and dependencies before committing to build work.',
    keywords: ['dependency', 'roadmap', 'phase plan', 'milestone', 'breakdown', 'sequence', 'epic'],
    followUps: ['/baw:dev_breakout_plan "{subject}"']
  },
  {
    id: 'dev_execution_prep',
    template: '/baw:dev_execution_prep "{subject}"',
    persona: 'dev',
    description: 'Create an execution checklist with owners, validation, and missing assets.',
    keywords: ['execution prep', 'acceptance', 'checklist', 'handoff', 'ready to build', 'owners'],
    followUps: ['/baw:dev_build "{subject}"']
  },
  {
    id: 'dev_quick_build',
    template: '/baw:dev_quick_build "{subject}"',
    persona: 'dev',
    description: 'Handle lightweight bug fixes or single-file changes.',
    keywords: ['bug', 'hotfix', 'typo', 'quick fix', 'small change', 'regression', 'patch'],
    followUps: ['/baw:dev_test']
  },
  {
    id: 'dev_discovery_build',
    template: '/baw:dev_discovery_build "{subject}"',
    persona: 'dev',
    description: 'Combine discovery with an implementation pass for medium tasks.',
    keywords: ['implement', 'build feature', 'new feature', 'medium scope', 'code and research'],
    followUps: ['/baw:dev_test']
  },
  {
    id: 'dev_full_pipeline',
    template: '/baw:dev_full_pipeline "{subject}" "" "budget"',
    persona: 'dev',
    description: 'Run discovery → plan → build flow for large initiatives with budget guardrails.',
    keywords: ['large feature', 'major rewrite', 'full pipeline', 'multi sprint', 'end to end'],
    followUps: ['/baw:dev_test', '/baw:dev_deploy_plan "{subject}"']
  },
  {
    id: 'dev_test',
    template: '/baw:dev_test',
    persona: 'dev',
    description: 'Execute automated tests after a build or before deployment.',
    keywords: ['test', 'qa', 'verification', 'unit tests', 'integration'],
    followUps: ['/baw:uat "{subject}"', '/baw:dev_deploy_staging "{subject}"']
  },
  {
    id: 'dev_deploy_plan',
    template: '/baw:dev_deploy_plan "{subject}"',
    persona: 'dev',
    description: 'Produce deployment and rollback runbooks.',
    keywords: ['deploy', 'release', 'launch', 'rollback', 'cutover', 'deployment plan'],
    followUps: ['/baw:dev_deploy_staging "{subject}"', '/baw:dev_release "{subject}"']
  },
  {
    id: 'workflow_radar',
    template: '/baw:workflow_radar "{subject}"',
    persona: 'ops',
    description: 'Summarize outstanding work, blockers, and missing docs by persona.',
    keywords: ['status', 'dashboard', 'overview', 'where are we', 'blockers', 'radar'],
    followUps: ['npm run baw:workflow:sync']
  },
  {
    id: 'provider_functions',
    template: '/baw:provider_functions "{subject}"',
    persona: 'ops',
    description: 'Map provider/admin workflows and operational requirements.',
    keywords: ['operations', 'provider', 'admin workflow', 'ops process', 'handoff'],
    followUps: ['/baw:dev_execution_prep "{subject}"']
  },
  {
    id: 'support_ticket',
    template: '/baw:support_ticket "{subject}"',
    persona: 'support',
    description: 'Convert customer issues into actionable follow-ups.',
    keywords: ['support', 'ticket', 'customer', 'escalation', 'cs', 'incident'],
    followUps: ['/baw:dev_quick_build "{subject}"', '/baw:triage_bug "{subject}"']
  }
];

function printUsage(message) {
  if (message) {
    console.error(`Error: ${message}`);
  }
  console.log('Usage: npm run baw:agent -- [options] "<request>"');
  console.log('\nOptions:');
  console.log('  --persona <product|dev|ops|support>  Restrict routing to a persona track');
  console.log('  --list                              Show all available routes');
  console.log('  --help                              Display this message');
  exit(message ? 1 : 0);
}

function sanitizeSubject(raw) {
  if (!raw) {
    return '';
  }
  let subject = raw
    .replace(/^["']|["']$/g, '')
    .replace(/^(please|need to|can you|could you|help me|i need to|i want to)\s+/i, '')
    .replace(/[\s]+/g, ' ')
    .trim();

  if (!subject) {
    subject = 'task';
  }

  return subject.replace(/"/g, '\\"');
}

function listRoutes() {
  console.log('Available routes:\n');
  ROUTES.forEach(route => {
    console.log(`- [${route.persona}] ${route.template}`);
    console.log(`    ${route.description}`);
  });
}

function scoreRoute(route, text) {
  let score = 0;
  route.keywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += keyword.length > 8 ? 3 : 2;
    }
  });
  if (score === 0 && route.persona === 'dev' && /\b(build|ship|implement)\b/.test(text)) {
    score = 1;
  }
  return score;
}

function chooseRoute({ text, persona }) {
  const candidates = ROUTES.filter(route => !persona || route.persona === persona);
  let best = null;
  let bestScore = 0;

  candidates.forEach(route => {
    const score = scoreRoute(route, text);
    if (score > bestScore) {
      bestScore = score;
      best = route;
    }
  });

  if (!best) {
    return ROUTES.find(route => (persona ? route.persona === persona : route.id === 'dev_quick_build'));
  }

  return best;
}

function formatFollowUps(route, subject) {
  if (!Array.isArray(route.followUps) || route.followUps.length === 0) {
    return null;
  }
  return route.followUps.map(item => item.replace('{subject}', subject)).filter(Boolean);
}

function main() {
  const args = process.argv.slice(2);
  const requestParts = [];
  let persona = '';

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      printUsage();
    } else if (arg === '--list') {
      listRoutes();
      return;
    } else if (arg === '--persona') {
      const value = args[index + 1];
      if (!value) {
        printUsage('Missing value for --persona');
      }
      persona = value.toLowerCase();
      index += 1;
    } else if (arg.startsWith('--')) {
      printUsage(`Unknown option: ${arg}`);
    } else {
      requestParts.push(arg);
    }
  }

  if (!requestParts.length) {
    printUsage('Please provide a natural language request (e.g., "plan the access control epic").');
  }

  const request = requestParts.join(' ');
  const normalized = request.toLowerCase();
  const subject = sanitizeSubject(request);

  const selected = chooseRoute({ text: normalized, persona });

  const recommendedCommand = selected.template.replace('{subject}', subject);
  console.log(`🤖 Persona track: ${selected.persona}`);
  console.log(`🎯 Recommended command: ${recommendedCommand}`);
  console.log(`💡 Why: ${selected.description}`);

  const followUps = formatFollowUps(selected, subject);
  if (followUps && followUps.length > 0) {
    console.log('\nSuggested follow-ups:');
    followUps.forEach(cmd => console.log(`  - ${cmd}`));
  }

  console.log('\nKeep responses inside the slash-command loop so automation stays in sync.');
}

main();
