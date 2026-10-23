let currentDate = new Date();
let selectedDateStr = "";

window.onload = function() {
    renderCalendar();
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    document.getElementById('month-year').innerText = `${monthNames[month]} ${year}`;

    // Получаем первый день месяца и количество дней в месяце
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // День недели первого дня (0 - Вс, 1 - Пн... приводим к 1-7, где 1 - Пн)
    let firstDayIndex = firstDay.getDay();
    if (firstDayIndex === 0) firstDayIndex = 7; 

    const daysContainer = document.getElementById('calendar-days');
    daysContainer.innerHTML = '';

    // Пустые ячейки до начала месяца
    for (let i = 1; i < firstDayIndex; i++) {
        daysContainer.innerHTML += `<div></div>`;
    }

    // Получаем данные из памяти
    let calendarData = JSON.parse(localStorage.getItem('architect_calendar') || "{}");

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = calendarData[dateStr];
        
        let bgColor = '#1e1e1e'; // Обычный
        let textColor = '#fff';
        let title = '';

        if (dayData) {
            if (dayData.status === 'success') bgColor = 'rgba(46, 204, 113, 0.3)';
            if (dayData.status === 'fail') bgColor = 'rgba(231, 76, 60, 0.3)';
            if (dayData.note) title = dayData.note;
        }

        daysContainer.innerHTML += `
            <div onclick="openDayModal('${dateStr}')" 
                 style="background: ${bgColor}; color: ${textColor}; padding: 15px 0; border-radius: 8px; cursor: pointer; border: 1px solid #333; transition: 0.2s;" 
                 title="${title}">
                ${day}
            </div>
        `;
    }
}

function openDayModal(dateStr) {
    selectedDateStr = dateStr;
    const calendarData = JSON.parse(localStorage.getItem('architect_calendar') || "{}");
    const dayData = calendarData[dateStr] || { status: 'none', note: '' };

    document.getElementById('modal-date-title').innerText = `День: ${dateStr}`;
    document.getElementById('day-status').value = dayData.status;
    document.getElementById('day-note').value = dayData.note;
    
    document.getElementById('day-modal').style.display = 'flex';
}

function closeDayModal() {
    document.getElementById('day-modal').style.display = 'none';
}

function saveDay() {
    const status = document.getElementById('day-status').value;
    const note = document.getElementById('day-note').value;

    let calendarData = JSON.parse(localStorage.getItem('architect_calendar') || "{}");

    if (status === 'none' && note === '') {
        delete calendarData[selectedDateStr]; // Если пусто, удаляем
    } else {
        calendarData[selectedDateStr] = { status, note };
    }

    localStorage.setItem('architect_calendar', JSON.stringify(calendarData));
    closeDayModal();
    renderCalendar();
}
