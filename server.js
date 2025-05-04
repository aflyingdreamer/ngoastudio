const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 