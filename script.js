let currentAmount = 0;
const goalAmount = 8500000;

window.onload = function() {
    const savedAmount = localStorage.getItem('panameraAmount');
    if (savedAmount) {
        currentAmount = parseInt(savedAmount);
        updateProgress();
    }
    loadNotes();
}

function updateProgress() {
    const percent = (currentAmount / goalAmount) * 100;
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('progress-text').innerText = `Накоплено: ${currentAmount.toLocaleString()} ₽ (${percent.toFixed(2)}%)`;
}

function addMoney() {
    const amount = prompt("Сколько денег добавить в копилку? (в рублях)");
    if (amount && !isNaN(amount)) {
        currentAmount += parseInt(amount);
        localStorage.setItem('panameraAmount', currentAmount);
        updateProgress();
    }
}

function saveNote() {
    const input = document.getElementById('note-input');
    const noteText = input.value.trim();
    if (noteText) {
        let notes = JSON.parse(localStorage.getItem('myNotes') || "[]");
        notes.push(noteText);
        localStorage.setItem('myNotes', JSON.stringify(notes));
        input.value = '';
        loadNotes();
    }
}

function loadNotes() {
    const list = document.getElementById('notes-list');
    list.innerHTML = '';
    let notes = JSON.parse(localStorage.getItem('myNotes') || "[]");
    notes.forEach(note => {
        const li = document.createElement('li');
        li.innerText = note;
        list.appendChild(li);
    });
}
