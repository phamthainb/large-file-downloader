const express = require("express");
const path = require("path");

const app = express();
const PORT = 3300;

const staticFilesPath = path.join(__dirname, "..", "sample");

// Middleware to log static file requests
app.use((req, res, next) => {
  const filePath = path.join(staticFilesPath, req.path);
  console.log(`requested: ${filePath}`);
  next();
});

app.use(express.static(staticFilesPath));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
