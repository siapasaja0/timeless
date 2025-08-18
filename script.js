document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('background-music');
    const opener = document.querySelector('.opener');
    const panels = document.querySelectorAll('.story-panel');
    const backgroundImages = document.querySelectorAll('.bg-image');
    let currentPanelIndex = 0;
    let isScrolling = false;
    let touchStartY = 0;

    // Fungsi utama untuk pindah panel
    function goToPanel(index) {
    if (index < 0 || index >= panels.length || isScrolling) {
        return;
    }

    isScrolling = true;
    panels.forEach(p => p.classList.remove('is-visible'));
    panels[index].classList.add('is-visible');
    panels[index].scrollIntoView({ behavior: 'smooth' });

    // === LOGIKA BARU UNTUK BACKGROUND & ZOOM ===
    const newBgId = panels[index].dataset.bg;

    if (newBgId) {
        // Jika panel PUNYA background
        const newBg = document.getElementById(newBgId);
        
        // Matikan semua background lain dulu untuk me-reset
        backgroundImages.forEach(img => {
            img.classList.remove('active');
            img.classList.remove('zooming');
        });

        // Nyalakan background yang benar beserta animasinya
        newBg.classList.add('active');
        newBg.classList.add('zooming');
    } else {
        // Jika panel KOSONG (layar hitam)
        // Matikan SEMUA background dan animasi
        backgroundImages.forEach(img => {
            img.classList.remove('active');
            img.classList.remove('zooming');
        });
    }

        // Jalankan confetti di panel terakhir
        if (panels[index].classList.contains('final-panel') || panels[index].classList.contains('colors-panel')) {
            launchConfetti();
        }

        currentPanelIndex = index;

        // Beri jeda agar animasi selesai sebelum bisa scroll lagi
        setTimeout(() => {
            isScrolling = false;
        }, 1000); // Jeda 1 detik
    }

    // Mulai musik saat layar pembuka disentuh
    opener.addEventListener('click', () => {
        music.play().catch(error => console.log("Autoplay ditolak."));
        goToPanel(1); // Langsung pindah ke panel cerita pertama
    }, { once: true });

    // Event listener untuk scroll mouse (Desktop)
    window.addEventListener('wheel', event => {
        if (isScrolling) return;

        if (event.deltaY > 0) { // Scroll ke bawah
            goToPanel(currentPanelIndex + 1);
        } else { // Scroll ke atas
            goToPanel(currentPanelIndex - 1);
        }
    });

    // Event listener untuk swipe (Mobile)
    window.addEventListener('touchstart', event => {
        touchStartY = event.touches[0].clientY;
    });

    window.addEventListener('touchend', event => {
        if (isScrolling) return;
        const touchEndY = event.changedTouches[0].clientY;

        if (touchStartY - touchEndY > 50) { // Swipe ke atas (konten bergerak ke atas)
            goToPanel(currentPanelIndex + 1);
        } else if (touchEndY - touchStartY > 50) { // Swipe ke bawah
            goToPanel(currentPanelIndex - 1);
        }
    });

    // Inisialisasi awal
    document.getElementById('bg1').classList.add('active');


    // Fungsi Confetti (masih sama)
    function launchConfetti() {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 100 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    }
});
