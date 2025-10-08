---
command: "/search_vector_store"
display_name: "Search Vector Store"
description: "Searches the project's vector store for relevant documentation based on a query."
parameters:
  - name: "query"
    type: "string"
    description: "The search query to find relevant documentation."
    required: true
---

## Search Vector Store

This command allows you to search the project's vectorized documentation for relevant information. It uses semantic search to find document chunks that are most similar to your query.

### Usage

```
/search_vector_store "your search query here"
```

### Example

```
/search_vector_store "how to add a new API endpoint"
```

### Implementation Details

This command executes the `scripts/search-docs.js` script with your provided query. The script will return the top N most relevant document chunks from the `vector-store.json`.

```bash
node scripts/search-docs.js "$query"
```
