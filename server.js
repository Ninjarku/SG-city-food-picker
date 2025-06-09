import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataPath = path.join(__dirname, 'locations.json');

// Load data on server start
let locations = [];
try {
  locations = JSON.parse(readFileSync(dataPath));
} catch {
  locations = [];
}

// API: List of places
app.get('/api/places', (req, res) => {
  const uniquePlaces = [...new Set(locations.map(loc => loc.location))];
  res.json(uniquePlaces);
});

// API: Get filtered entries by place
app.get('/api/locations/:place', (req, res) => {
  const place = req.params.place;
  const filtered = locations.filter(loc => loc.location === place);
  res.json(filtered);
});

// API: Add a new entry
app.post('/api/add', (req, res) => {
  const entry = req.body;
  locations.push(entry);
  writeFileSync(dataPath, JSON.stringify(locations, null, 2));
  res.json({ success: true });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
