#!/usr/bin/env node

/**
 * Validate Plan ID Format
 *
 * Ensures plan IDs follow the standard format: YYYYMMDD-HHMMSS-feature-name
 * Detects common issues like shell syntax in IDs, missing components, etc.
 */

/**
 * Validate a plan ID
 * @param {string} planId - Plan ID to validate
 * @returns {{valid: boolean, errors: string[]}}
 */
function validatePlanId(planId) {
  const errors = [];

  // Check for shell syntax
  if (planId.includes('$(') || planId.includes('`')) {
    errors.push('Plan ID contains shell syntax that was not expanded');
  }

  if (planId.includes('$')) {
    errors.push('Plan ID contains unresolved shell variables');
  }

  // Check format: YYYYMMDD-HHMMSS-feature-name
  const formatRegex = /^(\d{8})-(\d{6})-(.+)$/;
  const match = planId.match(formatRegex);

  if (!match) {
    errors.push('Plan ID does not match expected format: YYYYMMDD-HHMMSS-feature-name');
    return { valid: false, errors };
  }

  const [, date, time, feature] = match;

  // Validate date
  const year = parseInt(date.substr(0, 4));
  const month = parseInt(date.substr(4, 2));
  const day = parseInt(date.substr(6, 2));

  if (year < 2020 || year > 2100) {
    errors.push(`Invalid year: ${year}`);
  }

  if (month < 1 || month > 12) {
    errors.push(`Invalid month: ${month}`);
  }

  if (day < 1 || day > 31) {
    errors.push(`Invalid day: ${day}`);
  }

  // Validate time
  const hour = parseInt(time.substr(0, 2));
  const minute = parseInt(time.substr(2, 2));
  const second = parseInt(time.substr(4, 2));

  if (hour > 23) {
    errors.push(`Invalid hour: ${hour}`);
  }

  if (minute > 59) {
    errors.push(`Invalid minute: ${minute}`);
  }

  if (second > 59) {
    errors.push(`Invalid second: ${second}`);
  }

  // Validate feature name
  if (!feature || feature.length < 3) {
    errors.push('Feature name is too short (minimum 3 characters)');
  }

  if (feature.match(/[^a-z0-9-]/)) {
    errors.push('Feature name should only contain lowercase letters, numbers, and hyphens');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generate a valid plan ID
 * @param {string} featureName - Feature name (will be kebab-cased)
 * @param {Date} [date] - Date to use (defaults to now)
 * @returns {string} Valid plan ID
 */
function generatePlanId(featureName, date = new Date()) {
  // Convert feature name to kebab-case
  const kebabFeature = featureName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Format date as YYYYMMDD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  // Format time as HHMMSS
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  const timeStr = `${hour}${minute}${second}`;

  return `${dateStr}-${timeStr}-${kebabFeature}`;
}

// CLI Interface
if (require.main === module) {
  const [,, command, ...args] = process.argv;

  switch (command) {
    case 'validate': {
      const planId = args[0];
      if (!planId) {
        console.error('Usage: node validate-plan-id.js validate <plan-id>');
        process.exit(1);
      }

      const result = validatePlanId(planId);

      if (result.valid) {
        console.log(`✅ Plan ID is valid: ${planId}`);
        process.exit(0);
      } else {
        console.error(`❌ Plan ID is invalid: ${planId}\n`);
        result.errors.forEach(error => {
          console.error(`   • ${error}`);
        });
        process.exit(1);
      }
    }

    case 'generate': {
      const featureName = args.join(' ');
      if (!featureName) {
        console.error('Usage: node validate-plan-id.js generate <feature-name>');
        process.exit(1);
      }

      const planId = generatePlanId(featureName);
      console.log(planId);
      process.exit(0);
    }

    default:
      console.log(`
Plan ID Validation Tool

Usage:
  node scripts/validate-plan-id.js validate <plan-id>
    Check if a plan ID is valid

  node scripts/validate-plan-id.js generate <feature-name>
    Generate a valid plan ID from a feature name

Examples:
  node scripts/validate-plan-id.js validate 20251011-131913-knowledge-ledger
  node scripts/validate-plan-id.js generate "User Authentication System"
      `);
      process.exit(0);
  }
}

module.exports = {
  validatePlanId,
  generatePlanId
};
