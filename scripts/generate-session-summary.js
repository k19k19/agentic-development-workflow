#!/usr/bin/env node

/**
 * Generate Session Summary
 * Creates session documentation in ai-docs/sessions/ with structured metadata
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SessionSummaryGenerator {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.sessionsDir = path.join(projectRoot, 'ai-docs', 'sessions');
  }

  /**
   * Ensure sessions directory exists
   */
  ensureSessionsDir() {
    if (!fs.existsSync(this.sessionsDir)) {
      fs.mkdirSync(this.sessionsDir, { recursive: true });
      console.log(`✅ Created sessions directory: ${this.sessionsDir}`);
    }
  }

  /**
   * Extract task summary from plan file
   */
  extractTaskSummary(planPath) {
    if (!planPath || !fs.existsSync(planPath)) {
      return 'No plan file provided';
    }

    try {
      const planContent = fs.readFileSync(planPath, 'utf8');

      // Try to extract executive summary
      const summaryMatch = planContent.match(/## Executive Summary\s+([\s\S]*?)(?=\n##|\n---|\Z)/);
      if (summaryMatch) {
        return summaryMatch[1].trim();
      }

      // Try to extract problem statement
      const problemMatch = planContent.match(/## Problem Statement\s+([\s\S]*?)(?=\n##|\n---|\Z)/);
      if (problemMatch) {
        return problemMatch[1].trim().substring(0, 500) + '...';
      }

      // Fallback: First 500 characters
      return planContent.substring(0, 500) + '...';
    } catch (error) {
      return `Error reading plan: ${error.message}`;
    }
  }

  /**
   * Get git diff summary
   */
  getGitDiff() {
    try {
      return execSync('git diff --stat', { encoding: 'utf8', cwd: this.projectRoot });
    } catch (error) {
      return 'No git changes detected';
    }
  }

  /**
   * Get modified files list
   */
  getModifiedFiles() {
    try {
      const output = execSync('git diff --name-only', { encoding: 'utf8', cwd: this.projectRoot });
      return output.trim().split('\n').filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  /**
   * Extract key decisions from plan
   */
  extractKeyDecisions(planPath) {
    if (!planPath || !fs.existsSync(planPath)) {
      return ['No key decisions extracted'];
    }

    try {
      const planContent = fs.readFileSync(planPath, 'utf8');

      // Look for "Solution Architecture" or "Implementation" sections
      const solutionMatch = planContent.match(/## Solution Architecture\s+([\s\S]*?)(?=\n##|\n---|\Z)/);
      if (solutionMatch) {
        // Extract bullet points or numbered lists
        const bullets = solutionMatch[1].match(/^[\s]*[-*\d]+\.\s+(.+)$/gm);
        if (bullets) {
          return bullets.map(b => b.replace(/^[\s]*[-*\d]+\.\s+/, '').trim()).slice(0, 5);
        }
      }

      return ['See plan file for detailed decisions'];
    } catch (error) {
      return [`Error extracting decisions: ${error.message}`];
    }
  }

  /**
   * Generate session summary
   */
  generateSummary(planPath, featureName, options = {}) {
    this.ensureSessionsDir();

    const timestamp = options.timestamp || new Date().toISOString().split('T')[0];
    const slug = featureName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const outputPath = path.join(this.sessionsDir, `SESSION-${timestamp}-${slug}.md`);

    // Extract information
    const taskSummary = this.extractTaskSummary(planPath);
    const gitDiff = this.getGitDiff();
    const modifiedFiles = this.getModifiedFiles();
    const keyDecisions = this.extractKeyDecisions(planPath);

    // Generate template
    const template = `# Session: ${featureName}

**Date**: ${timestamp}
**Workflow**: ${options.workflow || 'Unknown'}
**Status**: ${options.status || '✅ Complete'}
**Token Usage**: ${options.tokenUsage || 'Not tracked'}

---

## Task Summary

${taskSummary}

---

## Files Modified

${modifiedFiles.length > 0 ? modifiedFiles.map(f => `- \`${f}\``).join('\n') : '(No files modified)'}

### Git Diff Summary

\`\`\`
${gitDiff}
\`\`\`

---

## Key Decisions

${keyDecisions.map((d, i) => `${i + 1}. ${d}`).join('\n')}

---

## Implementation Notes

${options.notes || '(Add manual notes here if needed)'}

---

## Follow-up Tasks

${options.followUp || '- [ ] Review and test changes\n- [ ] Update additional documentation if needed\n- [ ] Deploy to staging environment'}

---

## References

**Plan**: ${planPath || 'N/A'}
**Build Report**: ${options.buildReport || 'N/A'}

---

**Session ID**: ${timestamp}-${slug}
**Generated**: ${new Date().toISOString()}
`;

    fs.writeFileSync(outputPath, template, 'utf8');
    console.log(`✅ Generated session summary: ${outputPath}`);

    return outputPath;
  }

  /**
   * List all session summaries
   */
  listSessions() {
    if (!fs.existsSync(this.sessionsDir)) {
      return [];
    }

    const files = fs.readdirSync(this.sessionsDir)
      .filter(f => f.startsWith('SESSION-') && f.endsWith('.md'))
      .sort()
      .reverse(); // Most recent first

    return files;
  }

  /**
   * Display session summaries
   */
  displaySessions() {
    const sessions = this.listSessions();

    if (sessions.length === 0) {
      console.log('📋 No session summaries found');
      return;
    }

    console.log('📋 Session Summaries:\n');
    sessions.forEach((session, index) => {
      // Extract date and feature name from filename
      const match = session.match(/SESSION-(\d{4}-\d{2}-\d{2})-(.+)\.md/);
      if (match) {
        const [, date, slug] = match;
        const featureName = slug.replace(/-/g, ' ');
        console.log(`   ${index + 1}. [${date}] ${featureName}`);
      } else {
        console.log(`   ${index + 1}. ${session}`);
      }
    });

    console.log(`\n   Total: ${sessions.length} sessions`);
    console.log(`   Directory: ${this.sessionsDir}`);
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: node generate-session-summary.js <command> [arguments]

Commands:
  generate <plan-path> <feature-name> [workflow] [token-usage]
      Generate a session summary from a plan file

  list
      Display all session summaries

Examples:
  node generate-session-summary.js generate ai-docs/plans/plan.md "Add Authentication" "/full" "85K"
  node generate-session-summary.js list
`);
    process.exit(0);
  }

  const command = args[0];
  const generator = new SessionSummaryGenerator();

  try {
    switch (command) {
      case 'generate': {
        const planPath = args[1];
        const featureName = args[2];
        const workflow = args[3];
        const tokenUsage = args[4];

        if (!planPath || !featureName) {
          console.error('❌ Error: Plan path and feature name required');
          console.error('   Usage: generate <plan-path> <feature-name> [workflow] [token-usage]');
          process.exit(1);
        }

        const options = {};
        if (workflow) options.workflow = workflow;
        if (tokenUsage) options.tokenUsage = tokenUsage;

        generator.generateSummary(planPath, featureName, options);
        break;
      }

      case 'list': {
        generator.displaySessions();
        break;
      }

      default:
        console.error(`❌ Unknown command: ${command}`);
        console.error('   Run without arguments for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = SessionSummaryGenerator;
