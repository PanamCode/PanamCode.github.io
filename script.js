// Эффект 3D-наклона карточек при движении мыши
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glass-card');
    const x = (window.innerWidth / 2 - e.pageX) / 30;
    const y = (window.innerHeight / 2 - e.pageY) / 30;

    cards.forEach(card => {
        card.style.transform = `translateY(-5px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
});

// Плавное появление элементов при загрузке
window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});
