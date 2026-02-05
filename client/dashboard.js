const API = "https://notes-website-boyg.onrender.com";

if (!localStorage.getItem("token")) {
  window.location.href = "index.html";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

async function loadNotes() {
  const res = await fetch(API + "/notes", {
    headers: { authorization: localStorage.getItem("token") }
  });

  const data = await res.json();
  notes.innerHTML = "";

  data.forEach(n => {
    notes.innerHTML += `
      <div class="note-card">
        <p>${n.text}</p>
        <span class="delete" onclick="deleteNote('${n._id}')">Delete</span>
      </div>
    `;
  });
}

async function saveNote() {
  await fetch(API + "/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({ text: note.value })
  });

  note.value = "";
  loadNotes();
}

async function deleteNote(id) {
  await fetch(API + "/notes/" + id, {
    method: "DELETE",
    headers: { authorization: localStorage.getItem("token") }
  });

  loadNotes();
}

loadNotes();
