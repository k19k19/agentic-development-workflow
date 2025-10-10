/**
 * Unit tests for Token Budget Calculator
 */

const calculator = require('./token-budget-calculator');

// Test getRemainingBudget
function testGetRemainingBudget() {
  const tests = [
    { limit: 167000, used: 0, expected: 167000 },
    { limit: 167000, used: 50000, expected: 117000 },
    { limit: 167000, used: 167000, expected: 0 },
    { limit: 167000, used: 200000, expected: 0 } // Over limit
  ];

  console.log('Testing getRemainingBudget...');
  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    const result = calculator.getRemainingBudget(test.limit, test.used);
    if (result === test.expected) {
      console.log(`  ✅ Test ${index + 1}: PASS`);
      passed++;
    } else {
      console.log(`  ❌ Test ${index + 1}: FAIL`);
      console.log(`     Limit: ${test.limit}, Used: ${test.used}`);
      console.log(`     Expected: ${test.expected}, Got: ${result}`);
      failed++;
    }
  });

  return { passed, failed };
}

// Test getUsagePercent
function testGetUsagePercent() {
  const tests = [
    { used: 0, limit: 167000, expected: 0 },
    { used: 83500, limit: 167000, expected: 50 },
    { used: 125250, limit: 167000, expected: 75 },
    { used: 150300, limit: 167000, expected: 90 },
    { used: 167000, limit: 167000, expected: 100 }
  ];

  console.log('\nTesting getUsagePercent...');
  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    const result = calculator.getUsagePercent(test.used, test.limit);
    const rounded = Math.round(result);
    if (rounded === test.expected) {
      console.log(`  ✅ Test ${index + 1}: PASS`);
      passed++;
    } else {
      console.log(`  ❌ Test ${index + 1}: FAIL`);
      console.log(`     Used: ${test.used}, Limit: ${test.limit}`);
      console.log(`     Expected: ${test.expected}%, Got: ${rounded}%`);
      failed++;
    }
  });

  return { passed, failed };
}

// Test getUsageWarningLevel
function testGetUsageWarningLevel() {
  const tests = [
    { percent: 0, expected: 'normal' },
    { percent: 50, expected: 'normal' },
    { percent: 74, expected: 'normal' },
    { percent: 75, expected: 'warning' },
    { percent: 85, expected: 'warning' },
    { percent: 89, expected: 'warning' },
    { percent: 90, expected: 'critical' },
    { percent: 95, expected: 'critical' },
    { percent: 100, expected: 'critical' }
  ];

  console.log('\nTesting getUsageWarningLevel...');
  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    const result = calculator.getUsageWarningLevel(test.percent);
    if (result === test.expected) {
      console.log(`  ✅ Test ${index + 1}: PASS`);
      passed++;
    } else {
      console.log(`  ❌ Test ${index + 1}: FAIL`);
      console.log(`     Percent: ${test.percent}%`);
      console.log(`     Expected: ${test.expected}, Got: ${result}`);
      failed++;
    }
  });

  return { passed, failed };
}

// Test getRecommendedTasks
function testGetRecommendedTasks() {
  const tasks = [
    { id: 'TASK-1', title: 'Small task', estimatedTokens: 5000, priority: 'medium', status: 'pending' },
    { id: 'TASK-2', title: 'Medium task', estimatedTokens: 30000, priority: 'high', status: 'pending' },
    { id: 'TASK-3', title: 'Large task', estimatedTokens: 90000, priority: 'low', status: 'pending' },
    { id: 'TASK-4', title: 'Completed', estimatedTokens: 5000, priority: 'high', status: 'completed' }
  ];

  const tests = [
    {
      remaining: 100000,
      expectedIds: ['TASK-2', 'TASK-1', 'TASK-3'], // High priority first, then by size
      description: 'All non-completed tasks fit'
    },
    {
      remaining: 50000,
      expectedIds: ['TASK-2', 'TASK-1'], // Only small and medium fit
      description: 'Only small/medium tasks fit'
    },
    {
      remaining: 10000,
      expectedIds: ['TASK-1'], // Only small fits
      description: 'Only small task fits'
    },
    {
      remaining: 1000,
      expectedIds: [], // None fit
      description: 'No tasks fit'
    }
  ];

  console.log('\nTesting getRecommendedTasks...');
  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    const result = calculator.getRecommendedTasks(tasks, test.remaining);
    const resultIds = result.map(t => t.id);
    const match = JSON.stringify(resultIds) === JSON.stringify(test.expectedIds);

    if (match) {
      console.log(`  ✅ Test ${index + 1}: PASS (${test.description})`);
      passed++;
    } else {
      console.log(`  ❌ Test ${index + 1}: FAIL (${test.description})`);
      console.log(`     Remaining: ${test.remaining}`);
      console.log(`     Expected: [${test.expectedIds.join(', ')}]`);
      console.log(`     Got: [${resultIds.join(', ')}]`);
      failed++;
    }
  });

  return { passed, failed };
}

// Test getSuggestedWorkflows
function testGetSuggestedWorkflows() {
  const tests = [
    {
      remaining: 200000,
      expectedCount: 4,
      description: 'All workflows available'
    },
    {
      remaining: 100000,
      expectedCount: 3,
      description: 'Large, medium, small available'
    },
    {
      remaining: 50000,
      expectedCount: 2,
      description: 'Medium, small available'
    },
    {
      remaining: 10000,
      expectedCount: 1,
      description: 'Only small available'
    },
    {
      remaining: 1000,
      expectedCount: 0,
      description: 'No workflows available'
    }
  ];

  console.log('\nTesting getSuggestedWorkflows...');
  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    const result = calculator.getSuggestedWorkflows(test.remaining);
    if (result.length === test.expectedCount) {
      console.log(`  ✅ Test ${index + 1}: PASS (${test.description})`);
      passed++;
    } else {
      console.log(`  ❌ Test ${index + 1}: FAIL (${test.description})`);
      console.log(`     Remaining: ${test.remaining}`);
      console.log(`     Expected: ${test.expectedCount} workflows`);
      console.log(`     Got: ${result.length} workflows`);
      failed++;
    }
  });

  return { passed, failed };
}

// Test formatTokens
function testFormatTokens() {
  const tests = [
    { input: 1000, expected: '1,000' },
    { input: 50000, expected: '50,000' },
    { input: 167000, expected: '167,000' },
    { input: 1000000, expected: '1,000,000' }
  ];

  console.log('\nTesting formatTokens...');
  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    const result = calculator.formatTokens(test.input);
    if (result === test.expected) {
      console.log(`  ✅ Test ${index + 1}: PASS`);
      passed++;
    } else {
      console.log(`  ❌ Test ${index + 1}: FAIL`);
      console.log(`     Input: ${test.input}`);
      console.log(`     Expected: "${test.expected}", Got: "${result}"`);
      failed++;
    }
  });

  return { passed, failed };
}

// Run all tests
(async () => {
  console.log('\n========================================');
  console.log('Token Budget Calculator Unit Tests');
  console.log('========================================\n');

  const results = [];

  results.push(testGetRemainingBudget());
  results.push(testGetUsagePercent());
  results.push(testGetUsageWarningLevel());
  results.push(testGetRecommendedTasks());
  results.push(testGetSuggestedWorkflows());
  results.push(testFormatTokens());

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
