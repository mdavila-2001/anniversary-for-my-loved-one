// --- Lógica para el botón de Pantalla Completa ---
document.addEventListener('DOMContentLoaded', () => {
    const fullscreenManager = {
        toggleBtn: document.getElementById('toggle-fullscreen'),
        iconElement: document.getElementById('fullscreen-icon'),
        isFullscreen: function() {
            return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        },
        updateIcon: function() {
            if (!this.iconElement) return;
            if (this.isFullscreen()) {
                this.iconElement.classList.remove('fa-expand');
                this.iconElement.classList.add('fa-compress');
            } else {
                this.iconElement.classList.remove('fa-compress');
                this.iconElement.classList.add('fa-expand');
            }
        },
        toggle: function() {
            if (!this.isFullscreen()) {
                const element = document.documentElement;
                if (element.requestFullscreen) element.requestFullscreen();
                else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
                else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
                else if (element.msRequestFullscreen) element.msRequestFullscreen();
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
            }
        },
        init: function() {
            if (this.toggleBtn) {
                this.toggleBtn.addEventListener('click', () => this.toggle());
                document.addEventListener('fullscreenchange', () => this.updateIcon());
                document.addEventListener('webkitfullscreenchange', () => this.updateIcon());
                document.addEventListener('mozfullscreenchange', () => this.updateIcon());
                document.addEventListener('MSFullscreenChange', () => this.updateIcon());
            }
        }
    };
    fullscreenManager.init();

    // --- Inicia la lógica de la letra sincronizada ---
    setupSynchronizedLyrics();
});


// --- Lógica para los controles de Música ---
function setupMusicControls() {
    const music = document.getElementById("backgroundMusic");
    const musicBtn = document.getElementById("musicBtn");
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");
    const volumeSlider = document.getElementById("volumeSlider");
    const volumeControl = document.getElementById("volumeControl");

    if (!music || !musicBtn || !volumeSlider || !volumeControl) return;

    music.volume = volumeSlider.value;

    function toggleMusic() {
        if (music.paused) {
            music.play().then(() => {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }).catch(error => console.log("La reproducción automática fue bloqueada."));
        } else {
            music.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
    });
    
    // Intenta reproducir la música al cargar
    music.play().then(() => {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }).catch(() => {
        // Si falla, espera a que el usuario haga clic en cualquier lugar para empezar
        const startMusicOnClick = () => {
            toggleMusic();
            document.body.removeEventListener('click', startMusicOnClick);
        };
        document.body.addEventListener('click', startMusicOnClick);
    });

    let hideVolumeTimeout = null;
    musicBtn.addEventListener('mouseover', () => {
        clearTimeout(hideVolumeTimeout);
        volumeControl.classList.add('visible');
    });
    musicBtn.addEventListener('mouseout', () => {
        hideVolumeTimeout = setTimeout(() => volumeControl.classList.remove('visible'), 2000);
    });
    volumeControl.addEventListener('mouseover', () => clearTimeout(hideVolumeTimeout));
    volumeControl.addEventListener('mouseout', () => {
        hideVolumeTimeout = setTimeout(() => volumeControl.classList.remove('visible'), 2000);
    });
    volumeSlider.addEventListener('input', (e) => music.volume = e.target.value);
}

// --- Nueva Función para la Letra Sincronizada ---
function setupSynchronizedLyrics() {
    const lyricsContainer = document.getElementById('lyrics-container');
    const music = document.getElementById('backgroundMusic');

    if (!lyricsContainer || !music) return;

    const lyricsData = [
        { time: 19, line: "Now come, let me be your light." },
        { time: 24, line: "There's a truth we can't defy;" },
        { time: 27, line: "somehow, this time you won't deny it." },
        { time: 34, line: "What got lost inside, I have found it now." },
        { time: 39, line: "There's a reason why..." },
        { time: 44, line: "I will love you endlessly," },
        { time: 50, line: "and even if I cry, I'll be there by your side for a lifetime." },
        { time: 61, line: "And I will love you endlessly," },
        { time: 67, line: "and even when we die, you'll be there by my side..." },
        { time: 76, line: "endlessly." },
        { time: 84, line: "So come, let me be your life after all these sleepless nights." },
        { time: 91, line: "Somehow, I know my strength will guide you" },
        { time: 99, line: "through the darkest times," },
        { time: 101, line: "now that I have found all the reasons why..." },
        { time: 108, line: "I will love you endlessly," },
        { time: 114, line: "and even if we cry, I'll be there by your side for a lifetime." },
        { time: 126, line: "And I will love you endlessly," },
        { time: 132, line: "and even when we die, you'll be there by my side..." },
        { time: 141, line: "endlessly." },
        { time: 148, line: "You know me well. Somehow, I'm under your spell." },
        { time: 156, line: "I want you to see me, and share every moment with you," },
        { time: 161, line: "'cause I..." },
        { time: 180, line: "I will love you endlessly," },
        { time: 186, line: "and even if we cry, I'll be there by your side for a lifetime." },
        { time: 198, line: "And I will love you endlessly," },
        { time: 204, line: "and even when we die, you'll be there by my side..." },
        { time: 213, line: "endlessly." },
    ];

    let currentLineIndex = -1;

    // Función reutilizable para actualizar la línea activa
    function updateActiveLine() {
        const currentTime = music.currentTime;
        const activeLineIndex = lyricsData.findIndex((line, index) => {
            const nextLine = lyricsData[index + 1];
            return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
        });

        if (activeLineIndex !== -1 && activeLineIndex !== currentLineIndex) {
            lyricsContainer.textContent = lyricsData[activeLineIndex].line;
            lyricsContainer.classList.remove('hint');
            lyricsContainer.classList.add('visible');
            currentLineIndex = activeLineIndex;
        } else if (activeLineIndex === -1 && currentLineIndex !== -1) {
            // Oculta la letra si no hay ninguna línea activa (en los silencios)
            lyricsContainer.classList.remove('visible');
            currentLineIndex = -1;
        }
    }

    // Muestra un mensaje guía si la música no está reproduciéndose
    if (music.paused) {
        lyricsContainer.textContent = 'Pulsa ▶ para comenzar la música y ver la letra';
        lyricsContainer.classList.add('hint');
        lyricsContainer.classList.add('visible');
    }

    // Eventos para actualizar letra
    music.addEventListener('timeupdate', updateActiveLine);
    music.addEventListener('play', () => {
        // forzar actualización inmediata al reproducir
        updateActiveLine();
        lyricsContainer.classList.remove('hint');
    });
    music.addEventListener('pause', () => {
        // mostrar pista para reanudar
        lyricsContainer.textContent = 'Pulsa ▶ para reanudar la música y ver la letra';
        lyricsContainer.classList.add('hint');
        // mantener visible la pista
        lyricsContainer.classList.add('visible');
    });

    // Oculta la letra cuando la canción termina
    music.addEventListener('ended', () => {
        lyricsContainer.classList.remove('visible');
    });
}

// Llama a la función de los controles de música para que se inicien
setupMusicControls();