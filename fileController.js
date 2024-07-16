const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs")
let enteredNumbers = new Set();
let store = {
    A: new Set(),
    B: new Set(),
    C: new Set(),
    D: new Set()
  };
  
  let processComplete = false 
const fileCreation =  (filePath,value) =>{

    fs.appendFile(filePath, value + '\n', (err) => {
        if (err) {
          console.error('An error occurred while writing to the file:', err);
        } else {
          console.log(`Number ${value} routeended to ${filePath}`);
        }
      });
}

const  readFile = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data.split('\n').filter(acc => acc.trim() !== ''));
      });
    });
  }
  const fileA = path.join(__dirname,"A.txt")
  const fileB = path.join(__dirname,"B.txt")
  const fileC = path.join(__dirname,"C.txt")
  const fileD = path.join(__dirname,"D.txt")
  

  async function processNumber(number) {
    if (processComplete) {
      return; // If the process is complete, do nothing
    }
  
    const result = number * 7;
  
    // Determine the file based on the result
    if (result > 140) {
      fileCreation(fileA, result);
      store.A.add(result);
    }
    if (result > 100) {
      fileCreation(fileB, result);
      store.B.add(result);
    }
    if (result > 60) {
      fileCreation(fileC, result);
      store.C.add(result);
    }
    if (result <= 60) {
      fileCreation(fileD, result);
      store.D.add(result);
    }
  
   
  
    const files = [fileA, fileB, fileC, fileD];
  try {
    const fileChecks = await Promise.all(files.map(file => readFile(file)));
    if (fileChecks.every(fileLines => fileLines.length === 25)) {
      processComplete = true;
      process.exit();
    }
  } catch (error) {
    console.error('Error checking file completion:', error);
  }
  }
router.post("/data",async (req,res)=>{
    let { num } = req.body
    console.log(typeof (num) )

    if (typeof num !== 'number' || num < 1 || num > 25) {
    return res.status(400).json({ error: 'Please provide a valid number between 1 and 25.' });
  }
 
  if (enteredNumbers.has(num)) {
    return res.status(400).json({ error: 'This number has already been entered.' });
  }

  enteredNumbers.add(num);
  try {
    await processNumber(num);
    res.status(200).json({ message: 'Number processed successfully.' });
  } catch (error) {
    console.error('Error processing number:', error);
    res.status(500).json({ error: 'An error occurred while processing the number.' });
  }
})
async function displayNumbers() {
    const files = [fileA, fileB, fileC, fileD];
    let fileContents =[];
    for (const file of files) {
      try {
        const numbers = await readFile(file);
fileContents.push(numbers)
      } catch (error) {
        console.error(`Error reading ${file}:`, error);
      }
    }
    return fileContents.flatMap(c=>c);
  }

router.get('/', async (req, res) => {
    
  
    try {
      const fileContents = await displayNumbers();
      res.status(200).json(fileContents);
    } catch (error) {
      console.error('Error retrieving file contents:', error);
      res.status(500).json({ error: 'An error occurred while retrieving file contents.' });
    }
  });


module.exports = router;