// 8-bit Web Audio SFX + Web Speech API Pronunciation

class GameAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playTone(freq, duration, type = "square", volume = 0.08, delay = 0) {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  jump() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  coin() {
    this.playTone(987.77, 0.07, "square", 0.07, 0);
    this.playTone(1318.51, 0.18, "square", 0.07, 0.07);
  }

  correct() {
    this.playTone(523.25, 0.09, "square", 0.08, 0);
    this.playTone(659.25, 0.09, "square", 0.08, 0.09);
    this.playTone(783.99, 0.12, "square", 0.08, 0.18);
    this.playTone(1046.5, 0.22, "square", 0.08, 0.3);
  }

  wrong() {
    this.playTone(220, 0.14, "sawtooth", 0.08, 0);
    this.playTone(174.61, 0.25, "sawtooth", 0.08, 0.14);
  }

  hurt() {
    this.playTone(180, 0.1, "sawtooth", 0.09, 0);
    this.playTone(120, 0.18, "sawtooth", 0.09, 0.1);
  }

  stageClear() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    const times = [0, 0.1, 0.2, 0.3, 0.45, 0.58];
    notes.forEach((n, i) => {
      this.playTone(n, i === notes.length - 1 ? 0.4 : 0.1, "square", 0.08, times[i]);
    });
  }

  speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\.\.\./g, "").replace(/______/g, "blank");
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = "en-US";
    utter.rate = 0.88;
    window.speechSynthesis.speak(utter);
  }
}

window.gameAudio = new GameAudio();
