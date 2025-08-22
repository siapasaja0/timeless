document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('background-music');
    const opener = document.querySelector('.opener');
    const panels = document.querySelectorAll('.story-panel');
    const backgroundImages = document.querySelectorAll('.bg-image');
    const rainContainer = document.getElementById('rain');
    const waterOverlay = document.querySelector('.water-overlay');
    let currentPanelIndex = 0;
    let isScrolling = false;
    let touchStartY = 0;

    // Membuat percikan air secara dinamis
    for (let i = 0; i < 15; i++) { // Buat 15 percikan
        const drop = document.createElement('div');
        drop.classList.add('splatter-drop');

    // Atur posisi, ukuran, dan waktu acak
        const size = 20 + Math.random() * 50; // Ukuran antara 20px - 70px
        drop.style.width = `${size}px`;
        drop.style.height = `${size}px`;
        drop.style.top = `${Math.random() * 100}%`;
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 7}s`; // Muncul di waktu berbeda
        drop.style.animationDuration = `${2 + Math.random() * 3}s`; // Durasi hidup berbeda

        waterOverlay.appendChild(drop);
    }

    // Membuat tetesan hujan secara dinamis
    for (let i = 0; i < 50; i++) { // Buat 50 tetes hujan
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        rainContainer.appendChild(drop);
    }

    function goToPanel(index) {
    if (index < 0 || index >= panels.length || isScrolling) {
        return;
    }

    isScrolling = true;
    const currentPanel = panels[index];

    panels.forEach(p => p.classList.remove('is-visible'));
    currentPanel.classList.add('is-visible');
    currentPanel.scrollIntoView({ behavior: 'smooth' });

    const newBgId = currentPanel.dataset.bg;

    // Logika Background dan Zoom
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

    // Logika Hujan dan Overlay Air
    if (currentPanel.dataset.bg === 'bg5') {
        rainContainer.style.opacity = '1';
        rainContainer.classList.add('active'); // ++ BARIS BARU: Mengaktifkan overlay
    } else {
        rainContainer.style.opacity = '0';
        rainContainer.classList.remove('active'); // ++ BARIS BARU: Menonaktifkan overlay
    }
    
    // Logika Konfeti
    if (currentPanel.classList.contains('final-panel') || currentPanel.classList.contains('colors-panel')) {
        launchConfetti();
    }

    currentPanelIndex = index;

    setTimeout(() => { isScrolling = false; }, 1200);
    }

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
    
    document.getElementById('bg1').classList.add('active');

    function launchConfetti() {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 100 };
        function randomInRange(min, max) { return Math.random() * (max - min) + min; }
        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    
        // GANTI BLOK KODE LAMA UNTUK BALON DENGAN INI
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach(balloon => {
        balloon.addEventListener('click', () => {
            // Hanya jalankan jika balon belum pecah
            if (!balloon.classList.contains('popped')) {
                balloon.classList.add('popped');
            
                // Mainkan suara 'pop'
                document.getElementById('pop-sound').play();

                // Bonus: Tambahkan efek getar ke layar
                document.body.classList.add('shake');
                setTimeout(() => {
                    document.body.classList.remove('shake');
                }, 150); // Hapus class setelah animasi selesai
            }
        });
