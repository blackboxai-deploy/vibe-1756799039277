import { SoundType } from '@/types/pomodoro';

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private oscillatorCache: Map<SoundType, AudioBuffer> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      // Initialize on first user interaction to avoid browser blocking
      this.initializeAudioContext();
    }
  }

  private initializeAudioContext() {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async createTone(frequency: number, duration: number = 0.3): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const time = i / sampleRate;
      // Create a bell-like sound with envelope
      const envelope = Math.exp(-time * 5); // Decay envelope
      data[i] = Math.sin(2 * Math.PI * frequency * time) * envelope * 0.3;
    }

    return buffer;
  }

  private async generateSoundBuffer(soundType: SoundType): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    switch (soundType) {
      case 'bell':
        return this.createTone(800, 0.5);
      case 'chime':
        // Create a chord-like chime sound
        const sampleRate = this.audioContext.sampleRate;
        const duration = 0.8;
        const length = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
          const time = i / sampleRate;
          const envelope = Math.exp(-time * 3);
          // Combine multiple frequencies for chime effect
          const note1 = Math.sin(2 * Math.PI * 523.25 * time); // C5
          const note2 = Math.sin(2 * Math.PI * 659.25 * time); // E5
          const note3 = Math.sin(2 * Math.PI * 783.99 * time); // G5
          data[i] = (note1 + note2 + note3) * envelope * 0.15;
        }
        return buffer;
      case 'beep':
        return this.createTone(440, 0.2);
      default:
        return this.createTone(800, 0.3);
    }
  }

  async playNotification(soundType: SoundType, volume: number = 0.5): Promise<void> {
    if (!this.audioContext) {
      this.initializeAudioContext();
      if (!this.audioContext) {
        console.warn('Cannot play audio: AudioContext not available');
        return;
      }
    }

    // Resume audio context if suspended (browser policy)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    try {
      // Get or create sound buffer
      let buffer = this.oscillatorCache.get(soundType);
      if (!buffer) {
        buffer = await this.generateSoundBuffer(soundType);
        this.oscillatorCache.set(soundType, buffer);
      }

      // Create and connect audio nodes
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = Math.max(0, Math.min(1, volume));

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Play the sound
      source.start();
    } catch (error) {
      console.error('Failed to play notification sound:', error);
      
      // Fallback to simple beep using oscillator
      try {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
      } catch (fallbackError) {
        console.error('Fallback audio also failed:', fallbackError);
      }
    }
  }

  // Browser notification API
  async showNotification(title: string, body: string, icon?: string): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        tag: 'pomodoro-timer',
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(title, {
          body,
          icon: icon || '/favicon.ico',
          tag: 'pomodoro-timer',
        });
      }
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Initialize audio context on user interaction
  initializeOnUserInteraction() {
    if (this.audioContext) return;

    const initAudio = () => {
      this.initializeAudioContext();
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // Remove listeners after first interaction
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
  }
}

// Singleton instance
export const audioManager = new AudioManager();