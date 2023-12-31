import express from 'express';
import multer from 'multer';
import { StoreImageFiles } from './index.js'; // Make sure to add .js extension
import { QueryImage } from './index.js'; // Make sure to add .js extension
import cors from 'cors';
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';

import { fileTypeFromBuffer } from 'file-type';



const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.array('images', 25), async (req, res) => {
    try {
      await StoreImageFiles(req.files);
      res.status(200).send('Images uploaded successfully');
    } catch (error) {
        console.log(error);
      res.status(500).send('Error uploading images');
    }
});

const search = multer({ dest: 'search/' });
app.post('/search-image', upload.single('image'), async (req, res) => {
    try {
        const imagePath = await QueryImage(req.file);
        const fullImagePath = path.join(__dirname, imagePath); // Construct full path
        res.sendFile(fullImagePath); // Send the image file itself
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/images', async (req, res) => {
    const uploadsDir = path.join(__dirname, 'uploads');

    fs.readdir(uploadsDir, async (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Error fetching images');
        }

        const imagesPromises = files.map(async file => {
            const filePath = path.join(uploadsDir, file);
            const fileData = fs.readFileSync(filePath);
            const type = await fileTypeFromBuffer(fileData);

            if (type && type.mime.startsWith('image/')) {
                return `data:${type.mime};base64,${fileData.toString('base64')}`;
            }

            return null;
        });

        const images = (await Promise.all(imagesPromises)).filter(Boolean);

        res.json(images); // Sends array of base64-encoded images
    });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
