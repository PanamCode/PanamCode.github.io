window.onload = function() {
    renderTimers();
    setInterval(renderTimers, 60000);
}

function addTimer() {
    const title = document.getElementById('timer-title').value;
    const date = document.getElementById('timer-date').value;
    if (!title || !date) return;

    let timers = JSON.parse(localStorage.getItem('architect_timers') || "[]");
    timers.push({ id: Date.now(), title: title, targetDate: date });
    localStorage.setItem('architect_timers', JSON.stringify(timers));
    document.getElementById('timer-title').value = '';
    renderTimers();
}

function deleteTimer(id) {
    let timers = JSON.parse(localStorage.getItem('architect_timers') || "[]");
    timers = timers.filter(t => t.id !== id);
    localStorage.setItem('architect_timers', JSON.stringify(timers));
    renderTimers();
}

function renderTimers() {
    const container = document.getElementById('timers-list');
    container.innerHTML = '';
    let timers = JSON.parse(localStorage.getItem('architect_timers') || "[]");
    const today = new Date(); today.setHours(0,0,0,0);

    if (timers.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Таймеров нет.</p>';
        return;
    }

    timers.forEach(timer => {
        const target = new Date(timer.targetDate); target.setHours(0,0,0,0);
        const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
        
        let display = diff > 0 ? diff : '0';
        let label = diff > 0 ? 'дней' : 'Сегодня!';

        container.innerHTML += `
            <div class="card" style="text-align: center; position: relative;">
                <button onclick="deleteTimer(${timer.id})" style="position:absolute; top:15px; right:15px; background:none; border:none; color:#ff0055; font-size:20px; cursor:pointer;">✕</button>
                <h3 style="color: var(--text-main); margin-bottom: 10px;">${timer.title}</h3>
                <div class="timer-display">${display}</div>
                <p style="color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px;">${label}</p>
            </div>
        `;
    });
}
