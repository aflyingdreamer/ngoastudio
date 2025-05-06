const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const host = '0.0.0.0';

// Middleware
app.use(compression());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    console.log('Attempting to serve:', indexPath);
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error serving index.html:', err);
            res.status(500).send('Error loading index.html: ' + err.message);
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
    console.log('Current directory:', __dirname);
}); 