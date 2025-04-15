import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Set up multer for file upload (saved in 'uploads' directory)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Route to handle Excel upload and trigger Python script
router.post('/', upload.single('file'), (req, res) => {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const pythonProcess = spawn('python', ['App.py', uploadedFile.path]);

  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
  });

  pythonProcess.on('close', (code) => {
    // Clean up uploaded file
    fs.unlinkSync(uploadedFile.path);

    if (code === 0) {
      return res.status(200).json({ message: 'Availability updated', result: JSON.parse(result) });
    } else {
      return res.status(500).json({ error: 'Failed to update availability', details: error });
    }
  });
});

export default router;
