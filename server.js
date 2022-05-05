const express = require('express');
const res = require('express/lib/response');
const getNotes = require('./utils/notes');
const PORT = process.env.PORT || 3001;

const app = express();

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


app.get("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  console.log(noteId);
  const notes = getNotes();
  console.log(notes);

  const note = readNoteById(noteId, notes);
  console.log(note);
  if (note) {
    res.json(note);
  } else {
    res.sendStatus(404);
  }
});


// bonus: delete requested note by id
// app.delete('api/notes/:id');

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
})