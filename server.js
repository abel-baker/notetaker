const express = require('express');
const res = require('express/lib/response');
const { json } = require('express/lib/response');
const getNotes = require('./utils/notes');
const PORT = process.env.PORT || 3001;

const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static('public'));

// parse incoming string/array and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Utils
function readNoteById(noteId, noteArray) {
  console.log(noteId, noteArray);
  const results = noteArray.filter(note => {
    console.log(`comparing ${typeof note.id} with ${typeof noteId}: ${note.id === noteId}`);
    note.id === noteId;
  })
  
  console.log(`in-function ${results[0]}`);
  return results[0];
}
function findById(id, array) {
  const result = array.filter(item => item.id == id)[0];
  return result;
}
function writeNote(body, array) {
  array.push(body);

  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify(array, null, 2)
  );

  return body;
}
function deleteNote(id, array) {
  const filtered = array.filter(item => item.id != id);
  console.log(filtered, id);

  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify(filtered, null, 2)
  );

  return filtered;
}

// Public routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
})

// API routes

app.get("/api/notes", (req, res) => {
  const notes = getNotes();

  if (notes) {
    res.json(notes);
  } else {
    res.sendStatus(404);
  }
});

app.get("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  const note = findById(noteId, getNotes());

  res.json(note);
});

app.post('/api/notes/', (req, res) => {
  const notes = getNotes();
  const note = req.body;
  note.id = notes.length + 1;

  writeNote(note, notes);

  res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  const notes = getNotes();
  const noteId = req.params.id;

  const filtered = deleteNote(noteId, notes);

  res.json(filtered);
});


// bonus: delete requested note by id
// app.delete('api/notes/:id');

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
})