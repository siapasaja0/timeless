document.addEventListener('DOMContentLoaded', () => {
    // === DEKLARASI ELEMEN ===
    const music = document.getElementById('background-music');
    const popSound = document.getElementById('pop-sound');
    const preloader = document.getElementById('preloader');
    const opener = document.querySelector('.opener');
    const panels = document.querySelectorAll('.story-panel');
    const backgroundImages = document.querySelectorAll('.bg-image');
    const rainContainer = document.getElementById('rain');
    const waterOverlay = document.querySelector('.water-overlay');
    const balloons = document.querySelectorAll('.balloon');
    const replayButton = document.getElementById('replay-button');

    let currentPanelIndex = 0;
    let isScrolling = false;
    let touchStartY = 0;
    let poppedBalloons = 0;

    // === LOGIKA PRELOADER ===
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
    });

    // === INISIALISASI EFEK ===
    // (Kode untuk membuat percikan air dan tetesan hujan tetap sama...)
    for (let i = 0; i < 15; i++) { /* ... kode splatter ... */ }
    for (let i = 0; i < 50; i++) { /* ... kode rain drops ... */ }

    // === FUNGSI UTAMA ===
    function goToPanel(index) {
        if (index < 0 || index >= panels.length || isScrolling) return;

        isScrolling = true;
        const currentPanel = panels[index];
        panels.forEach(p => p.classList.remove('is-visible'));
        currentPanel.classList.add('is-visible');
        currentPanel.scrollIntoView({ behavior: 'smooth' });

        const newBgId = currentPanel.dataset.bg;
        if (newBgId) {
            const newBg = document.getElementById(newBgId);
            backgroundImages.forEach(img => {
                img.classList.remove('active');
                img.classList.remove('zooming');
            });
            newBg.classList.add('active');
            newBg.classList.add('zooming');
        } else {
            backgroundImages.forEach(img => {
                img.classList.remove('active');
                img.classList.remove('zooming');
            });
        }
        
        // (Logika Hujan, Konfeti, dll tetap sama...)
        if (currentPanel.dataset.bg === 'bg5') { rainContainer.classList.add('active'); } 
        else { rainContainer.classList.remove('active'); }
        if (currentPanel.classList.contains('final-panel') || currentPanel.classList.contains('colors-panel')) { launchConfetti(); }

        currentPanelIndex = index;
        setTimeout(() => { isScrolling = false; }, 1200);
    }

    function launchConfetti() { /* ... kode confetti ... */ }

    // === EVENT LISTENERS ===
    opener.addEventListener('click', () => { /* ... kode opener ... */ });
    window.addEventListener('wheel', event => { /* ... kode wheel ... */ });
    window.addEventListener('touchstart', event => { /* ... kode touchstart ... */ });
    window.addEventListener('touchend', event => { /* ... kode touchend ... */ });

    // Logika untuk Balon & Tombol Replay
    balloons.forEach(balloon => {
        balloon.addEventListener('click', () => {
            if (!balloon.classList.contains('popped')) {
                balloon.classList.add('popped');
                popSound.play().catch(e => {});
                document.body.classList.add('shake');
                setTimeout(() => { document.body.classList.remove('shake'); }, 150);
                
                poppedBalloons++;
                if (poppedBalloons === balloons.length) {
                    replayButton.classList.add('visible');
                }
            }
        });
    });

    replayButton.addEventListener('click', () => {
        location.reload();
    });

    // Inisialisasi Awal
    document.getElementById('bg1').classList.add('active');
});
