const { pipeline } = require('@xenova/transformers');
const fs = require('fs').promises;
const path = require('path');

// --- Configuration ---
const VECTOR_STORE_PATH = path.join(__dirname, '..', 'vector-store.json');
const TOP_N_RESULTS = 5; // Return the top 5 most relevant document chunks

// --- Initialize Transformer Pipeline ---
let extractor;

async function initializePipeline() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
}

// --- Cosine Similarity Calculation ---
function dotProduct(vecA, vecB) {
    let product = 0;
    for (let i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
    }
    return product;
}

function magnitude(vec) {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}

function cosineSimilarity(vecA, vecB) {
    const dot = dotProduct(vecA, vecB);
    const magA = magnitude(vecA);
    const magB = magnitude(vecB);
    if (magA === 0 || magB === 0) return 0;
    return dot / (magA * magB);
}


/**
 * Main function to search the documentation.
 * @param {string} queryText - The search query.
 */
async function search(queryText) {
  if (!queryText) {
    console.error('Error: Search query cannot be empty.');
    console.log('Usage: npm run search -- "<your search query>"');
    return;
  }

  console.log('Initializing feature extraction pipeline...');
  await initializePipeline();
  console.log('Pipeline initialized.');

  console.log(`Loading vector store from: ${VECTOR_STORE_PATH}`);
  let vectorStore;
  try {
      const fileContent = await fs.readFile(VECTOR_STORE_PATH, 'utf-8');
      vectorStore = JSON.parse(fileContent);
  } catch (error) {
      console.error('Error: Could not load vector store. Please run the vectorize script first.');
      console.log('Usage: npm run vectorize');
      return;
  }

  console.log(`Generating embedding for query: "${queryText}"...`);
  const queryEmbedding = await extractor(queryText, {
    pooling: 'mean',
    normalize: true,
  });
  const queryVector = Array.from(queryEmbedding.data);

  console.log('Performing search...');
  const results = vectorStore.map(item => ({
      score: cosineSimilarity(queryVector, item.vector),
      text: item.text,
      source: item.source,
  }));

  results.sort((a, b) => b.score - a.score);

  const topResults = results.slice(0, TOP_N_RESULTS);

  console.log(`\n--- Top ${topResults.length} Search Results for "${queryText}" ---`);

  if (topResults.length === 0) {
    console.log('No relevant documents found.');
    return;
  }

  for (const result of topResults) {
    console.log(`\n[Score: ${result.score.toFixed(4)}]`);
    console.log(`  Source: ${result.source}`);
    console.log('  Content:');
    console.log('  ---');
    console.log(`  ${result.text.replace(/\n/g, '\n  ')}`);
    console.log('  ---');
  }
}

// Get the query from command-line arguments
const query = process.argv.slice(2).join(' ');
search(query).catch(console.error);