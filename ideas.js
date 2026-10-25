window.onload = function() { renderIdeas(); }

function addIdea() {
    const title = document.getElementById('idea-title').value;
    const text = document.getElementById('idea-text').value;
    if (!title) return;

    let ideas = JSON.parse(localStorage.getItem('architect_ideas') || "[]");
    ideas.push({ id: Date.now(), title: title, text: text, status: 'pending' });
    localStorage.setItem('architect_ideas', JSON.stringify(ideas));
    document.getElementById('idea-title').value = '';
    document.getElementById('idea-text').value = '';
    renderIdeas();
}

function toggleStatus(id) {
    let ideas = JSON.parse(localStorage.getItem('architect_ideas') || "[]");
    const idx = ideas.findIndex(i => i.id === id);
    if (idx !== -1) {
        if (ideas[idx].status === 'pending') ideas[idx].status = 'done';
        else if (ideas[idx].status === 'done') ideas[idx].status = 'failed';
        else ideas[idx].status = 'pending';
        localStorage.setItem('architect_ideas', JSON.stringify(ideas));
        renderIdeas();
    }
}

function deleteIdea(id) {
    let ideas = JSON.parse(localStorage.getItem('architect_ideas') || "[]");
    ideas = ideas.filter(i => i.id !== id);
    localStorage.setItem('architect_ideas', JSON.stringify(ideas));
    renderIdeas();
}

function renderIdeas() {
    const container = document.getElementById('ideas-list');
    container.innerHTML = '';
    let ideas = JSON.parse(localStorage.getItem('architect_ideas') || "[]");

    if (ideas.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Идей нет.</p>';
        return;
    }

    ideas.forEach(idea => {
        let color = 'var(--glass-border)';
        let icon = '⏳';
        if (idea.status === 'done') { color = 'var(--neon-cyan)'; icon = '✓'; }
        if (idea.status === 'failed') { color = '#ff0055'; icon = '✗'; }

        container.innerHTML += `
            <div class="idea-card" style="background: ${color};">
                <div class="idea-inner">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <div style="display:flex; gap:10px; align-items:center;">
                            <button onclick="toggleStatus(${idea.id})" style="background:rgba(255,255,255,0.1); border:none; width:35px; height:35px; border-radius:50%; color:#fff; cursor:pointer;">${icon}</button>
                            <h3 style="color: #fff;">${idea.title}</h3>
                        </div>
                        <button onclick="deleteIdea(${idea.id})" style="background:none; border:none; color:#ff0055; cursor:pointer; font-size:18px;">✕</button>
                    </div>
                    <p style="color: var(--text-muted); font-size: 14px;">${idea.text}</p>
                </div>
            </div>
        `;
    });
}
