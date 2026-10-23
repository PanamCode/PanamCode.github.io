window.onload = function() {
    renderTimers();
    // Обновляем таймеры каждую минуту, чтобы они не отставали
    setInterval(renderTimers, 60000); 
}

function addTimer() {
    const title = document.getElementById('timer-title').value;
    const dateStr = document.getElementById('timer-date').value;

    if (!title || !dateStr) {
        alert("Заполните название и выберите дату!");
        return;
    }

    let timers = JSON.parse(localStorage.getItem('architect_timers') || "[]");
    timers.push({
        id: Date.now(),
        title: title,
        targetDate: dateStr
    });

    localStorage.setItem('architect_timers', JSON.stringify(timers));
    
    document.getElementById('timer-title').value = '';
    document.getElementById('timer-date').value = '';
    renderTimers();
}

function deleteTimer(id) {
    if(confirm("Удалить этот таймер?")) {
        let timers = JSON.parse(localStorage.getItem('architect_timers') || "[]");
        timers = timers.filter(t => t.id !== id);
        localStorage.setItem('architect_timers', JSON.stringify(timers));
        renderTimers();
    }
}

function renderTimers() {
    const container = document.getElementById('timers-list');
    container.innerHTML = '';
    
    let timers = JSON.parse(localStorage.getItem('architect_timers') || "[]");

    if (timers.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Таймеров нет. Добавь свою главную цель!</p>';
        return;
    }

    // Сегодняшняя дата (обнуляем время до полуночи для точного подсчета дней)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    timers.forEach(timer => {
        const target = new Date(timer.targetDate);
        target.setHours(0, 0, 0, 0);

        // Разница в миллисекундах
        const diffTime = target - today;
        // Переводим в дни
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let daysHTML = '';
        let borderColor = 'var(--border-color)';

        if (diffDays > 0) {
            daysHTML = `<span style="font-size: 48px; font-weight: bold; color: var(--accent-orange);">${diffDays}</span> <span style="color: var(--text-muted);">дней осталось</span>`;
        } else if (diffDays === 0) {
            daysHTML = `<span style="font-size: 32px; font-weight: bold; color: #2ecc71;">Сегодня!</span>`;
            borderColor = '#2ecc71';
        } else {
            daysHTML = `<span style="font-size: 32px; font-weight: bold; color: #e74c3c;">Просрочено</span>`;
            borderColor = '#e74c3c';
        }

        let cardHTML = `
            <div class="card" style="border-color: ${borderColor}; display: flex; justify-content: space-between; align-items: center; padding: 25px;">
                <div style="text-align: left;">
                    <h3 style="color: #fff; margin-bottom: 5px; font-size: 24px;">${timer.title}</h3>
                    <p style="color: var(--text-muted); font-size: 14px;">Дедлайн: ${target.toLocaleDateString('ru-RU')}</p>
                </div>
                
                <div style="text-align: right; display: flex; align-items: center; gap: 20px;">
                    <div>${daysHTML}</div>
                    <button class="btn-primary" onclick="deleteTimer(${timer.id})" style="width: auto; padding: 5px 10px; font-size: 12px; background: #e74c3c; margin: 0;">Удалить</button>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}
