/**
 * TEMPLATE-STATUS.md Parser
 *
 * Extracts pending, paused, and in-progress tasks from TEMPLATE-STATUS.md
 * and other similar documentation files.
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Task status patterns
 */
const STATUS_PATTERNS = {
  completed: /✅|COMPLETED|FIXED/i,
  paused: /⏸️|PAUSED/i,
  inProgress: /🚧|IN PROGRESS/i,
  pending: /⚪|PENDING|TODO/i,
  blocked: /🔴|BLOCKED/i
};

/**
 * Extract token estimate from text
 * Patterns: "~50K tokens", "50K tokens", "50000 tokens"
 */
function extractTokenEstimate(text) {
  const patterns = [
    /~?(\d+)K\s*tokens?/i,
    /~?(\d+),?(\d+)\s*tokens?/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      if (match[2]) {
        // Format: "50,000 tokens"
        return parseInt(match[1] + match[2]);
      } else if (match[1]) {
        // Format: "50K tokens"
        return parseInt(match[1]) * 1000;
      }
    }
  }

  return null;
}

/**
 * Extract time estimate from text
 * Patterns: "1-2 hours", "30 minutes", "45 min"
 */
function extractTimeEstimate(text) {
  const patterns = [
    /(\d+(?:-\d+)?)\s*(?:hours?|hrs?)/i,
    /(\d+)\s*(?:minutes?|mins?)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

/**
 * Determine task status from text
 */
function determineStatus(text) {
  for (const [status, pattern] of Object.entries(STATUS_PATTERNS)) {
    if (pattern.test(text)) {
      return status;
    }
  }
  return 'pending';
}

/**
 * Parse a task section from markdown
 *
 * @param {string} section - Markdown section text
 * @param {number} startLine - Starting line number
 * @param {string} sourceFile - Source file path
 * @returns {object|null} Task object or null
 */
function parseTaskSection(section, startLine, sourceFile) {
  const lines = section.split('\n');

  // Extract title (first heading)
  const titleMatch = section.match(/^###?\s+(.+?)$/m);
  if (!titleMatch) return null;

  const title = titleMatch[1].trim();
  const status = determineStatus(section);

  // Skip completed tasks by default
  if (status === 'completed') return null;

  // Extract metadata
  const tokenEstimate = extractTokenEstimate(section);
  const timeEstimate = extractTimeEstimate(section);

  // Extract priority (if mentioned)
  let priority = 'medium';
  if (/high priority|critical|urgent/i.test(section)) {
    priority = 'high';
  } else if (/low priority/i.test(section)) {
    priority = 'low';
  }

  // Generate task ID from title
  const taskId = `TEMPLATE-STATUS-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .substring(0, 30)}`;

  // Calculate end line
  const endLine = startLine + lines.length - 1;

  return {
    id: taskId,
    title,
    status,
    estimatedTokens: tokenEstimate,
    timeEstimate,
    priority,
    source: `${sourceFile}:${startLine}-${endLine}`,
    description: section.substring(0, 200).replace(/\n/g, ' ').trim() + '...'
  };
}

/**
 * Parse TEMPLATE-STATUS.md or similar documentation files
 *
 * @param {string} filePath - Path to the file
 * @returns {Promise<Array>} Array of task objects
 */
async function parseStartHereFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const tasks = [];

    // Split content into sections by headings
    const sections = [];
    let currentSection = { content: '', startLine: 1 };

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for heading (## or ###)
      if (/^###?\s/.test(line)) {
        if (currentSection.content) {
          sections.push(currentSection);
        }
        currentSection = { content: line + '\n', startLine: lineNumber };
      } else {
        currentSection.content += line + '\n';
      }
    });

    // Push last section
    if (currentSection.content) {
      sections.push(currentSection);
    }

    // Parse each section
    for (const section of sections) {
      const task = parseTaskSection(
        section.content,
        section.startLine,
        path.basename(filePath)
      );

      if (task) {
        tasks.push(task);
      }
    }

    return tasks;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      return [];
    }
    throw error;
  }
}

/**
 * Parse multiple task source files
 *
 * @param {Array<string>} filePaths - Array of file paths
 * @returns {Promise<Array>} Combined array of tasks
 */
async function parseMultipleFiles(filePaths) {
  const taskArrays = await Promise.all(
    filePaths.map(filePath => parseStartHereFile(filePath))
  );

  return taskArrays.flat();
}

module.exports = {
  parseStartHereFile,
  parseMultipleFiles,
  extractTokenEstimate,
  extractTimeEstimate,
  determineStatus
};
