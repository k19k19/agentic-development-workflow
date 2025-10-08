const { pipeline } = require('@xenova/transformers');
const fs = require('fs').promises;
const path = require('path');

// --- Configuration ---
const DOCS_DIRECTORIES = ['app-docs', 'ai-docs'];
const EXCLUDED_FILES = ['feature-to-source.md'];
const VECTOR_STORE_PATH = path.join(__dirname, '..', 'vector-store.json');
const BATCH_SIZE = 10;

// --- Initialize Transformer Pipeline ---
let extractor;

async function initializePipeline() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
}

/**
 * Recursively finds all files in a directory, respecting exclusions.
 */
async function getFiles(dir) {
  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        return getFiles(res);
      }
      if (EXCLUDED_FILES.includes(dirent.name)) {
        return null;
      }
      return res;
    }));
    return Array.prototype.concat(...files).filter(Boolean);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`Warning: Directory ${dir} not found. Skipping.`);
      return [];
    }
    throw error;
  }
}

/**
 * Chunks text into smaller, manageable pieces.
 */
function chunkText(text, filePath) {
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs
    .map((p) => p.trim())
    .filter((p) => p.length > 20); // Only index meaningful paragraphs
}

/**
 * Main function to vectorize the documentation.
 */
async function vectorize() {
  console.log('Initializing feature extraction pipeline...');
  await initializePipeline();
  console.log('Pipeline initialized.');

  let allFiles = [];
  for (const dir of DOCS_DIRECTORIES) {
    const fullPath = path.join(__dirname, '..', dir);
    const files = await getFiles(fullPath);
    allFiles = allFiles.concat(files);
  }

  if (allFiles.length === 0) {
    console.log('No documents found to vectorize. Exiting.');
    return;
  }

  console.log(`Found ${allFiles.length} files to process.`);
  const vectorStore = [];

  for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
    const batchFiles = allFiles.slice(i, i + BATCH_SIZE);
    console.log(`Processing file batch ${Math.floor(i / BATCH_SIZE) + 1}...`);

    for (const file of batchFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const chunks = chunkText(content, file);

        if (chunks.length > 0) {
            console.log(`  - Generating ${chunks.length} embeddings for ${path.basename(file)}...`);
            const embeddings = await extractor(chunks, {
                pooling: 'mean',
                normalize: true,
            });

            for (let j = 0; j < chunks.length; j++) {
                vectorStore.push({
                    text: chunks[j],
                    source: file,
                    vector: Array.from(embeddings.data.slice(j * 384, (j + 1) * 384)),
                });
            }
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  }

  console.log(`\nVectorization complete! Writing ${vectorStore.length} vectors to ${VECTOR_STORE_PATH}...`);
  await fs.writeFile(VECTOR_STORE_PATH, JSON.stringify(vectorStore, null, 2));
  console.log('Vector store saved successfully.');
}

vectorize().catch(console.error);