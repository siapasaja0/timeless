document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('background-music');
    const opener = document.querySelector('.opener');
    const storyPanels = document.querySelectorAll('.story-panel');
    const backgroundImages = document.querySelectorAll('.bg-image');
    let currentBgId = 'bg1';

    // Inisialisasi: tampilkan gambar pertama
    document.getElementById('bg1').classList.add('active');
    
    // Mulai musik saat layar pembuka disentuh
    opener.addEventListener('click', () => {
        music.play().catch(error => console.log("Autoplay ditolak. Perlu interaksi."));
        opener.parentElement.style.opacity = '0'; // Sembunyikan pesan pembuka
        setTimeout(() => {
            opener.parentElement.style.display = 'none';
        }, 1000);
    }, { once: true }); // Hanya jalankan sekali

    // Observer untuk animasi saat scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Tambah class untuk animasi teks
                entry.target.classList.add('is-visible');

                // Ganti gambar latar belakang
                const newBgId = entry.target.dataset.bg;
                if (newBgId && newBgId !== currentBgId) {
                    document.getElementById(currentBgId).classList.remove('active');
                    document.getElementById(newBgId).classList.add('active');
                    currentBgId = newBgId;
                }
                
                // Jika panel terakhir, jalankan confetti
                if (entry.target.classList.contains('final-panel')) {
                    launchConfetti();
                }
            }
        });
    }, {
        threshold: 0.6 // Memicu saat 60% panel terlihat
    });

    storyPanels.forEach(panel => {
        observer.observe(panel);
    });

    // Fungsi Confetti
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
