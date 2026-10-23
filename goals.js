window.onload = function() {
    renderGoals();
}

function toggleForm() {
    const form = document.getElementById('goal-form');
    form.style.display = (form.style.display === 'none' || form.style.display === '') ? 'block' : 'none';
}

function saveGoal() {
    const name = document.getElementById('goal-name').value;
    const amount = parseInt(document.getElementById('goal-amount').value) || 0;
    const image = document.getElementById('goal-image').value;

    if (!name) {
        alert("Введите название цели!");
        return;
    }

    let goals = JSON.parse(localStorage.getItem('architect_goals') || "[]");
    goals.push({
        id: Date.now(),
        name: name,
        targetAmount: amount,
        currentAmount: 0,
        image: image || null
    });

    localStorage.setItem('architect_goals', JSON.stringify(goals));
    
    // Очищаем форму и скрываем её
    document.getElementById('goal-name').value = '';
    document.getElementById('goal-amount').value = '';
    document.getElementById('goal-image').value = '';
    toggleForm();
    
    renderGoals();
}

function deleteGoal(id) {
    if(confirm("Точно удалить эту цель?")) {
        let goals = JSON.parse(localStorage.getItem('architect_goals') || "[]");
        goals = goals.filter(g => g.id !== id);
        localStorage.setItem('architect_goals', JSON.stringify(goals));
        renderGoals();
    }
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
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">У тебя пока нет целей. Самое время добавить первую!</p>';
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
            <div class="card" style="display: flex; gap: 20px; align-items: center; position: relative;">
                ${goal.image ? `<img src="${goal.image}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">` : '<div style="width: 100px; height: 100px; background: #333; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-size: 30px;">🎯</div>'}
                
                <div style="flex-grow: 1;">
                    <h2 style="margin-bottom: 10px; font-size: 20px;">${goal.name}</h2>
                    ${goal.targetAmount > 0 ? `
                        <div class="progress-container" style="height: 15px;">
                            <div class="progress-bar" style="width: ${progressPercent}%;"></div>
                        </div>
                        <p style="color: #ccc; font-size: 14px; margin-top: 5px;">
                            Собрано: <strong>${goal.currentAmount.toLocaleString()} ₽</strong> из ${goal.targetAmount.toLocaleString()} ₽ 
                            <br><span style="color: var(--text-muted);">Осталось: ${remaining > 0 ? remaining.toLocaleString() : 0} ₽</span>
                        </p>
                    ` : `<p style="color: var(--text-muted);">Описательная цель</p>`}
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${goal.targetAmount > 0 ? `<button class="btn-primary" onclick="addMoney(${goal.id})" style="padding: 8px 15px; font-size: 14px;">+ Пополнить</button>` : ''}
                    <button class="btn-primary" onclick="deleteGoal(${goal.id})" style="background-color: #e74c3c; padding: 8px 15px; font-size: 14px;">Удалить</button>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}
