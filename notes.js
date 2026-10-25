window.onload = function() { renderNotes(); }

function saveNote() {
    const title = document.getElementById('note-title').value;
    const text = document.getElementById('note-text').value;
    if (!title || !text) return;

    let notes = JSON.parse(localStorage.getItem('architect_notes') || "[]");
    notes.push({ id: Date.now(), title: title, text: text });
    localStorage.setItem('architect_notes', JSON.stringify(notes));
    document.getElementById('note-title').value = '';
    document.getElementById('note-text').value = '';
    renderNotes();
}

function deleteNote(id) {
    let notes = JSON.parse(localStorage.getItem('architect_notes') || "[]");
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem('architect_notes', JSON.stringify(notes));
    renderNotes();
}

function renderNotes() {
    const container = document.getElementById('notes-list');
    container.innerHTML = '';
    let notes = JSON.parse(localStorage.getItem('architect_notes') || "[]");

    if (notes.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Заметок нет.</p>';
        return;
    }

    notes.reverse().forEach(note => {
        container.innerHTML += `
            <div class="note-card">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <h3 style="color: #fff;">${note.title}</h3>
                    <button onclick="deleteNote(${note.id})" style="background:none; border:none; color:#ff0055; cursor:pointer;">✕</button>
                </div>
                <p style="color: var(--text-muted); font-size: 14px; line-height: 1.5;">${note.text}</p>
            </div>
        `;
    });
}
