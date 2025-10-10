#!/usr/bin/env node

/**
 * Project Scale Detection
 * Analyzes project to determine optimal workflow (Small/Medium/Large)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const fg = require('fast-glob');

class ProjectScaleDetector {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.appDir = path.join(projectRoot, 'app');
    this.results = {
      scale: 'UNKNOWN',
      metrics: {},
      recommendation: {},
      confidence: 0
    };
  }

  /**
   * Main detection method
   */
  detect() {
    console.log('🔍 Analyzing project scale...\n');

    // Gather metrics
    this.countFiles();
    this.countLinesOfCode();
    this.analyzeComplexity();
    this.checkDependencies();

    // Determine scale
    this.calculateScale();

    // Generate recommendation
    this.generateRecommendation();

    // Display results
    this.displayResults();

    return this.results;
  }

  /**
   * Count files in app/ directory
   */
  countFiles() {
    if (!fs.existsSync(this.appDir)) {
      this.results.metrics.fileCount = 0;
      return;
    }

    try {
      const output = execSync(`find "${this.appDir}" -type f | wc -l`, { encoding: 'utf8' });
      this.results.metrics.fileCount = parseInt(output.trim(), 10);
    } catch (error) {
      this.results.metrics.fileCount = 0;
    }
  }

  /**
   * Count lines of code using Node.js glob library
   */
  countLinesOfCode() {
    if (!fs.existsSync(this.appDir)) {
      this.results.metrics.loc = 0;
      return;
    }

    try {
      // Use fast-glob for reliable file matching across platforms
      const extensions = ['js', 'jsx', 'ts', 'tsx', 'py', 'go', 'java', 'rb', 'php'];
      const pattern = `${this.appDir}/**/*.{${extensions.join(',')}}`;
      const files = fg.sync(pattern, {
        onlyFiles: true,
        absolute: true,
        ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
      });

      let totalLines = 0;
      files.forEach(file => {
        try {
          const content = fs.readFileSync(file, 'utf8');
          totalLines += content.split('\n').length;
        } catch (readError) {
          // Skip files that can't be read
        }
      });

      this.results.metrics.loc = totalLines;
    } catch (error) {
      this.results.metrics.loc = 0;
    }
  }

  /**
   * Analyze code complexity indicators
   */
  analyzeComplexity() {
    const metrics = {
      hasTests: false,
      hasDatabase: false,
      hasAPI: false,
      hasDocker: false,
      hasMicroservices: false,
      dependencyCount: 0
    };

    // Check for test files
    metrics.hasTests = fs.existsSync(path.join(this.projectRoot, 'tests')) ||
                       fs.existsSync(path.join(this.projectRoot, 'test')) ||
                       fs.existsSync(path.join(this.appDir, '__tests__'));

    // Check for database files
    metrics.hasDatabase = fs.existsSync(path.join(this.projectRoot, 'migrations')) ||
                          fs.existsSync(path.join(this.appDir, 'models')) ||
                          fs.existsSync(path.join(this.appDir, 'database'));

    // Check for API
    metrics.hasAPI = fs.existsSync(path.join(this.appDir, 'api')) ||
                     fs.existsSync(path.join(this.appDir, 'routes')) ||
                     fs.existsSync(path.join(this.appDir, 'controllers'));

    // Check for Docker
    metrics.hasDocker = fs.existsSync(path.join(this.projectRoot, 'Dockerfile')) ||
                        fs.existsSync(path.join(this.projectRoot, 'docker-compose.yml'));

    // Check for microservices structure
    const possibleServices = ['app', 'services', 'backend', 'frontend'];
    let serviceCount = 0;
    possibleServices.forEach(dir => {
      const fullPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(fullPath)) {
        const subdirs = fs.readdirSync(fullPath).filter(item => {
          return fs.statSync(path.join(fullPath, item)).isDirectory();
        });
        serviceCount += subdirs.length;
      }
    });
    metrics.hasMicroservices = serviceCount > 3;

    this.results.metrics.complexity = metrics;
  }

  /**
   * Check dependencies
   */
  checkDependencies() {
    let depCount = 0;

    // Node.js
    const packageJson = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJson)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
        depCount += Object.keys(pkg.dependencies || {}).length;
        depCount += Object.keys(pkg.devDependencies || {}).length;
      } catch (error) {
        // Ignore parse errors
      }
    }

    // Python
    const requirementsTxt = path.join(this.projectRoot, 'requirements.txt');
    if (fs.existsSync(requirementsTxt)) {
      try {
        const content = fs.readFileSync(requirementsTxt, 'utf8');
        depCount += content.split('\n').filter(line => line.trim() && !line.startsWith('#')).length;
      } catch (error) {
        // Ignore read errors
      }
    }

    this.results.metrics.complexity.dependencyCount = depCount;
  }

  /**
   * Calculate project scale based on metrics
   */
  calculateScale() {
    const { fileCount, loc, complexity } = this.results.metrics;

    let score = 0;
    let factors = [];

    // File count scoring
    if (fileCount < 10) {
      score += 1;
      factors.push('Few files (<10)');
    } else if (fileCount < 50) {
      score += 2;
      factors.push('Moderate files (10-50)');
    } else {
      score += 3;
      factors.push('Many files (>50)');
    }

    // LOC scoring
    if (loc < 5000) {
      score += 1;
      factors.push('Small codebase (<5K LOC)');
    } else if (loc < 20000) {
      score += 2;
      factors.push('Medium codebase (5K-20K LOC)');
    } else {
      score += 3;
      factors.push('Large codebase (>20K LOC)');
    }

    // Complexity scoring
    if (complexity.hasTests) { score += 0.5; factors.push('Has tests'); }
    if (complexity.hasDatabase) { score += 0.5; factors.push('Has database'); }
    if (complexity.hasAPI) { score += 0.5; factors.push('Has API'); }
    if (complexity.hasDocker) { score += 0.3; factors.push('Has Docker'); }
    if (complexity.hasMicroservices) { score += 1; factors.push('Microservices architecture'); }

    // Dependency scoring
    if (complexity.dependencyCount > 50) {
      score += 1;
      factors.push('Many dependencies (>50)');
    } else if (complexity.dependencyCount > 20) {
      score += 0.5;
      factors.push('Some dependencies (20-50)');
    }

    // Determine scale
    if (score < 3) {
      this.results.scale = 'SMALL';
      this.results.confidence = 0.8 + (score / 10); // 0.8-0.9
    } else if (score < 6) {
      this.results.scale = 'MEDIUM';
      this.results.confidence = 0.7 + (score / 20); // 0.7-0.85
    } else {
      this.results.scale = 'LARGE';
      this.results.confidence = 0.8 + (score / 30); // 0.8-0.95
    }

    this.results.metrics.score = score;
    this.results.metrics.factors = factors;
  }

  /**
   * Generate workflow recommendation
   */
  generateRecommendation() {
    const scale = this.results.scale;

    const recommendations = {
      SMALL: {
        workflow: 'Direct Implementation or Quick Plan',
        command: 'Describe task directly or run /quick-plan "[task]" "[relevant-files]"',
        tokenBudget: '~10K tokens',
        tools: ['Codex MCP for light edits', 'Gemini MCP for reference lookups'],
        skipPhases: ['scout', 'plan_w_docs', 'build_w_report'],
        rationale: 'Small, low-risk changes can proceed without the full delegate chain.'
      },
      MEDIUM: {
        workflow: 'Scout -> Plan -> Build',
        command: '/scout_plan_build "[task]" "[doc urls or \"\"]"',
        tokenBudget: '~40K tokens',
        tools: ['Task-launched Gemini and Codex scouts', 'plan_w_docs for specs', 'build_w_report for implementation'],
        skipPhases: [],
        rationale: 'Moderate complexity benefits from the standard Reduce and Delegate chain with documentation awareness.'
      },
      LARGE: {
        workflow: 'Full Workflow with Reporting',
        command: '/scout_plan_build "[task]" "[doc urls]"',
        tokenBudget: '~100K tokens',
        tools: ['Parallel subagents via Task tool', 'plan_w_docs with external docs', 'build_w_report for audited delivery'],
        skipPhases: [],
        rationale: 'Large or high-risk work needs the full Reduce and Delegate sequence plus formal reporting.'
      }
    };

    this.results.recommendation = recommendations[scale] || recommendations.MEDIUM;
  }

  /**
   * Display results
   */
  displayResults() {
    const { scale, metrics, recommendation, confidence } = this.results;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Project Scale Analysis');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Metrics
    console.log('📈 Metrics:');
    console.log(`   Files: ${metrics.fileCount}`);
    console.log(`   Lines of Code: ${metrics.loc.toLocaleString()}`);
    console.log(`   Dependencies: ${metrics.complexity.dependencyCount}`);
    console.log(`   Features: ${Object.keys(metrics.complexity).filter(k => metrics.complexity[k] === true).join(', ')}\n`);

    // Scale
    const scaleEmoji = { SMALL: '🟢', MEDIUM: '🟡', LARGE: '🔴' }[scale] || '⚪';
    console.log(`${scaleEmoji} Project Scale: ${scale}`);
    console.log(`   Confidence: ${(confidence * 100).toFixed(0)}%`);
    console.log(`   Score: ${metrics.score.toFixed(1)}/10\n`);

    // Factors
    console.log('📋 Contributing Factors:');
    metrics.factors.forEach(factor => {
      console.log(`   • ${factor}`);
    });
    console.log('');

    // Recommendation
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Recommended Workflow');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`🚀 Workflow: ${recommendation.workflow}`);
    console.log(`💬 Command: ${recommendation.command}`);
    console.log(`🎯 Token Budget: ${recommendation.tokenBudget}\n`);

    console.log('🔧 Recommended Tools:');
    recommendation.tools.forEach(tool => {
      console.log(`   • ${tool}`);
    });
    console.log('');

    if (recommendation.skipPhases.length > 0) {
      console.log('⏭️  Skip These Phases:');
      recommendation.skipPhases.forEach(phase => {
        console.log(`   • ${phase}`);
      });
      console.log('');
    }

    console.log(`📝 Rationale: ${recommendation.rationale}\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  /**
   * Save results to file
   */
  saveResults(outputPath) {
    const output = {
      timestamp: new Date().toISOString(),
      projectRoot: this.projectRoot,
      ...this.results
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
    console.log(`✅ Results saved to: ${outputPath}\n`);
  }
}

// CLI execution
if (require.main === module) {
  const detector = new ProjectScaleDetector();
  const results = detector.detect();

  // Optionally save to file
  const outputDir = path.join(detector.projectRoot, 'ai-docs', 'logs');
  if (fs.existsSync(outputDir)) {
    const outputFile = path.join(outputDir, 'project-scale.json');
    detector.saveResults(outputFile);
  }

  // Exit with scale code for scripting
  const exitCodes = { SMALL: 1, MEDIUM: 2, LARGE: 3, UNKNOWN: 0 };
  process.exit(exitCodes[results.scale] || 0);
}

module.exports = ProjectScaleDetector;
