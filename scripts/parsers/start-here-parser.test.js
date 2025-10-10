/**
 * Unit tests for START-HERE.md parser
 */

const parser = require('./start-here-parser');

// Test extractTokenEstimate
function testExtractTokenEstimate() {
  const tests = [
    { input: 'This task uses ~50K tokens', expected: 50000 },
    { input: 'Estimated: 30K tokens', expected: 30000 },
    { input: 'Uses 125,000 tokens total', expected: 125000 },
    { input: 'About 5K tokens', expected: 5000 },
    { input: 'No token mention here', expected: null }
  ];

  console.log('Testing extractTokenEstimate...');
  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    const result = parser.extractTokenEstimate(test.input);
    if (result === test.expected) {
      console.log(`  ✅ Test ${index + 1}: PASS`);
      passed++;
    } else {
      console.log(`  ❌ Test ${index + 1}: FAIL`);
      console.log(`     Input: "${test.input}"`);
      console.log(`     Expected: ${test.expected}, Got: ${result}`);
      failed++;
    }
  });

  return { passed, failed };
}

// Test extractTimeEstimate
function testExtractTimeEstimate() {
  const tests = [
    { input: 'Takes 1-2 hours', expected: '1-2 hours' },
    { input: 'About 30 minutes', expected: '30 minutes' },
    { input: 'Estimated: 45 min', expected: '45 min' },
    { input: '3 hrs to complete', expected: '3 hrs' },
    { input: 'No time mentioned', expected: null }
  ];

  console.log('\nTesting extractTimeEstimate...');
  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    const result = parser.extractTimeEstimate(test.input);
    if (result === test.expected) {
      console.log(`  ✅ Test ${index + 1}: PASS`);
      passed++;
    } else {
      console.log(`  ❌ Test ${index + 1}: FAIL`);
      console.log(`     Input: "${test.input}"`);
      console.log(`     Expected: ${test.expected}, Got: ${result}`);
      failed++;
    }
  });

  return { passed, failed };
}

// Test determineStatus
function testDetermineStatus() {
  const tests = [
    { input: '✅ COMPLETED task', expected: 'completed' },
    { input: '⏸️ PAUSED for review', expected: 'paused' },
    { input: '🚧 IN PROGRESS work', expected: 'inProgress' },
    { input: '⚪ PENDING task', expected: 'pending' },
    { input: 'Task is FIXED', expected: 'completed' },
    { input: 'Regular text', expected: 'pending' }
  ];

  console.log('\nTesting determineStatus...');
  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    const result = parser.determineStatus(test.input);
    if (result === test.expected) {
      console.log(`  ✅ Test ${index + 1}: PASS`);
      passed++;
    } else {
      console.log(`  ❌ Test ${index + 1}: FAIL`);
      console.log(`     Input: "${test.input}"`);
      console.log(`     Expected: ${test.expected}, Got: ${result}`);
      failed++;
    }
  });

  return { passed, failed };
}

// Run all tests
(async () => {
  console.log('\n========================================');
  console.log('START-HERE Parser Unit Tests');
  console.log('========================================\n');

  const results = [];

  results.push(testExtractTokenEstimate());
  results.push(testExtractTimeEstimate());
  results.push(testDetermineStatus());

  // Summary
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0);

  console.log('\n========================================');
  console.log('Test Summary');
  console.log('========================================');
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`📊 Total:  ${totalPassed + totalFailed}`);

  if (totalFailed === 0) {
    console.log('\n🎉 All tests passed!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed.\n');
    process.exit(1);
  }
})();
