window.onload = function() {
    renderIdeas();
}

function addIdea() {
    const title = document.getElementById('idea-title').value;
    const text = document.getElementById('idea-text').value;

    if (!title) {
        alert("Введите заголовок идеи!");
        return;
    }

    let ideas = JSON.parse(localStorage.getItem('architect_ideas') || "[]");
    ideas.push({
        id: Date.now(),
        title: title,
        text: text,
        status: 'pending', // pending, done, failed
        date: new Date().toLocaleDateString('ru-RU')
    });

    localStorage.setItem('architect_ideas', JSON.stringify(ideas));
    
    document.getElementById('idea-title').value = '';
    document.getElementById('idea-text').value = '';
    renderIdeas();
}

// Смена статуса по клику
function toggleStatus(id) {
    let ideas = JSON.parse(localStorage.getItem('architect_ideas') || "[]");
    const ideaIndex = ideas.findIndex(i => i.id === id);
    
    if (ideaIndex !== -1) {
        if (ideas[ideaIndex].status === 'pending') {
            ideas[ideaIndex].status = 'done';
        } else if (ideas[ideaIndex].status === 'done') {
            ideas[ideaIndex].status = 'failed';
        } else {
            ideas[ideaIndex].status = 'pending';
        }
        localStorage.setItem('architect_ideas', JSON.stringify(ideas));
        renderIdeas();
    }
}

function deleteIdea(id) {
    deleteTargetId = id; // Сохраняем ID
document.getElementById('delete-modal').style.display = 'flex'; // Показываем окно
        let ideas = JSON.parse(localStorage.getItem('architect_ideas') || "[]");
        ideas = ideas.filter(i => i.id !== id);
        localStorage.setItem('architect_ideas', JSON.stringify(ideas));
        renderIdeas();
    }
}

function renderIdeas() {
    const container = document.getElementById('ideas-list');
    container.innerHTML = '';
    
    let ideas = JSON.parse(localStorage.getItem('architect_ideas') || "[]");

    if (ideas.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Идей пока нет. Самое время придумать что-то гениальное!</p>';
        return;
    }

    ideas.forEach(idea => {
        // Настройка цветов в зависимости от статуса
        let bgColor = 'var(--card-bg)';
        let borderColor = 'var(--border-color)';
        let iconHTML = '<span style="color: #888;">⏳</span>'; // В процессе

        if (idea.status === 'done') {
            bgColor = 'rgba(46, 204, 113, 0.1)';
            borderColor = '#2ecc71';
            iconHTML = '<span style="color: #2ecc71; font-size: 24px;">✓</span>';
        } else if (idea.status === 'failed') {
            bgColor = 'rgba(231, 76, 60, 0.1)';
            borderColor = '#e74c3c';
            iconHTML = '<span style="color: #e74c3c; font-size: 24px;">✗</span>';
        }

        let cardHTML = `
            <div class="card" style="background: ${bgColor}; border-color: ${borderColor}; text-align: left; display: flex; gap: 20px; align-items: center;">
                <!-- Кнопка статуса -->
                <div onclick="toggleStatus(${idea.id})" style="cursor: pointer; background: #222; padding: 15px; border-radius: 10px; display: flex; justify-content: center; align-items: center; border: 1px solid #444;" title="Нажми, чтобы сменить статус">
                    ${iconHTML}
                </div>

                <div style="flex-grow: 1;">
                    <h3 style="color: #fff; margin-bottom: 5px;">${idea.title}</h3>
                    <p style="color: #ccc; font-size: 14px; margin-bottom: 10px;">${idea.text}</p>
                    <span style="font-size: 12px; color: var(--text-muted);">Добавлено: ${idea.date}</span>
                </div>

                <button class="btn-primary" onclick="deleteIdea(${idea.id})" style="width: auto; padding: 8px 15px; font-size: 12px; background: #e74c3c; margin: 0;">Удалить</button>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}
