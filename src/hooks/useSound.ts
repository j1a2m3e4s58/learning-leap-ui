import { useState, useEffect, useCallback } from 'react';
import { Howl } from 'howler';

const SOUND_URLS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  fail: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  bgm: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3'
};

export function useSound() {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('edu-muted') === 'true';
  });

  const [sounds, setSounds] = useState<Record<string, Howl>>({});

  useEffect(() => {
    const newSounds: Record<string, Howl> = {
      click: new Howl({ src: [SOUND_URLS.click], volume: 0.5 }),
      win: new Howl({ src: [SOUND_URLS.win], volume: 0.5 }),
      fail: new Howl({ src: [SOUND_URLS.fail], volume: 0.5 }),
      bgm: new Howl({ 
        src: [SOUND_URLS.bgm], 
        volume: 0.2, 
        loop: true,
        html5: true // Better for long tracks
      })
    };

    setSounds(newSounds);

    if (!isMuted) {
      newSounds.bgm.play();
    }

    return () => {
      Object.values(newSounds).forEach(s => s.unload());
    };
  }, []);

  useEffect(() => {
    if (sounds.bgm) {
      if (isMuted) {
        sounds.bgm.pause();
      } else {
        if (!sounds.bgm.playing()) {
          sounds.bgm.play();
        }
      }
    }
    localStorage.setItem('edu-muted', String(isMuted));
  }, [isMuted, sounds.bgm]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const playSound = useCallback((key: keyof typeof SOUND_URLS) => {
    if (!isMuted && sounds[key]) {
      sounds[key].play();
    }
  }, [isMuted, sounds]);

  return { isMuted, toggleMute, playSound };
}