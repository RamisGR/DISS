// Анимация прогресса на Canvas
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".progress-canvas").forEach(canvas => {
        const ctx = canvas.getContext("2d");
        const progress = parseInt(canvas.getAttribute("data-progress"));
        
        canvas.width = canvas.clientWidth;
        canvas.height = 20;
        
        let offset = 0; // Для эффекта движения
        
        function drawProgressBar() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = canvas.width * (progress / 100);
            const waveLength = 20;
            const waveHeight = 5;
            
            // Фон шкалы
            ctx.fillStyle = "#ddd";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Градиент шкалы
            let gradient = ctx.createLinearGradient(0, 0, barWidth, 0);
            gradient.addColorStop(0, "#4caf50");
            gradient.addColorStop(1, "#8bc34a");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, barWidth, canvas.height);

            // Анимированные волны
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            for (let x = 0; x < barWidth; x += waveLength) {
                let yOffset = Math.sin((x + offset) * Math.PI / waveLength) * waveHeight;
                ctx.fillRect(x, yOffset, waveLength / 2, canvas.height);
            }

            offset -= 1.5; // Скорость анимации
            requestAnimationFrame(drawProgressBar);
        }

        drawProgressBar();
    });
});

// Переключение светлой/тёмной темы
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}
