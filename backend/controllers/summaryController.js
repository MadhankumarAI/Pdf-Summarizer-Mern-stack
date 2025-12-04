import Summary from '../models/summaryModel.js';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import natural from 'natural';
import FormData from 'form-data';
import { fileURLToPath } from 'url';
import pdf from 'pdf-parse';
import { pipeline } from '@xenova/transformers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const upload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ filePath: req.file.path });
};

const extractKeywords = (text) => {
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase());
    
    // Simple keyword extraction (nouns)
    const nounInflector = new natural.NounInflector();
    const keywords = tokens.filter(token => {
        return natural.stopwords.indexOf(token) === -1 && nounInflector.singularize(token);
    });

    return [...new Set(keywords)];
}

const summarizeText = async (text, model) => {
  console.log(`Summarizing with real model: ${model}...`);

  if (model === 'GPT-4o-mini') {
    // API Stub for GPT-4o-mini
    const summary = "This is a placeholder summary from the GPT-4o-mini model stub. In a real implementation, this would be a call to the OpenAI API.";
    const keywords = extractKeywords(summary);
    return { summary, keywords };
  }
  
  // Map model names to the ones from transformers.js
  const modelMap = {
    'BART-large-cnn': 'Xenova/bart-large-cnn',
    'T5-base': 'Xenova/t5-base',
  };
  const modelName = modelMap[model] || modelMap['BART-large-cnn'];

  const summarizer = await pipeline('summarization', modelName);
  const output = await summarizer(text, {
    max_length: 300,
    min_length: 100,
    no_repeat_ngram_size: 3,
    early_stopping: true,
  });

  const summary = output[0].summary_text;
  const keywords = extractKeywords(summary);
  
  return { summary, keywords };
};

export const summarize = async (req, res) => {
  const { filePath, model } = req.body;

  if (!filePath || !model) {
    return res.status(400).json({ message: 'Missing filePath or model' });
  }

  try {
    const pdfPath = path.resolve(filePath);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    const pdfBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(pdfBuffer);
    const textContent = data.text;

    const { summary, keywords } = await summarizeText(textContent, model);

    // Send to Python microservice for highlighting
    const formData = new FormData();
    formData.append('pdf', fs.createReadStream(pdfPath));
    keywords.forEach(keyword => {
        formData.append('keywords', keyword);
    });

    const highlightResponse = await axios.post(process.env.PYTHON_MICROSERVICE_URL + '/highlight', formData, {
        headers: {
            ...formData.getHeaders(),
        },
        responseType: 'arraybuffer'
    });

    const newSummary = new Summary({
      filename: path.basename(pdfPath),
      summary,
      keywords,
    });
    const savedSummary = await newSummary.save();

    const summaryString = JSON.stringify(savedSummary);
    res.setHeader('X-Summary', Buffer.from(summaryString).toString('base64'));
    res.setHeader('Content-Disposition', `attachment; filename=highlighted_${path.basename(pdfPath)}`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(highlightResponse.data);

  } catch (error) {
    console.error('Error during summarization:', error);
    res.status(500).json({ message: 'Error during summarization' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const summaries = await Summary.find().sort({ createdAt: -1 }).limit(limit);
    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
};