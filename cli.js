const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.join(process.cwd(), 'workspace');
const TASKS_DIR = path.join(WORKSPACE_DIR, 'tasks');

/**
 * A simple function to convert a string to a URL-friendly slug.
 * @param {string} text - The text to slugify.
 * @returns {string} The slugified text.
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .substring(0, 50); // Truncate to 50 chars
}

/**
 * Finds the next available task ID by scanning the tasks directory.
 * @returns {number} The next task ID.
 */
function getNextTaskId() {
  if (!fs.existsSync(TASKS_DIR)) {
    return 1;
  }
  const existingTasks = fs.readdirSync(TASKS_DIR);
  const maxId = existingTasks.reduce((max, taskName) => {
    const match = taskName.match(/^TASK-(\d+)/);
    if (match) {
      const id = parseInt(match[1], 10);
      return Math.max(max, id);
    }
    return max;
  }, 0);
  return maxId + 1;
}

/**
 * Handles the 'start' command to create a new task.
 * @param {string[]} args - The arguments for the start command (the task description).
 */
function startTask(args) {
  const description = args.join(' ');
  if (!description) {
    console.error('❌ Error: Please provide a description for the task.');
    console.log('Usage: npm run agent:start "your task description"');
    return;
  }

  const taskId = getNextTaskId();
  const taskSlug = slugify(description);
  const taskDirName = `TASK-${String(taskId).padStart(3, '0')}-${taskSlug}`;
  const taskPath = path.join(TASKS_DIR, taskDirName);

  fs.mkdirSync(taskPath, { recursive: true });

  const taskMdContent = `# ${taskDirName}\n\n**Goal:** ${description}\n`;
  fs.writeFileSync(path.join(taskPath, 'task.md'), taskMdContent);
  fs.writeFileSync(path.join(taskPath, 'session.log'), `[${new Date().toISOString()}] Task created.\n`);

  console.log(`✅ Task created successfully!`);
  console.log(`   Your new task is located at: ${taskPath}`);
}

function main() {
  const [command, ...args] = process.argv.slice(2);

  if (command === 'start') {
    startTask(args);
  } else {
    console.log('Unknown command. Available commands: start');
  }
}

main();