const { pipeline } = require('@xenova/transformers');
const fs = require('fs').promises;
const path = require('path');

// --- Configuration ---
const VECTOR_STORE_PATH = path.join(__dirname, '..', 'vector-store.json');
const DEFAULT_LIMIT = 3;
const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';

// --- Embedding Pipeline ---
let extractor;

async function initializePipeline() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', EMBEDDING_MODEL);
  }
  return extractor;
}

function dotProduct(vecA, vecB) {
  let product = 0;
  for (let i = 0; i < vecA.length; i += 1) {
    product += vecA[i] * vecB[i];
  }
  return product;
}

function magnitude(vec) {
  let sum = 0;
  for (let i = 0; i < vec.length; i += 1) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}

function cosineSimilarity(vecA, vecB) {
  const dot = dotProduct(vecA, vecB);
  const magA = magnitude(vecA);
  const magB = magnitude(vecB);
  if (magA === 0 || magB === 0) {
    return 0;
  }
  return dot / (magA * magB);
}

function parseArguments(argv) {
  const args = { query: [], root: null, docType: null, limit: DEFAULT_LIMIT };
  argv.forEach((arg) => {
    if (arg.startsWith('--root=')) {
      args.root = arg.slice('--root='.length);
    } else if (arg.startsWith('--doc=')) {
      args.docType = arg.slice('--doc='.length);
    } else if (arg.startsWith('--limit=')) {
      const value = parseInt(arg.slice('--limit='.length), 10);
      if (!Number.isNaN(value) && value > 0) {
        args.limit = value;
      }
    } else {
      args.query.push(arg);
    }
  });
  args.query = args.query.join(' ').trim();
  return args;
}

async function search(queryText, filters) {
  if (!queryText) {
    console.error('Error: Search query cannot be empty.');
    console.log('Usage: npm run search -- "<query>" [--root=app-docs] [--doc=guides] [--limit=5]');
    return;
  }

  console.log('Initializing embedding pipeline...');
  await initializePipeline();
  console.log('Pipeline initialized.');

  console.log(`Loading vector store from: ${VECTOR_STORE_PATH}`);
  let vectorStore;
  try {
    const fileContent = await fs.readFile(VECTOR_STORE_PATH, 'utf8');
    vectorStore = JSON.parse(fileContent);
  } catch (error) {
    console.error('Error: Could not load vector store. Please run `npm run vectorize` first.');
    return;
  }

  let filteredStore = vectorStore;
  if (filters.root) {
    filteredStore = filteredStore.filter((item) => item.root === filters.root);
    if (filteredStore.length === 0) {
      console.warn(`No entries found for root "${filters.root}".`);
      return;
    }
  }
  if (filters.docType) {
    filteredStore = filteredStore.filter((item) => item.docType === filters.docType);
    if (filteredStore.length === 0) {
      console.warn(`No entries found for doc type "${filters.docType}".`);
      return;
    }
  }

  console.log(`Generating embedding for query: "${queryText}"...`);
  const queryEmbedding = await extractor(queryText, {
    pooling: 'mean',
    normalize: true,
  });
  const queryVector = Array.from(queryEmbedding.data);

  console.log('Performing search...');
  const scored = filteredStore.map((item) => ({
    item,
    score: cosineSimilarity(queryVector, item.vector),
  }));

  scored.sort((a, b) => b.score - a.score);

  const limit = Math.min(filters.limit, scored.length);
  const results = scored.slice(0, limit);

  if (results.length === 0) {
    console.log('No relevant documents found.');
    return;
  }

  console.log(`\n--- Top ${results.length} Search Results for "${queryText}" (limit ${limit}) ---`);
  results.forEach(({ item, score }, index) => {
    const location = item.startLine ? `${item.source}:${item.startLine}-${item.endLine}` : item.source;
    console.log(`\n${index + 1}. [Score: ${score.toFixed(4)}]${item.heading ? ` ${item.heading}` : ''}`);
    console.log(`   Source: ${location}`);
    if (item.root || item.docType) {
      console.log(`   Labels: ${[item.root, item.docType].filter(Boolean).join(' / ')}`);
    }
    if (typeof item.wordCount === 'number') {
      console.log(`   Words: ${item.wordCount}`);
    }
    console.log('   Content:');
    console.log('   ---');
    console.log(`   ${item.text.replace(/\n/g, '\n   ')}`);
    console.log('   ---');
  });

  if (results.length < scored.length) {
    console.log(`\nMore results available (${scored.length - results.length} additional chunks). Re-run with --limit=<n> if needed.`);
  }
}

const args = parseArguments(process.argv.slice(2));
search(args.query, { root: args.root, docType: args.docType, limit: args.limit }).catch((error) => {
  console.error('Search failed:', error);
  process.exitCode = 1;
});
