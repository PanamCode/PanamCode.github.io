window.onload = function() { renderHabits(); }

function addHabit() {
    const name = document.getElementById('habit-name').value;
    if (!name) return;
    let habits = JSON.parse(localStorage.getItem('architect_habits') || "[]");
    habits.push({ id: Date.now(), name: name, history: {} });
    localStorage.setItem('architect_habits', JSON.stringify(habits));
    document.getElementById('habit-name').value = '';
    renderHabits();
}

function deleteHabit(id) {
    let habits = JSON.parse(localStorage.getItem('architect_habits') || "[]");
    habits = habits.filter(h => h.id !== id);
    localStorage.setItem('architect_habits', JSON.stringify(habits));
    renderHabits();
}

function toggleHabitDay(id, dateStr) {
    let habits = JSON.parse(localStorage.getItem('architect_habits') || "[]");
    const idx = habits.findIndex(h => h.id === id);
    if (idx !== -1) {
        if (habits[idx].history[dateStr]) delete habits[idx].history[dateStr];
        else habits[idx].history[dateStr] = true;
        localStorage.setItem('architect_habits', JSON.stringify(habits));
        renderHabits();
    }
}

function renderHabits() {
    const container = document.getElementById('habits-list');
    container.innerHTML = '';
    let habits = JSON.parse(localStorage.getItem('architect_habits') || "[]");

    if (habits.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Привычек нет.</p>';
        return;
    }

    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push({
            str: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
            name: d.toLocaleDateString('ru-RU', { weekday: 'short' })
        });
    }

    habits.forEach(habit => {
        let boxes = dates.map(date => {
            const active = habit.history[date.str] ? 'active' : '';
            return `<div class="habit-box ${active}" onclick="toggleHabitDay(${habit.id}, '${date.str}')" title="${date.name}"></div>`;
        }).join('');

        container.innerHTML += `
            <div class="card" style="padding: 20px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="color: #fff;">${habit.name}</h3>
                <div class="habit-days">${boxes}</div>
                <button onclick="deleteHabit(${habit.id})" style="background:none; border:none; color:#ff0055; cursor:pointer; font-size: 20px;">✕</button>
            </div>
        `;
    });
}
