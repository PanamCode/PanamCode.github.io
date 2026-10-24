let currentFilter = 'Все';
let deleteTargetId = null;

window.onload = function() {
    // Устанавливаем сегодняшнюю дату по умолчанию
    document.getElementById('plan-date').valueAsDate = new Date();
    renderPlans();
}

function addPlan() {
    const text = document.getElementById('plan-text').value;
    const type = document.getElementById('plan-type').value;
    const date = document.getElementById('plan-date').value;

    if (!text) {
        alert("Напишите, что нужно сделать!");
        return;
    }

    let plans = JSON.parse(localStorage.getItem('architect_plans') || "[]");
    plans.push({
        id: Date.now(),
        text: text,
        type: type,
        date: date || 'Без даты',
        completed: false
    });

    localStorage.setItem('architect_plans', JSON.stringify(plans));
    
    document.getElementById('plan-text').value = '';
    renderPlans();
}

function togglePlan(id) {
    let plans = JSON.parse(localStorage.getItem('architect_plans') || "[]");
    const planIndex = plans.findIndex(p => p.id === id);
    
    if (planIndex !== -1) {
        plans[planIndex].completed = !plans[planIndex].completed;
        localStorage.setItem('architect_plans', JSON.stringify(plans));
        renderPlans();
    }
}

// 1. Вызываем красивое окно
function deletePlan(id) {
    deleteTargetId = id;
    document.getElementById('custom-delete-modal').style.display = 'flex';
}

// 2. Закрываем окно (если передумали)
function closeCustomModal() {
    document.getElementById('custom-delete-modal').style.display = 'none';
    deleteTargetId = null;
}

// 3. Подтверждаем удаление
function confirmCustomDelete() {
    if (deleteTargetId) {
        let plans = JSON.parse(localStorage.getItem('architect_plans') || "[]");
        plans = plans.filter(p => p.id !== deleteTargetId);
        localStorage.setItem('architect_plans', JSON.stringify(plans));
        closeCustomModal();
        renderPlans();
    }
}

function filterPlans(type) {
    currentFilter = type;
    renderPlans();
}

function renderPlans() {
    const container = document.getElementById('plans-list');
    container.innerHTML = '';
    
    let plans = JSON.parse(localStorage.getItem('architect_plans') || "[]");

    // Фильтрация
    if (currentFilter !== 'Все') {
        plans = plans.filter(p => p.type === currentFilter);
    }

    // Сортировка: сначала невыполненные, потом по дате
    plans.sort((a, b) => a.completed - b.completed);

    if (plans.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Планов нет. Самое время что-то запланировать!</p>';
        return;
    }

    plans.forEach(plan => {
        let bgColor = plan.completed ? 'rgba(46, 204, 113, 0.1)' : 'var(--card-bg)';
        let borderColor = plan.completed ? '#2ecc71' : 'var(--border-color)';
        let textDecoration = plan.completed ? 'line-through' : 'none';
        let textColor = plan.completed ? '#888' : '#fff';

        let cardHTML = `
            <div class="card" style="background: ${bgColor}; border-color: ${borderColor}; display: flex; align-items: center; gap: 15px; padding: 15px; transition: all 0.3s ease;">
                <!-- Чекбокс -->
                <div onclick="togglePlan(${plan.id})" style="cursor: pointer; width: 24px; height: 24px; border: 2px solid ${plan.completed ? '#2ecc71' : '#666'}; border-radius: 5px; display: flex; justify-content: center; align-items: center; background: ${plan.completed ? '#2ecc71' : 'transparent'}; transition: all 0.3s ease;">
                    ${plan.completed ? '<span style="color: white; font-size: 16px;">✓</span>' : ''}
                </div>

                <div style="flex-grow: 1;">
                    <p style="color: ${textColor}; text-decoration: ${textDecoration}; font-size: 16px; margin-bottom: 5px; transition: all 0.3s ease;">${plan.text}</p>
                    <span style="font-size: 12px; color: var(--text-muted);">${plan.type} • ${plan.date}</span>
                </div>

                <button class="btn-primary" onclick="deletePlan(${plan.id})" style="width: auto; padding: 5px 10px; font-size: 12px; background: #e74c3c; margin: 0;">Удалить</button>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}
