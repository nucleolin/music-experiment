// server.js - Node.js Express backend for Music Perception Experiment

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (music files)
app.use('/music', express.static(path.join(__dirname, 'public/music')));

// Create results directory if it doesn't exist
const resultsDir = path.join(__dirname, 'experiment-results');
fs.mkdir(resultsDir, { recursive: true }).catch(console.error);

// Routes

// Get available music files
app.get('/api/music-files', async (req, res) => {
  try {
    const musicDir = path.join(__dirname, 'public/music');
    const genres = ['classical', 'math_rock', 'pop_dance', 'jazz', 'scandipop_tropical'];
    const musicFiles = [];
    
    for (const genre of genres) {
      const genreDir = path.join(musicDir, genre);
      try {
        const files = await fs.readdir(genreDir);
        const wavFiles = files.filter(file => file.endsWith('.wav'));
        
        wavFiles.forEach((file, index) => {
          musicFiles.push({
            file: `/music/${genre}/${file}`,
            genre: genre,
            index: musicFiles.length
          });
        });
      } catch (err) {
        console.warn(`Directory ${genre} not found`);
      }
    }
    
    res.json({ success: true, musicFiles });
  } catch (error) {
    console.error('Error reading music files:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit experiment results
app.post('/api/submit-results', async (req, res) => {
  try {
    const results = req.body;
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `experiment_${results.participantId}_${timestamp}.json`;
    const filepath = path.join(resultsDir, filename);
    
    // Save to file
    await fs.writeFile(filepath, JSON.stringify(results, null, 2));
    
    // Log summary
    console.log(`Experiment completed - Participant: ${results.participantId}`);
    console.log(`Duration: ${results.experimentSummary.totalExperimentDurationMin} minutes`);
    console.log(`Total plays: ${results.experimentSummary.playStatistics.totalPlays}`);
    
    res.json({ 
      success: true, 
      message: 'Results saved successfully',
      filename: filename 
    });
  } catch (error) {
    console.error('Error saving results:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all experiment results (for admin/analysis)
app.get('/api/results', async (req, res) => {
  try {
    const files = await fs.readdir(resultsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const results = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(resultsDir, file), 'utf-8');
        return {
          filename: file,
          data: JSON.parse(content)
        };
      })
    );
    
    res.json({ success: true, results });
  } catch (error) {
    console.error('Error reading results:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a specific result file
app.get('/api/results/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(resultsDir, filename);
    const content = await fs.readFile(filepath, 'utf-8');
    
    res.json({ success: true, data: JSON.parse(content) });
  } catch (error) {
    console.error('Error reading result file:', error);
    res.status(404).json({ success: false, error: 'File not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Music experiment server running on port ${PORT}`);
  console.log(`Results will be saved to: ${resultsDir}`);
});

// Export for testing
module.exports = app;