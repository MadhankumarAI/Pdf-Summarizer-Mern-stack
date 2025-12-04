import express from 'express';
import { upload, summarize, getHistory } from '../controllers/summaryController.js';
import multerUpload from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', multerUpload.single('pdf'), upload);
router.post('/summarize', summarize);
router.get('/history', getHistory);

export default router;
