const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;


app.use(express.static("public"));
app.use(express.json());


const upload = multer({ dest: "public/uploads/" });
const FILES_JSON = path.join(__dirname, "files.json");


if (!fs.existsSync(FILES_JSON)) {
  fs.writeFileSync(FILES_JSON, JSON.stringify([]));
}


app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("index"));


app.post("/upload", upload.single("file"), (req, res) => {
  const { category } = req.body;
  const file = {
    name: req.file.originalname,
    size: (req.file.size / 1024).toFixed(2), // KB
    category,
    path: `/uploads/${req.file.filename}`,
  };
  const files = JSON.parse(fs.readFileSync(FILES_JSON));
  files.push(file);
  fs.writeFileSync(FILES_JSON, JSON.stringify(files));
  res.json({ success: true });
});


app.get("/files", (req, res) => {
  const files = JSON.parse(fs.readFileSync(FILES_JSON));
  const { category } = req.query;
  if (category) {
    return res.json(files.filter((file) => file.category === category));
  }
  res.json(files);
});


app.delete("/files/:filename", (req, res) => {
  const filename = req.params.filename;
  let files = JSON.parse(fs.readFileSync(FILES_JSON));
  const file = files.find((f) => f.name === filename);

  if (file) {
    fs.unlinkSync(path.join(__dirname, "public", file.path));
    files = files.filter((f) => f.name !== filename);
    fs.writeFileSync(FILES_JSON, JSON.stringify(files));
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "File not found" });
  }
});


app.listen(PORT, () => console.log(`App running at http://localhost:${PORT}`));
