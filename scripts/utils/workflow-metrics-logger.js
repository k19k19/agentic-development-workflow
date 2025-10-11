const fs = require('fs').promises;
const path = require('path');

const METRICS_FILE = path.join(__dirname, '../../ai-docs/logs/workflow-metrics.jsonl');

/**
 * Logs workflow metrics to JSONL file
 */
class WorkflowMetricsLogger {
  async log(entry) {
    const line = JSON.stringify({
      timestamp: new Date().toISOString(),
      ...entry
    }) + '\n';

    await fs.mkdir(path.dirname(METRICS_FILE), { recursive: true });
    await fs.appendFile(METRICS_FILE, line);
  }

  async logWorkflow(workflowType, taskId, tokenUsage, metadata = {}) {
    const entry = {
      type: 'workflow',
      workflow: workflowType,
      taskId,
      tokens: {
        total: tokenUsage.reduce((sum, u) => sum + u.totalTokens, 0),
        byModel: tokenUsage.reduce((acc, u) => {
          acc[u.model] = {
            input: u.inputTokens,
            output: u.outputTokens,
            total: u.totalTokens
          };
          return acc;
        }, {})
      },
      metadata
    };

    await this.log(entry);
  }

  async getEfficiency(days = 7) {
    try {
      const content = await fs.readFile(METRICS_FILE, 'utf8');
      const lines = content.trim().split('\n');
      const entries = lines.map(l => JSON.parse(l));

      // Filter to recent entries
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      const recent = entries.filter(e =>
        new Date(e.timestamp) >= cutoff
      );

      if (recent.length === 0) return null;

      // Calculate efficiency metrics
      const totalTokens = recent.reduce((sum, e) => sum + (e.tokens?.total || 0), 0);
      const avgPerWorkflow = totalTokens / recent.length;

      // Model breakdown
      const modelUsage = {};
      recent.forEach(e => {
        if (!e.tokens?.byModel) return;

        Object.entries(e.tokens.byModel).forEach(([model, tokens]) => {
          if (!modelUsage[model]) {
            modelUsage[model] = { input: 0, output: 0, total: 0 };
          }
          modelUsage[model].input += tokens.input;
          modelUsage[model].output += tokens.output;
          modelUsage[model].total += tokens.total;
        });
      });

      return {
        period: `${days} days`,
        workflows: recent.length,
        totalTokens,
        avgPerWorkflow: Math.round(avgPerWorkflow),
        modelUsage,
        efficiency: this._calculateEfficiency(modelUsage, totalTokens)
      };
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }

  _calculateEfficiency(modelUsage, totalTokens) {
    // Efficiency = % of tokens from cheaper models (Gemini/Codex)
    const cheapTokens =
      (modelUsage['gemini-2.5-pro']?.total || 0) +
      (modelUsage['gemini-2.5-flash']?.total || 0) +
      (modelUsage['codex']?.total || 0);

    if (totalTokens === 0) return 0;
    return Math.round((cheapTokens / totalTokens) * 100);
  }
}

module.exports = new WorkflowMetricsLogger();
