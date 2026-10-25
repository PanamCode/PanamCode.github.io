document.addEventListener("DOMContentLoaded", function() {
    // 3D-эффект для всех карточек
    const cards = document.querySelectorAll('.bento-card, .card, .grid-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Наклон (чем ближе к центру, тем меньше, чем ближе к краю — тем сильнее)
            const rotateX = ((y - centerY) / centerY) * -10; // Максимум 10 градусов
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // Свечение за курсором на фоне
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed; width: 600px; height: 600px; 
        background: radial-gradient(circle, rgba(0, 240, 255, 0.05) 0%, transparent 60%); 
        border-radius: 50%; pointer-events: none; z-index: 0; 
        transform: translate(-50%, -50%); transition: opacity 0.5s;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
});
