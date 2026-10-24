window.onload = function() {
    renderHabits();
}

function addHabit() {
    const name = document.getElementById('habit-name').value;
    const color = document.getElementById('habit-color').value;

    if (!name) {
        alert("Введите название привычки!");
        return;
    }

    let habits = JSON.parse(localStorage.getItem('architect_habits') || "[]");

    // Проверка на одинаковый цвет
    const colorExists = habits.find(h => h.color === color);
    if (colorExists) {
        if(!confirm(`У вас уже есть привычка "${colorExists.name}" с таким цветом. Точно хотите оставить одинаковый цвет?`)) {
            return; // Если нажали "Отмена", прерываем добавление
        }
    }

    habits.push({
        id: Date.now(),
        name: name,
        color: color,
        history: {} // Здесь будем хранить отмеченные дни (YYYY-MM-DD: true)
    });

    localStorage.setItem('architect_habits', JSON.stringify(habits));
    
    document.getElementById('habit-name').value = '';
    renderHabits();
}

function deleteHabit(id) {
    deleteTargetId = id; // Сохраняем ID
document.getElementById('delete-modal').style.display = 'flex'; // Показываем окно
        let habits = JSON.parse(localStorage.getItem('architect_habits') || "[]");
        habits = habits.filter(h => h.id !== id);
        localStorage.setItem('architect_habits', JSON.stringify(habits));
        renderHabits();
    }
}

function toggleHabitDay(habitId, dateStr) {
    let habits = JSON.parse(localStorage.getItem('architect_habits') || "[]");
    const habitIndex = habits.findIndex(h => h.id === habitId);
    
    if (habitIndex !== -1) {
        if (habits[habitIndex].history[dateStr]) {
            delete habits[habitIndex].history[dateStr]; // Снимаем галочку
        } else {
            habits[habitIndex].history[dateStr] = true; // Ставим галочку
        }
        localStorage.setItem('architect_habits', JSON.stringify(habits));
        renderHabits();
    }
}

function renderHabits() {
    const container = document.getElementById('habits-list');
    container.innerHTML = '';
    
    let habits = JSON.parse(localStorage.getItem('architect_habits') || "[]");

    if (habits.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Привычек нет. Начни формировать дисциплину!</p>';
        return;
    }

    // Получаем последние 7 дней (включая сегодня)
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push({
            str: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
            dayName: d.toLocaleDateString('ru-RU', { weekday: 'short' }),
            dayNum: d.getDate()
        });
    }

    habits.forEach(habit => {
        // Генерируем кнопки для последних 7 дней
        let daysHTML = '';
        dates.forEach(dateInfo => {
            const isChecked = habit.history[dateInfo.str];
            // Если отмечено - закрашиваем цветом привычки, иначе - темный фон
            let bgColor = isChecked ? habit.color : '#1e1e1e';
            let borderColor = isChecked ? habit.color : '#333';
            
            daysHTML += `
                <div onclick="toggleHabitDay(${habit.id}, '${dateInfo.str}')" 
                     style="display: flex; flex-direction: column; align-items: center; justify-content: center; 
                            width: 45px; height: 55px; background: ${bgColor}; border: 1px solid ${borderColor}; 
                            border-radius: 8px; cursor: pointer; transition: 0.2s;">
                    <span style="font-size: 10px; color: ${isChecked ? '#000' : '#888'}; text-transform: uppercase;">${dateInfo.dayName}</span>
                    <span style="font-size: 16px; font-weight: bold; color: ${isChecked ? '#000' : '#fff'};">${dateInfo.dayNum}</span>
                </div>
            `;
        });

        let cardHTML = `
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; text-align: left; padding: 15px 20px;">
                <div style="flex-grow: 1;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <div style="width: 15px; height: 15px; border-radius: 50%; background: ${habit.color};"></div>
                        <h3 style="color: #fff; margin: 0; font-size: 18px;">${habit.name}</h3>
                    </div>
                    
                    <div style="display: flex; gap: 5px;">
                        ${daysHTML}
                    </div>
                </div>
                
                <button class="btn-primary" onclick="deleteHabit(${habit.id})" style="width: auto; padding: 8px 15px; font-size: 12px; background: #e74c3c; margin-left: 20px;">Удалить</button>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}
