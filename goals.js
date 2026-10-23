window.onload = function() {
    renderGoals();
}

function addGoal() {
    const name = prompt("Название цели (например, Porsche Panamera):");
    if (!name) return;
    
    const amountStr = prompt("Необходимая сумма в рублях (или 0, если цель не про деньги):");
    const amount = parseInt(amountStr) || 0;
    
    const imageUrl = prompt("Вставь ссылку на картинку цели (или оставь пустым):");

    let goals = JSON.parse(localStorage.getItem('architect_goals') || "[]");
    goals.push({
        id: Date.now(),
        name: name,
        targetAmount: amount,
        currentAmount: 0,
        image: imageUrl || null
    });

    localStorage.setItem('architect_goals', JSON.stringify(goals));
    renderGoals();
}

function addMoney(id) {
    const amountStr = prompt("Сколько добавить к этой цели?");
    const amount = parseInt(amountStr);
    if (!amount || amount <= 0) return;

    let goals = JSON.parse(localStorage.getItem('architect_goals') || "[]");
    const goalIndex = goals.findIndex(g => g.id === id);
    
    if (goalIndex !== -1) {
        goals[goalIndex].currentAmount += amount;
        localStorage.setItem('architect_goals', JSON.stringify(goals));
        renderGoals();
    }
}

function renderGoals() {
    const container = document.getElementById('goals-list');
    container.innerHTML = '';
    
    let goals = JSON.parse(localStorage.getItem('architect_goals') || "[]");

    if (goals.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted);">У тебя пока нет целей. Самое время добавить первую!</p>';
        return;
    }

    goals.forEach(goal => {
        let progressPercent = 0;
        let remaining = 0;

        if (goal.targetAmount > 0) {
            progressPercent = (goal.currentAmount / goal.targetAmount) * 100;
            if (progressPercent > 100) progressPercent = 100;
            remaining = goal.targetAmount - goal.currentAmount;
        }

        let cardHTML = `
            <div class="card" style="display: flex; gap: 20px; align-items: center;">
                ${goal.image ? `<img src="${goal.image}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;">` : ''}
                <div style="flex-grow: 1;">
                    <h2 style="margin-bottom: 10px;">${goal.name}</h2>
                    ${goal.targetAmount > 0 ? `
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${progressPercent}%;"></div>
                        </div>
                        <p style="color: var(--text-muted); font-size: 14px;">
                            Собрано: ${goal.currentAmount.toLocaleString()} ₽ из ${goal.targetAmount.toLocaleString()} ₽ 
                            (Осталось: ${remaining > 0 ? remaining.toLocaleString() : 0} ₽)
                        </p>
                    ` : `<p style="color: var(--text-muted);">Описательная цель</p>`}
                </div>
                ${goal.targetAmount > 0 ? `<button class="btn-primary" onclick="addMoney(${goal.id})">+ Пополнить</button>` : ''}
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}
