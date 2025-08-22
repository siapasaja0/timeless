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
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
    });

    // === INISIALISASI EFEK VISUAL ===
    // Membuat percikan air secara dinamis
    for (let i = 0; i < 15; i++) {
        const drop = document.createElement('div');
        drop.classList.add('splatter-drop');
        const size = 20 + Math.random() * 50;
        drop.style.width = `${size}px`;
        drop.style.height = `${size}px`;
        drop.style.top = `${Math.random() * 100}%`;
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 7}s`;
        drop.style.animationDuration = `${2 + Math.random() * 3}s`;
        waterOverlay.appendChild(drop);
    }

    // Membuat tetesan hujan secara dinamis
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        rainContainer.appendChild(drop);
    }

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
        
        // Logika Hujan & Splatter
        if (currentPanel.dataset.bg === 'bg5') {
            rainContainer.style.opacity = '1';
            rainContainer.classList.add('active');
        } else {
            rainContainer.style.opacity = '0';
            rainContainer.classList.remove('active');
        }
        
        // Logika Konfeti
        if (currentPanel.classList.contains('final-panel') || currentPanel.classList.contains('colors-panel')) {
            launchConfetti();
        }

        currentPanelIndex = index;
        setTimeout(() => { isScrolling = false; }, 1200);
    }

    function launchConfetti() {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    }

    // === EVENT LISTENERS ===
    opener.addEventListener('click', () => {
        music.play().catch(error => console.log("Autoplay ditolak."));
        goToPanel(1);
    }, { once: true });

    window.addEventListener('wheel', event => {
        if (isScrolling) return;
        if (event.deltaY > 0) { goToPanel(currentPanelIndex + 1); } 
        else { goToPanel(currentPanelIndex - 1); }
    });

    window.addEventListener('touchstart', event => { touchStartY = event.touches[0].clientY; });
    window.addEventListener('touchend', event => {
        if (isScrolling) return;
        const touchEndY = event.changedTouches[0].clientY;
        if (touchStartY - touchEndY > 50) { goToPanel(currentPanelIndex + 1); } 
        else if (touchEndY - touchStartY > 50) { goToPanel(currentPanelIndex - 1); }
    });

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
