document.addEventListener("DOMContentLoaded", function() {
    // Находим все карточки на странице
    const cards = document.querySelectorAll('.card, .grid-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Вычисляем угол наклона (чем ближе к краю, тем сильнее наклон)
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            // Применяем 3D-трансформацию
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Возвращаем в исходное положение при уходе мыши
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    });

    // Добавляем свечение за курсором на фон
    const glow = document.createElement('div');
    glow.style.cssText = 'position:fixed; width:400px; height:400px; background:radial-gradient(circle, rgba(46,166,255,0.1) 0%, transparent 70%); border-radius:50%; pointer-events:none; z-index:-1; transform:translate(-50%, -50%); transition: opacity 0.3s;';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
});
