#!/usr/bin/env node

/**
 * Smart Test Runner
 * Automatically detects and runs tests based on available test frameworks
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SmartTestRunner {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.packageJson = this.loadPackageJson();
  }

  /**
   * Load package.json
   */
  loadPackageJson() {
    const pkgPath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      return null;
    }

    try {
      return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    } catch (error) {
      console.error('⚠️  Failed to parse package.json:', error.message);
      return null;
    }
  }

  /**
   * Get all dependencies
   */
  getAllDependencies() {
    if (!this.packageJson) {
      return {};
    }

    return {
      ...this.packageJson.dependencies || {},
      ...this.packageJson.devDependencies || {}
    };
  }

  /**
   * Detect available test framework
   */
  detectTestFramework() {
    const deps = this.getAllDependencies();

    // Check in order of preference
    if (deps.jest || deps['@jest/core']) {
      return 'jest';
    } else if (deps.vitest) {
      return 'vitest';
    } else if (deps.mocha) {
      return 'mocha';
    } else if (deps.ava) {
      return 'ava';
    } else if (deps.tape) {
      return 'tape';
    } else if (deps.jasmine) {
      return 'jasmine';
    }

    return null;
  }

  /**
   * Check if test files exist
   */
  hasTestFiles() {
    const testDirs = ['test', 'tests', '__tests__', 'spec'];
    const testPatterns = ['*.test.js', '*.spec.js', '*.test.ts', '*.spec.ts'];

    // Check for test directories
    for (const dir of testDirs) {
      const fullPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(fullPath)) {
        return true;
      }
    }

    // Check for test files in root
    try {
      const files = fs.readdirSync(this.projectRoot);
      for (const file of files) {
        if (testPatterns.some(pattern => {
          const regex = new RegExp(pattern.replace('*', '.*'));
          return regex.test(file);
        })) {
          return true;
        }
      }
    } catch (error) {
      // Ignore read errors
    }

    return false;
  }

  /**
   * Run tests with detected framework
   */
  runTests() {
    const framework = this.detectTestFramework();

    // Template mode: No tests configured
    if (!framework && !this.hasTestFiles()) {
      console.log('✅ No tests defined (template mode)');
      console.log('   Add test framework to package.json to enable testing');
      return 0;
    }

    // Tests exist but no framework detected
    if (!framework) {
      console.error('❌ Test files found but no test framework detected');
      console.error('   Install one of: jest, vitest, mocha, ava, tape, jasmine');
      return 1;
    }

    // Run tests with detected framework
    console.log(`🧪 Running tests with ${framework}...\n`);

    try {
      switch (framework) {
        case 'jest':
          execSync('npx jest', { stdio: 'inherit' });
          break;
        case 'vitest':
          execSync('npx vitest run', { stdio: 'inherit' });
          break;
        case 'mocha':
          execSync('npx mocha', { stdio: 'inherit' });
          break;
        case 'ava':
          execSync('npx ava', { stdio: 'inherit' });
          break;
        case 'tape':
          execSync('npx tape "**/*.test.js"', { stdio: 'inherit' });
          break;
        case 'jasmine':
          execSync('npx jasmine', { stdio: 'inherit' });
          break;
        default:
          console.error(`❌ Unknown test framework: ${framework}`);
          return 1;
      }

      console.log('\n✅ All tests passed');
      return 0;
    } catch (error) {
      console.error('\n❌ Tests failed');
      return error.status || 1;
    }
  }
}

// CLI execution
if (require.main === module) {
  const runner = new SmartTestRunner();
  const exitCode = runner.runTests();
  process.exit(exitCode);
}

module.exports = SmartTestRunner;
