# Specifications Directory

This directory contains **human-written feature specifications** created BEFORE implementation.

## Purpose

- Document feature requirements before coding
- Provide context for `/plan` slash command
- Track approved vs pending features
- Create audit trail for decision-making

## File Naming Convention

```
[round-type]-[feature-name].md       # Feature specs
bug-[id]-[description].md            # Bug fix specs
```

**Examples**:
- `round1-user-authentication.md`
- `round2-oauth-integration.md`
- `bug-123-login-timeout-fix.md`

## Template

See `_EXAMPLE-feature-spec.md` for structure.

## Workflow

### 1. Write Spec (Human)
```bash
# Create new spec
vim app-docs/specs/round1-caching.md
```

### 2. Plan (AI)
```bash
# AI reads spec and creates plan
/plan "Implement caching" "" ""
# Output: ai-docs/plans/[timestamp]-caching/plan.md
```

### 3. Approve (Human)
```bash
# Review the plan
cat ai-docs/plans/[timestamp]-caching/plan.md
# Approve or request changes
```

### 4. Build (AI)
```bash
# AI implements the plan
/build "ai-docs/plans/[timestamp]-caching/plan.md"
```

## Spec vs Plan

| Document | Author | Location | Committed |
|----------|--------|----------|-----------|
| **Spec** | Human | `app-docs/specs/` | ✅ Yes |
| **Plan** | AI | `ai-docs/plans/` | ❌ No (gitignored) |

**Spec** = What to build (requirements)
**Plan** = How to build it (implementation strategy)

## Example Spec Structure

```markdown
# Feature: User Authentication

## Problem
Users can't securely access their accounts.

## Requirements
- JWT-based authentication
- Login/logout endpoints
- Password hashing (bcrypt)
- Token refresh flow

## Constraints
- Must work with existing API structure
- No breaking changes
- Support for OAuth2 (future)

## Success Criteria
- [ ] Users can login with email/password
- [ ] Tokens expire after 1 hour
- [ ] Refresh tokens work correctly
- [ ] All endpoints are protected

## References
- [JWT spec](https://jwt.io)
- [OAuth2 future planning](https://oauth.net/2/)
```

## Tips

1. **Write specs first** - Don't code before documenting requirements
2. **Be specific** - Vague specs lead to wrong implementations
3. **Include constraints** - What NOT to do is as important as what to do
4. **Reference docs** - Link to external documentation
5. **Update after changes** - Keep specs in sync with reality

## Related

- **Plans**: `ai-docs/plans/` (AI-generated implementation plans)
- **Mappings**: `app-docs/mappings/feature-to-source.md` (where code lives)
- **Guides**: `app-docs/guides/implementation-guidelines.md` (coding standards)

---

**Last Updated**: October 2025
