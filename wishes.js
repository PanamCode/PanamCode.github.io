let currentFilter = 'Все';

window.onload = function() {
    renderWishes();
}

function addWish() {
    const title = document.getElementById('wish-title').value;
    const time = document.getElementById('wish-time').value;
    const stepsText = document.getElementById('wish-steps').value;

    if (!title) {
        alert("Введите название хотелки!");
        return;
    }

    // Разбиваем шаги по строчкам
    let steps = stepsText.split('\n').filter(s => s.trim() !== '').map(s => ({ text: s.trim(), done: false }));

    let wishes = JSON.parse(localStorage.getItem('architect_wishes') || "[]");
    wishes.push({
        id: Date.now(),
        title: title,
        time: time,
        steps: steps,
        completed: false // Сама хотелка выполнена?
    });

    localStorage.setItem('architect_wishes', JSON.stringify(wishes));
    
    document.getElementById('wish-title').value = '';
    document.getElementById('wish-steps').value = '';
    renderWishes();
}

function toggleStep(wishId, stepIndex) {
    let wishes = JSON.parse(localStorage.getItem('architect_wishes') || "[]");
    const wishIndex = wishes.findIndex(w => w.id === wishId);
    
    if (wishIndex !== -1) {
        // Переключаем шаг
        wishes[wishIndex].steps[stepIndex].done = !wishes[wishIndex].steps[stepIndex].done;
        
        // Проверяем, все ли шаги выполнены
        const allDone = wishes[wishIndex].steps.every(s => s.done);
        wishes[wishIndex].completed = allDone;
        
        localStorage.setItem('architect_wishes', JSON.stringify(wishes));
        renderWishes();
    }
}

function deleteWish(id) {
    deleteTargetId = id; // Сохраняем ID
document.getElementById('delete-modal').style.display = 'flex'; // Показываем окно
        let wishes = JSON.parse(localStorage.getItem('architect_wishes') || "[]");
        wishes = wishes.filter(w => w.id !== id);
        localStorage.setItem('architect_wishes', JSON.stringify(wishes));
        renderWishes();
    }
}

function filterWishes(type) {
    currentFilter = type;
    renderWishes();
}

function renderWishes() {
    const container = document.getElementById('wishes-list');
    container.innerHTML = '';
    
    let wishes = JSON.parse(localStorage.getItem('architect_wishes') || "[]");

    if (currentFilter !== 'Все') {
        wishes = wishes.filter(w => w.time === currentFilter);
    }

    if (wishes.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Хотелок нет. Самое время помечтать!</p>';
        return;
    }

    wishes.forEach(wish => {
        // Если хотелка выполнена полностью - зеленая, иначе обычная
        let bgColor = wish.completed ? 'rgba(46, 204, 113, 0.1)' : 'var(--card-bg)';
        let borderColor = wish.completed ? '#2ecc71' : 'var(--border-color)';
        
        let stepsHTML = '';
        wish.steps.forEach((step, index) => {
            stepsHTML += `
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px; cursor: pointer;" onclick="toggleStep(${wish.id}, ${index})">
                    <div style="width: 18px; height: 18px; border: 2px solid ${step.done ? '#2ecc71' : '#666'}; border-radius: 4px; display: flex; justify-content: center; align-items: center; background: ${step.done ? '#2ecc71' : 'transparent'};">
                        ${step.done ? '<span style="color: white; font-size: 12px;">✓</span>' : ''}
                    </div>
                    <span style="color: ${step.done ? '#888' : '#ccc'}; text-decoration: ${step.done ? 'line-through' : 'none'}; font-size: 14px;">${step.text}</span>
                </div>
            `;
        });

        let cardHTML = `
            <div class="card" style="background: ${bgColor}; border-color: ${borderColor}; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3 style="color: #fff; margin-bottom: 5px;">${wish.title}</h3>
                    <button class="btn-primary" onclick="deleteWish(${wish.id})" style="width: auto; padding: 5px 10px; font-size: 12px; background: #e74c3c; margin: 0;">Удалить</button>
                </div>
                <span style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 15px;">${wish.time}</span>
                
                <div style="border-top: 1px solid #333; padding-top: 10px;">
                    <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 5px;">Шаги к достижению:</p>
                    ${stepsHTML}
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}
