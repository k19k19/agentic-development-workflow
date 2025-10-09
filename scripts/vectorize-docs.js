const { pipeline } = require('@xenova/transformers');
const fs = require('fs').promises;
const path = require('path');

// --- Configuration ---
// Limit vectorization to current, reusable knowledge instead of every doc artifact.
const DOCS_DIRECTORIES = [
  'app-docs/specs/active',
  'app-docs/specs/reference',
  'app-docs/guides',
  'app-docs/architecture',
  'app-docs/mappings',
  'app-docs/operations',
];
const EXCLUDED_FILES = new Set(['feature-to-source.md']);
const ALLOWED_EXTENSIONS = new Set(['.md', '.mdx', '.markdown', '.txt', '.yaml', '.yml', '.json', '.sql']);
const MAX_FILE_BYTES = 3 * 1024 * 1024; // Skip files larger than 3 MB
const VECTOR_STORE_PATH = path.join(__dirname, '..', 'vector-store.json');
const BATCH_SIZE = 8;
const CHUNK_SIZE_WORDS = 400;
const CHUNK_OVERLAP_WORDS = 60;
const MIN_CHUNK_WORDS = 40;
const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';

// --- Embedding Pipeline ---
let extractor;

async function initializePipeline() {
  if (!extractor) {
    extractor = await pipeline('feature-extraction', EMBEDDING_MODEL);
  }
  return extractor;
}

async function getFiles(dir) {
  try {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map(async (dirent) => {
        const fullPath = path.join(dir, dirent.name);
        if (dirent.isDirectory()) {
          return getFiles(fullPath);
        }
        return shouldIndexFile(fullPath) ? [fullPath] : [];
      }),
    );
    return files.flat();
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`Warning: Directory ${dir} not found. Skipping.`);
      return [];
    }
    throw error;
  }
}

function shouldIndexFile(filePath) {
  const base = path.basename(filePath);
  if (EXCLUDED_FILES.has(base)) {
    return false;
  }
  const ext = path.extname(base).toLowerCase();
  if (ALLOWED_EXTENSIONS.size > 0 && !ALLOWED_EXTENSIONS.has(ext)) {
    return false;
  }
  return true;
}

function countWords(lines) {
  return lines.reduce((total, line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return total;
    }
    return total + trimmed.split(/\s+/).length;
  }, 0);
}

function extractHeading(lines, fallbackHeading) {
  for (const line of lines) {
    const match = line.trim().match(/^#{1,6}\s+(.*)$/);
    if (match) {
      return match[1].trim();
    }
  }
  return fallbackHeading || null;
}

function buildOverlap(lines, startLine) {
  if (!CHUNK_OVERLAP_WORDS || lines.length === 0) {
    return { lines: [], words: 0, startLine: 0 };
  }
  let words = 0;
  let index = lines.length;
  while (index > 0 && words < CHUNK_OVERLAP_WORDS) {
    index -= 1;
    const trimmed = lines[index].trim();
    if (!trimmed) {
      continue;
    }
    words += trimmed.split(/\s+/).length;
  }
  const overlapLines = lines.slice(index);
  return {
    lines: overlapLines,
    words: countWords(overlapLines),
    startLine: startLine + index,
  };
}

function createChunk(lines, startLine, fallbackHeading, allowShort = false) {
  const text = lines.join('\n').trim();
  if (!text) {
    return null;
  }
  const wordCount = countWords(lines);
  if (!allowShort && wordCount < MIN_CHUNK_WORDS) {
    return null;
  }
  return {
    text,
    startLine,
    endLine: startLine + lines.length - 1,
    heading: extractHeading(lines, fallbackHeading),
    wordCount,
  };
}

function chunkDocument(text) {
  const lines = text.split('\n');
  const chunks = [];
  let buffer = [];
  let wordCount = 0;
  let startLine = 1;
  let latestHeading = null;

  const pushChunk = (allowShort = false) => {
    const chunkLines = buffer.slice();
    const chunk = createChunk(chunkLines, startLine, latestHeading, allowShort);
    if (chunk) {
      chunks.push(chunk);
    }
    return chunkLines;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    const headingMatch = trimmed.match(/^#{1,6}\s+(.*)$/);
    if (headingMatch) {
      latestHeading = headingMatch[1].trim();
    }

    const lineWords = trimmed ? trimmed.split(/\s+/).length : 0;
    const exceedsChunk = buffer.length > 0 && wordCount + lineWords > CHUNK_SIZE_WORDS && wordCount >= MIN_CHUNK_WORDS;

    if (exceedsChunk) {
      const chunkLines = pushChunk();
      const { lines: overlapLines, words, startLine: overlapStart } = buildOverlap(chunkLines, startLine);
      buffer = overlapLines.slice();
      wordCount = words;
      startLine = overlapLines.length > 0 ? overlapStart : i + 1;
    }

    if (!buffer.length && trimmed.length === 0) {
      continue;
    }

    if (!buffer.length) {
      startLine = i + 1;
    }

    buffer.push(line);
    wordCount += lineWords;
  }

  if (buffer.length) {
    pushChunk(true);
  }

  return chunks;
}

async function vectorize() {
  console.log('Initializing embedding pipeline...');
  await initializePipeline();
  console.log('Pipeline initialized.');

  const rootDir = path.join(__dirname, '..');
  let allFiles = [];
  for (const dir of DOCS_DIRECTORIES) {
    const absoluteDir = path.join(rootDir, dir);
    const files = await getFiles(absoluteDir);
    allFiles = allFiles.concat(files);
  }

  if (allFiles.length === 0) {
    console.log('No documents found to vectorize. Exiting.');
    return;
  }

  console.log(`Found ${allFiles.length} files to process.`);
  const vectorStore = [];
  const createdAt = new Date().toISOString();

  for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
    const batchFiles = allFiles.slice(i, i + BATCH_SIZE);
    console.log(`Processing file batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(allFiles.length / BATCH_SIZE)}...`);

    for (const file of batchFiles) {
      try {
        const stats = await fs.stat(file);
        if (stats.size > MAX_FILE_BYTES) {
          console.warn(`  - Skipping ${path.basename(file)} (size ${stats.size} exceeds limit).`);
          continue;
        }

        const content = await fs.readFile(file, 'utf8');
        const chunks = chunkDocument(content);
        if (chunks.length === 0) {
          console.warn(`  - Skipping ${path.basename(file)} (no meaningful chunks).`);
          continue;
        }

        console.log(`  - Generating ${chunks.length} embeddings for ${path.basename(file)}...`);
        const embeddings = await extractor(
          chunks.map((chunk) => chunk.text),
          {
            pooling: 'mean',
            normalize: true,
          },
        );

        const vectorLength = embeddings.data.length / chunks.length;
        const relativePath = path.relative(rootDir, file);
        const segments = relativePath.split(path.sep);
        const root = segments[0] || '';
        const docType = segments.length > 1 ? segments[1] : '';

        chunks.forEach((chunk, index) => {
          const vectorStart = index * vectorLength;
          const vectorEnd = vectorStart + vectorLength;
          const vector = Array.from(embeddings.data.slice(vectorStart, vectorEnd));
          vectorStore.push({
            id: `${relativePath}::${index.toString().padStart(4, '0')}`,
            source: relativePath,
            root,
            docType,
            chunkIndex: index,
            startLine: chunk.startLine,
            endLine: chunk.endLine,
            heading: chunk.heading,
            wordCount: chunk.wordCount,
            text: chunk.text,
            vector,
            embeddingModel: EMBEDDING_MODEL,
            createdAt,
            fileSizeBytes: stats.size,
          });
        });
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  }

  console.log(`\nVectorization complete. Writing ${vectorStore.length} vectors to ${VECTOR_STORE_PATH}...`);
  await fs.writeFile(VECTOR_STORE_PATH, JSON.stringify(vectorStore, null, 2));
  console.log('Vector store saved successfully.');
}

vectorize().catch((error) => {
  console.error('Vectorization failed:', error);
  process.exitCode = 1;
});
