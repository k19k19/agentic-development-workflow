#!/usr/bin/env node

/**
 * Update Feature-to-Source Mapping
 * Programmatically updates app-docs/mappings/feature-to-source.md
 */

const fs = require('fs');
const path = require('path');

class MappingUpdater {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.mappingFile = path.join(projectRoot, 'app-docs', 'mappings', 'feature-to-source.md');
  }

  /**
   * Ensure mapping file exists
   */
  ensureMappingFile() {
    const dir = path.dirname(this.mappingFile);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create file if it doesn't exist
    if (!fs.existsSync(this.mappingFile)) {
      const template = `# Feature to Source Mapping

This file maps features to their source code locations. Auto-updated by the build workflow.

---

`;
      fs.writeFileSync(this.mappingFile, template, 'utf8');
      console.log(`✅ Created new mapping file: ${this.mappingFile}`);
    }
  }

  /**
   * Check if feature already exists in mapping
   */
  featureExists(featureName) {
    if (!fs.existsSync(this.mappingFile)) {
      return false;
    }

    const content = fs.readFileSync(this.mappingFile, 'utf8');
    const headerPattern = new RegExp(`^## ${featureName}$`, 'm');
    return headerPattern.test(content);
  }

  /**
   * Update or add feature mapping
   */
  updateMapping(featureName, files, options = {}) {
    this.ensureMappingFile();

    let content = fs.readFileSync(this.mappingFile, 'utf8');
    const timestamp = options.timestamp || new Date().toISOString().split('T')[0];

    // Build new entry
    const fileList = files.map(f => `  - \`${f}\``).join('\n');
    const entry = `## ${featureName}

**Added**: ${timestamp}
**Files**:
${fileList}

---

`;

    // Check if feature exists
    if (this.featureExists(featureName)) {
      // Replace existing entry
      const headerPattern = new RegExp(`## ${featureName}[\\s\\S]*?(?=## |$)`, 'm');
      content = content.replace(headerPattern, entry);
      console.log(`✅ Updated existing mapping for: ${featureName}`);
    } else {
      // Append new entry
      content += entry;
      console.log(`✅ Added new mapping for: ${featureName}`);
    }

    fs.writeFileSync(this.mappingFile, content, 'utf8');
    console.log(`   Location: ${this.mappingFile}`);
  }

  /**
   * List all feature mappings
   */
  listMappings() {
    if (!fs.existsSync(this.mappingFile)) {
      console.log('⚠️  No mappings file found');
      return [];
    }

    const content = fs.readFileSync(this.mappingFile, 'utf8');
    const headerPattern = /^## (.+)$/gm;
    const features = [];
    let match;

    while ((match = headerPattern.exec(content)) !== null) {
      features.push(match[1]);
    }

    return features;
  }

  /**
   * Display all mappings
   */
  displayMappings() {
    const features = this.listMappings();

    if (features.length === 0) {
      console.log('📋 No feature mappings found');
      return;
    }

    console.log('📋 Feature Mappings:\n');
    features.forEach((feature, index) => {
      console.log(`   ${index + 1}. ${feature}`);
    });
    console.log(`\n   Total: ${features.length} features`);
    console.log(`   File: ${this.mappingFile}`);
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: node update-mappings.js <command> [arguments]

Commands:
  update <feature-name> <file1> [file2] [file3] ...
      Update or add a feature mapping

  list
      Display all feature mappings

Examples:
  node update-mappings.js update "Authentication" src/auth/login.js src/auth/session.js
  node update-mappings.js list
`);
    process.exit(0);
  }

  const command = args[0];
  const updater = new MappingUpdater();

  try {
    switch (command) {
      case 'update': {
        const featureName = args[1];
        const files = args.slice(2);

        if (!featureName || files.length === 0) {
          console.error('❌ Error: Feature name and at least one file required');
          console.error('   Usage: update <feature-name> <file1> [file2] ...');
          process.exit(1);
        }

        updater.updateMapping(featureName, files);
        break;
      }

      case 'list': {
        updater.displayMappings();
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

module.exports = MappingUpdater;
