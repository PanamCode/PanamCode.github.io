let currentFilter = 'Все';
let deleteTargetId = null;

window.onload = function() { renderGoals(); }

function toggleForm() {
    const form = document.getElementById('goal-form');
    form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
}

function saveGoal() {
    const name = document.getElementById('goal-name').value;
    const amount = parseInt(document.getElementById('goal-amount').value) || 0;
    const image = document.getElementById('goal-image').value;

    if (!name) return alert("Введите название!");

    let goals = JSON.parse(localStorage.getItem('architect_goals') || "[]");
    goals.push({ id: Date.now(), name: name, targetAmount: amount, currentAmount: 0, image: image || null });
    localStorage.setItem('architect_goals', JSON.stringify(goals));
    
    document.getElementById('goal-name').value = '';
    document.getElementById('goal-amount').value = '';
    document.getElementById('goal-image').value = '';
    toggleForm();
    renderGoals();
}

function deleteGoal(id) { deleteTargetId = id; document.getElementById('delete-modal').style.display = 'flex'; }
function closeModal() { deleteTargetId = null; document.getElementById('delete-modal').style.display = 'none'; }
function confirmDelete() {
    if (deleteTargetId) {
        let goals = JSON.parse(localStorage.getItem('architect_goals') || "[]");
        goals = goals.filter(g => g.id !== deleteTargetId);
        localStorage.setItem('architect_goals', JSON.stringify(goals));
        closeModal(); renderGoals();
    }
}

function addMoney(id) {
    const amount = parseInt(prompt("Сколько добавить?"));
    if (!amount || amount <= 0) return;
    let goals = JSON.parse(localStorage.getItem('architect_goals') || "[]");
    const idx = goals.findIndex(g => g.id === id);
    if (idx !== -1) {
        goals[idx].currentAmount += amount;
        localStorage.setItem('architect_goals', JSON.stringify(goals));
        renderGoals();
    }
}

function renderGoals() {
    const container = document.getElementById('goals-list');
    container.innerHTML = '';
    let goals = JSON.parse(localStorage.getItem('architect_goals') || "[]");

    if (goals.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Целей нет.</p>';
        return;
    }

    goals.forEach(goal => {
        let percent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
        if (percent > 100) percent = 100;
        
        container.innerHTML += `
            <div class="card goal-card">
                ${goal.image ? `<img src="${goal.image}" class="goal-img">` : '<div class="goal-img" style="display:flex;align-items:center;justify-content:center;background:#222;font-size:30px;">🎯</div>'}
                <div class="goal-info">
                    <h3 style="color:#fff;">${goal.name}</h3>
                    <p style="color:var(--text-muted); font-size:14px;">${goal.currentAmount.toLocaleString()} ₽ / ${goal.targetAmount.toLocaleString()} ₽</p>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${percent}%;"></div></div>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <button class="btn-primary" style="padding:10px;" onclick="addMoney(${goal.id})">+</button>
                    <button class="btn-primary" style="padding:10px; background:#ff0055;" onclick="deleteGoal(${goal.id})">✕</button>
                </div>
            </div>
        `;
    });
}
