window.onload = function() { renderWishes(); }

function addWish() {
    const title = document.getElementById('wish-title').value;
    const stepsText = document.getElementById('wish-steps').value;
    if (!title) return;
    let steps = stepsText.split('\n').filter(s => s.trim() !== '').map(s => ({ text: s.trim(), done: false }));
    let wishes = JSON.parse(localStorage.getItem('architect_wishes') || "[]");
    wishes.push({ id: Date.now(), title: title, steps: steps, completed: false });
    localStorage.setItem('architect_wishes', JSON.stringify(wishes));
    document.getElementById('wish-title').value = '';
    document.getElementById('wish-steps').value = '';
    renderWishes();
}

function toggleStep(wishId, stepIndex) {
    let wishes = JSON.parse(localStorage.getItem('architect_wishes') || "[]");
    const idx = wishes.findIndex(w => w.id === wishId);
    if (idx !== -1) {
        wishes[idx].steps[stepIndex].done = !wishes[idx].steps[stepIndex].done;
        wishes[idx].completed = wishes[idx].steps.every(s => s.done);
        localStorage.setItem('architect_wishes', JSON.stringify(wishes));
        renderWishes();
    }
}

function deleteWish(id) {
    if (confirm("Удалить?")) {
        let wishes = JSON.parse(localStorage.getItem('architect_wishes') || "[]");
        wishes = wishes.filter(w => w.id !== id);
        localStorage.setItem('architect_wishes', JSON.stringify(wishes));
        renderWishes();
    }
}

function renderWishes() {
    const container = document.getElementById('wishes-list');
    container.innerHTML = '';
    let wishes = JSON.parse(localStorage.getItem('architect_wishes') || "[]");

    if (wishes.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Желаний нет.</p>';
        return;
    }

    wishes.forEach(wish => {
        let stepsHTML = wish.steps.map((s, i) => `
            <div onclick="toggleStep(${wish.id}, ${i})" style="cursor:pointer; display:flex; gap:10px; margin-top:5px; color:${s.done ? 'var(--text-muted)' : '#fff'}; text-decoration:${s.done ? 'line-through' : 'none'};">
                <span>${s.done ? '☑' : '☐'}</span> <span>${s.text}</span>
            </div>
        `).join('');

        container.innerHTML += `
            <div class="card wish-card">
                <div style="display:flex; justify-content:space-between;">
                    <h3 style="color: #ff00a0;">${wish.title}</h3>
                    <button onclick="deleteWish(${wish.id})" style="background:none; border:none; color:#ff0055; cursor:pointer;">✕</button>
                </div>
                <div style="margin-top: 15px;">${stepsHTML}</div>
            </div>
        `;
    });
}
