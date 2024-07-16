const express = require('express');
const cors = require('cors'); // Import cors
const fileData = require('./fileController'); // Ensure the path is correct

const app = express();
app.use(express.json()); 
const port = 3000;

// Use cors middleware properly
app.use(cors()); 

// Use the routes from fileController
app.use('/', fileData);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
