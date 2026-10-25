let currentDate = new Date();
let selectedDateStr = "";

window.onload = function() { renderCalendar(); }

function changeMonth(dir) {
    currentDate.setMonth(currentDate.getMonth() + dir);
    renderCalendar();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    document.getElementById('month-year').innerText = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let firstDayIndex = firstDay.getDay();
    if (firstDayIndex === 0) firstDayIndex = 7;

    const daysContainer = document.getElementById('calendar-days');
    daysContainer.innerHTML = '';

    for (let i = 1; i < firstDayIndex; i++) daysContainer.innerHTML += `<div></div>`;

    let calendarData = JSON.parse(localStorage.getItem('architect_calendar') || "{}");

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = calendarData[dateStr];
        
        let bgColor = 'rgba(255,255,255,0.02)';
        if (dayData) {
            if (dayData.status === 'success') bgColor = 'rgba(0, 243, 255, 0.2)';
            if (dayData.status === 'fail') bgColor = 'rgba(255, 0, 85, 0.2)';
        }

        daysContainer.innerHTML += `
            <div class="cal-day" style="background: ${bgColor};" onclick="openDayModal('${dateStr}')">${day}</div>
        `;
    }
}

function openDayModal(dateStr) {
    selectedDateStr = dateStr;
    const calendarData = JSON.parse(localStorage.getItem('architect_calendar') || "{}");
    const dayData = calendarData[dateStr] || { status: 'none', note: '' };
    document.getElementById('modal-date-title').innerText = dateStr;
    document.getElementById('day-status').value = dayData.status;
    document.getElementById('day-note').value = dayData.note;
    document.getElementById('day-modal').style.display = 'flex';
}

function closeDayModal() { document.getElementById('day-modal').style.display = 'none'; }

function saveDay() {
    const status = document.getElementById('day-status').value;
    const note = document.getElementById('day-note').value;
    let calendarData = JSON.parse(localStorage.getItem('architect_calendar') || "{}");
    if (status === 'none' && note === '') delete calendarData[selectedDateStr];
    else calendarData[selectedDateStr] = { status, note };
    localStorage.setItem('architect_calendar', JSON.stringify(calendarData));
    closeDayModal();
    renderCalendar();
}
