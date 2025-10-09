---
description: End-to-end workflow to add a new feature with planning, building, testing, and documentation.
argument-hint: [feature_description]
---

## Instructions

# 1. Scout for relevant files (e.g., existing API files, user models)
Use Task tool:
  subagent_type: general-purpose
  description: "Scout for existing API and user-related files"
  prompt: |
    TOOL: Use Gemini MCP
    TASK: Find files related to user management, authentication, and API endpoints based on the feature description: "{FEATURE_DESCRIPTION}".
    Return structured list of file paths and relevant code snippets.

# 2. Plan the feature implementation
Use Task tool:
  subagent_type: general-purpose
  description: "Generate a plan for the new feature"
  prompt: |
    TOOL: Use Claude
    TASK: Based on the scouted files and the feature description "{FEATURE_DESCRIPTION}", create a detailed implementation plan for adding a new user registration endpoint.
    The plan should include:
    - Required file modifications/creations.
    - High-level steps for implementation (e.g., route definition, input validation, user creation, response).
    - Potential risks or considerations.
    Return the plan in markdown format.

# 3. Build the feature (add API endpoint)
Use Task tool:
  subagent_type: general-purpose
  description: "Implement the new user registration API endpoint"
  prompt: |
    TOOL: Use Codex MCP
    TASK: Implement a new POST /api/register endpoint.
    The endpoint should:
    - Accept 'email' and 'password' in the request body.
    - Validate email format and password strength (e.g., min 8 chars).
    - Return a success message or appropriate error.
    - Integrate with a placeholder user creation function (e.g., `createUser(email, password)`).
    Use the plan generated in the previous step as a guide.
    Return the code for the new endpoint, including any necessary imports.

# 4. Generate a test for the new feature
Use Task tool:
  subagent_type: general-purpose
  description: "Generate a test for the new user registration endpoint"
  prompt: |
    TOOL: Use Codex MCP
    TASK: Write an integration test for the POST /api/register endpoint.
    The test should:
    - Use a testing framework (e.g., Supertest if Express.js is assumed).
    - Test successful registration with valid data.
    - Test registration failure with invalid email.
    - Test registration failure with weak password.
    Return the test code in a new file (e.g., `test/register.test.js`).

# 5. Generate documentation for the new feature
Use Task tool:
  subagent_type: general-purpose
  description: "Generate documentation for the new user registration endpoint"
  prompt: |
    TOOL: Use Gemini MCP
    TASK: Create API documentation for the new POST /api/register endpoint.
    The documentation should include:
    - Endpoint URL and HTTP method.
    - Request body parameters (email, password) and their types/constraints.
    - Example request and response (success and error).
    - A brief description of the endpoint's purpose.
    Return the documentation in markdown format, suitable for `app-docs/api/`.
