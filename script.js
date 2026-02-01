// Simple Spotify mock - basic playback UI logic
(function () {
  const playPauseBtn = document.getElementById('playPause');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const progressFill = document.getElementById('progressFill');
  const progressBar = progressFill?.parentElement;
  const currentTimeEl = document.querySelector('.current-time');
  const totalTimeEl = document.querySelector('.total-time');
  const nowPlayingTitle = document.querySelector('.now-playing-title');
  const nowPlayingArtist = document.querySelector('.now-playing-artist');
  const volumeSlider = document.getElementById('volume');

  let isPlaying = false;
  let currentTrack = null;
  let progress = 0;
  let duration = 180; // 3:00 in seconds (mock)
  let progressInterval = null;

  const tracks = [
    'Blinding Lights', 'Shape of You', 'Levitating', 'Uptown Funk', 'bad guy', 'Someone Like You',
    'Flowers', 'Anti-Hero', 'Heat Waves',
    'Save Your Tears', 'Don\'t Start Now', 'Shake It Off', 'Leave The Door Open', 'Happier Than Ever', 'Easy On Me'
  ];
  const trackToArtist = {
    'Blinding Lights': 'The Weeknd', 'Shape of You': 'Ed Sheeran', 'Levitating': 'Dua Lipa',
    'Uptown Funk': 'Bruno Mars', 'bad guy': 'Billie Eilish', 'Someone Like You': 'Adele',
    'Flowers': 'Miley Cyrus', 'Anti-Hero': 'Taylor Swift', 'Heat Waves': 'Glass Animals',
    'Save Your Tears': 'The Weeknd', 'Don\'t Start Now': 'Dua Lipa', 'Shake It Off': 'Taylor Swift',
    'Leave The Door Open': 'Bruno Mars', 'Happier Than Ever': 'Billie Eilish', 'Easy On Me': 'Adele'
  };
  let currentTrackIndex = 0;

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function selectTrack(name, artist) {
    currentTrack = name;
    nowPlayingTitle.textContent = name;
    nowPlayingArtist.textContent = artist != null ? artist : (trackToArtist[name] || 'Artist');
    currentTrackIndex = tracks.indexOf(name);
    if (currentTrackIndex < 0) currentTrackIndex = 0;
    progress = 0;
    duration = 180;
    updateProgressUI();
    totalTimeEl.textContent = formatTime(duration);
  }

  function updateProgressUI() {
    const pct = duration ? (progress / duration) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
    if (currentTimeEl) currentTimeEl.textContent = formatTime(progress);
  }

  function tickProgress() {
    if (!isPlaying) return;
    progress += 1;
    if (progress >= duration) {
      progress = 0;
      nextTrack();
    }
    updateProgressUI();
  }

  function play() {
    if (!currentTrack) {
      selectTrack(tracks[0], trackToArtist[tracks[0]]);
    }
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
    playPauseBtn.title = 'Pause';
    progressInterval = setInterval(tickProgress, 1000);
  }

  function pause() {
    isPlaying = false;
    playPauseBtn.textContent = '▶';
    playPauseBtn.title = 'Play';
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  function togglePlayPause() {
    isPlaying ? pause() : play();
  }

  function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    const name = tracks[currentTrackIndex];
    selectTrack(name, trackToArtist[name]);
    if (isPlaying) {
      progress = 0;
      updateProgressUI();
    }
  }

  function prevTrack() {
    if (progress > 3) {
      progress = 0;
      updateProgressUI();
      return;
    }
    currentTrackIndex = currentTrackIndex - 1;
    if (currentTrackIndex < 0) currentTrackIndex = tracks.length - 1;
    const name = tracks[currentTrackIndex];
    selectTrack(name, trackToArtist[name]);
    progress = 0;
    updateProgressUI();
  }

  function seek(e) {
    if (!progressBar || !duration) return;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    progress = Math.floor(pct * duration);
    updateProgressUI();
  }

  // Click on cards, track rows, or recommendation cards to select and play
  document.querySelectorAll('.card, .track-row, .recommendation-card').forEach(function (el) {
    el.addEventListener('click', function () {
      const name = this.getAttribute('data-track') || this.querySelector('.track-title')?.textContent || this.querySelector('.recommendation-title')?.textContent;
      const artist = this.getAttribute('data-artist') || this.querySelector('.track-artist')?.textContent || this.querySelector('.recommendation-artist')?.textContent;
      if (name) {
        selectTrack(name.trim(), artist ? artist.trim() : null);
        play();
      }
    });
  });

  playPauseBtn?.addEventListener('click', togglePlayPause);
  prevBtn?.addEventListener('click', prevTrack);
  nextBtn?.addEventListener('click', nextTrack);

  progressBar?.addEventListener('click', seek);

  volumeSlider?.addEventListener('input', function () {
    const v = this.value;
    document.querySelector('.vol-icon').textContent = v == 0 ? '🔇' : v < 50 ? '🔉' : '🔊';
  });

  // Initial state
  totalTimeEl.textContent = formatTime(duration);
  updateProgressUI();
})();
