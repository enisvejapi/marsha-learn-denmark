'use client';
import { useCallback, useRef, useState } from 'react';

export function useAudio() {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text: string, rate = 0.85) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'da-DK';
    utter.rate = rate;
    // prefer a Danish voice
    const voices = window.speechSynthesis.getVoices();
    const danishVoice = voices.find(v =>
      v.lang === 'da-DK' || v.name.toLowerCase().includes('danish') || v.name.includes('Sara') || v.name.includes('Helle')
    );
    if (danishVoice) utter.voice = danishVoice;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
}

type RecognitionState = 'idle' | 'requesting' | 'listening' | 'done' | 'denied' | 'error';

export function useSpeechRecognition() {
  const [state, setState] = useState<RecognitionState>('idle');
  const [transcript, setTranscript] = useState('');
  const recogRef = useRef<any>(null);

  const start = useCallback((onResult: (text: string) => void) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setState('error'); return; }
    setState('requesting');
    const recog = new SR();
    recog.lang = 'da-DK';
    recog.continuous = false;
    recog.interimResults = false;
    recog.onstart = () => setState('listening');
    recog.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setState('done');
      onResult(text);
    };
    recog.onerror = (e: any) => {
      if (e.error === 'not-allowed') setState('denied');
      else setState('error');
    };
    recog.onend = () => {
      if (state === 'listening') setState('idle');
    };
    recogRef.current = recog;
    recog.start();
  }, [state]);

  const reset = useCallback(() => {
    recogRef.current?.stop();
    setState('idle');
    setTranscript('');
  }, []);

  return { state, transcript, start, reset };
}
