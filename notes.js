window.onload = function() {
    renderNotes();
}

function saveNote() {
    const title = document.getElementById('note-title').value;
    const text = document.getElementById('note-text').value;
    const category = document.getElementById('note-category').value;

    if (!title || !text) {
        alert("Заполните заголовок и текст!");
        return;
    }

    let notes = JSON.parse(localStorage.getItem('architect_notes') || "[]");
    notes.push({
        id: Date.now(),
        title: title,
        text: text,
        category: category,
        date: new Date().toLocaleDateString('ru-RU')
    });

    localStorage.setItem('architect_notes', JSON.stringify(notes));
    
    document.getElementById('note-title').value = '';
    document.getElementById('note-text').value = '';
    renderNotes();
}

function deleteNote(id) {
    deleteTargetId = id; // Сохраняем ID
document.getElementById('delete-modal').style.display = 'flex'; // Показываем окно
        let notes = JSON.parse(localStorage.getItem('architect_notes') || "[]");
        notes = notes.filter(n => n.id !== id);
        localStorage.setItem('architect_notes', JSON.stringify(notes));
        renderNotes();
    }
}

function renderNotes() {
    const container = document.getElementById('notes-list');
    const search = document.getElementById('search-bar').value.toLowerCase();
    container.innerHTML = '';
    
    let notes = JSON.parse(localStorage.getItem('architect_notes') || "[]");

    // Фильтрация по поиску
    if (search) {
        notes = notes.filter(n => n.title.toLowerCase().includes(search) || n.text.toLowerCase().includes(search));
    }

    // Сортировка: новые сверху
    notes.reverse();

    if (notes.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Заметок нет. Самое время записать первую!</p>';
        return;
    }

    notes.forEach(note => {
        // Цвет для категории
        let categoryColor = "var(--text-muted)";
        if (note.category === "Идеи для реализации") categoryColor = "#2ecc71";
        if (note.category === "Мотивация") categoryColor = "#e74c3c";
        if (note.category === "Советы") categoryColor = "#f1c40f";

        let cardHTML = `
            <div class="card" style="text-align: left; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 12px; color: ${categoryColor}; border: 1px solid ${categoryColor}; padding: 2px 8px; border-radius: 10px;">${note.category}</span>
                    <span style="font-size: 12px; color: var(--text-muted);">${note.date}</span>
                </div>
                <h3 style="margin-bottom: 10px; color: #fff;">${note.title}</h3>
                <p style="color: #ccc; font-size: 15px; white-space: pre-wrap;">${note.text}</p>
                <button class="btn-primary" onclick="deleteNote(${note.id})" style="width: auto; padding: 5px 15px; font-size: 12px; position: absolute; top: 15px; right: 15px; background: #e74c3c;">Удалить</button>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}
