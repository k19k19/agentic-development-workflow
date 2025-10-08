# Known Issues

This document lists known issues and their resolutions. This helps prevent the AI from making the same mistakes twice.

## Issue: User session not persisting

- **Symptom:** Users are logged out after refreshing the page.
- **Cause:** The session secret was not correctly configured in the production environment.
- **Resolution:** Ensure the `SESSION_SECRET` environment variable is set.
