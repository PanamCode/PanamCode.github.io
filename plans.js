let currentFilter = 'Все';
let deleteTargetId = null;

window.onload = function() {
    document.getElementById('plan-date').valueAsDate = new Date();
    renderPlans();
}

function addPlan() {
    const text = document.getElementById('plan-text').value;
    const type = document.getElementById('plan-type').value;
    const date = document.getElementById('plan-date').value;
    if (!text) return;

    let plans = JSON.parse(localStorage.getItem('architect_plans') || "[]");
    plans.push({ id: Date.now(), text: text, type: type, date: date || 'Без даты', completed: false });
    localStorage.setItem('architect_plans', JSON.stringify(plans));
    document.getElementById('plan-text').value = '';
    renderPlans();
}

function togglePlan(id) {
    let plans = JSON.parse(localStorage.getItem('architect_plans') || "[]");
    const idx = plans.findIndex(p => p.id === id);
    if (idx !== -1) {
        plans[idx].completed = !plans[idx].completed;
        localStorage.setItem('architect_plans', JSON.stringify(plans));
        renderPlans();
    }
}

function deletePlan(id) { deleteTargetId = id; document.getElementById('custom-delete-modal').style.display = 'flex'; }
function closeCustomModal() { document.getElementById('custom-delete-modal').style.display = 'none'; }
function confirmCustomDelete() {
    let plans = JSON.parse(localStorage.getItem('architect_plans') || "[]");
    plans = plans.filter(p => p.id !== deleteTargetId);
    localStorage.setItem('architect_plans', JSON.stringify(plans));
    closeCustomModal(); renderPlans();
}

function filterPlans(type) { currentFilter = type; renderPlans(); }

function renderPlans() {
    const container = document.getElementById('plans-list');
    container.innerHTML = '';
    let plans = JSON.parse(localStorage.getItem('architect_plans') || "[]");
    if (currentFilter !== 'Все') plans = plans.filter(p => p.type === currentFilter);
    plans.sort((a, b) => a.completed - b.completed);

    if (plans.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Задач нет.</p>';
        return;
    }

    plans.forEach(plan => {
        let opacity = plan.completed ? '0.5' : '1';
        let textDecor = plan.completed ? 'line-through' : 'none';
        container.innerHTML += `
            <div class="plan-item" style="opacity: ${opacity};">
                <div class="card" style="padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="color: #fff; text-decoration: ${textDecor}; font-weight: 600;">${plan.text}</p>
                        <span style="color: var(--neon-cyan); font-size: 12px;">${plan.type} • ${plan.date}</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-primary" style="width: 40px; padding: 0; height: 40px; border-radius: 50%;" onclick="togglePlan(${plan.id})">${plan.completed ? '↺' : '✓'}</button>
                        <button class="btn-primary" style="width: 40px; padding: 0; height: 40px; border-radius: 50%; background: #ff0055;" onclick="deletePlan(${plan.id})">✕</button>
                    </div>
                </div>
            </div>
        `;
    });
}
