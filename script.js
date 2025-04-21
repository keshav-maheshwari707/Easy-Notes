const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");
const searchInput = document.getElementById("search");
const saveToFileBtn = document.getElementById("saveToFile");
const saveToPDFBtn = document.getElementById("saveToPDF");
const toggleDarkModeBtn = document.getElementById("toggleDarkMode");
const deleteAllBtn = document.getElementById("deleteAll");

function saveAllNotes() {
    const notes = Array.from(document.querySelectorAll(".input-box"));
    const data = notes.map(note => ({
        content: note.querySelector(".note-content").innerHTML,
        date: note.querySelector(".note-date").textContent,
        pinned: note.classList.contains("pinned")
    }));
    localStorage.setItem("notes", JSON.stringify(data));
}

function showNotes() {
    notesContainer.innerHTML = "";
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

    // Pinned notes first
    savedNotes.sort((a, b) => b.pinned - a.pinned);

    savedNotes.forEach(noteData => {
        const inputBox = document.createElement("div");
        inputBox.className = "input-box";
        if (noteData.pinned) inputBox.classList.add("pinned");

        // Pin icon
        const pinIcon = document.createElement("img");
        pinIcon.src = "assets/pin.png";
        pinIcon.className = "pin-icon";
        pinIcon.addEventListener("click", () => {
            inputBox.classList.toggle("pinned");
            saveAllNotes();
            showNotes(); // Reorder after pin change
        });

        // Editable area
        const editableDiv = document.createElement("div");
        editableDiv.className = "note-content";
        editableDiv.setAttribute("contenteditable", "true");
        editableDiv.innerHTML = noteData.content;
        editableDiv.addEventListener("input", saveAllNotes);

        // Date
        const dateSpan = document.createElement("span");
        dateSpan.className = "note-date";
        dateSpan.textContent = noteData.date;

        // Delete icon
        const deleteIcon = document.createElement("img");
        deleteIcon.src = "assets/delete.png";
        deleteIcon.addEventListener("click", () => {
            inputBox.remove();
            saveAllNotes();
        });

        inputBox.appendChild(pinIcon);
        inputBox.appendChild(editableDiv);
        inputBox.appendChild(dateSpan);
        inputBox.appendChild(deleteIcon);

        notesContainer.appendChild(inputBox);
    });
}

// Create new note
createBtn.addEventListener("click", () => {
    const inputBox = document.createElement("div");
    inputBox.className = "input-box";

    // Pin icon
    const pinIcon = document.createElement("img");
    pinIcon.src = "assets/pin.png";
    pinIcon.className = "pin-icon";
    pinIcon.addEventListener("click", () => {
        inputBox.classList.toggle("pinned");
        saveAllNotes();
        showNotes();
    });

    // Editable area
    const editableDiv = document.createElement("div");
    editableDiv.className = "note-content";
    editableDiv.setAttribute("contenteditable", "true");
    editableDiv.addEventListener("input", saveAllNotes);

    // Date
    const date = new Date();
    const dateSpan = document.createElement("span");
    dateSpan.className = "note-date";
    dateSpan.textContent = "Created on: " + date.toLocaleDateString();

    // Delete icon
    const img = document.createElement("img");
    img.src = "assets/delete.png";
    img.addEventListener("click", () => {
        inputBox.remove();
        saveAllNotes();
    });

    inputBox.appendChild(pinIcon);
    inputBox.appendChild(editableDiv);
    inputBox.appendChild(dateSpan);
    inputBox.appendChild(img);

    notesContainer.prepend(inputBox); // Add to top by default
    saveAllNotes();
});

// Search notes
searchInput.addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const notes = document.querySelectorAll(".input-box");
    notes.forEach(note => {
        const noteText = note.textContent.toLowerCase();
        note.style.display = noteText.includes(searchValue) ? "block" : "none";
    });
});

// Save to .txt
saveToFileBtn.addEventListener("click", () => {
    const notes = Array.from(document.querySelectorAll('.input-box'))
        .map(note => note.textContent.trim());
    const blob = new Blob([notes.join('\n\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'notes.txt';
    link.click();
});

// Save to PDF
saveToPDFBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const notes = Array.from(document.querySelectorAll('.input-box'))
        .map(note => note.textContent.trim());
    doc.text(notes.join('\n\n'), 10, 10);
    doc.save("notes.pdf");
});

// Dark mode toggle
toggleDarkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Delete all notes
deleteAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all notes?")) {
        localStorage.removeItem("notes");
        notesContainer.innerHTML = "";
    }
});

// Prevent Enter from submitting
document.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        document.execCommand("insertLineBreak");
        event.preventDefault();
    }
});

// Show on load
showNotes();
