import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function VoiceGuideButton({ text, label = "Listen to Disposal Guide" }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert("Voice guidance requires a browser that supports Web Speech API.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        isPlaying 
          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse shadow-sm'
          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
      }`}
      title="Powered by ElevenLabs & Web Speech AI"
    >
      {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-700" />}
      <span>{isPlaying ? 'Speaking (Click to Stop)' : label}</span>
      <span className="flex items-center text-[10px] bg-emerald-200/60 text-emerald-900 px-1.5 py-0.5 rounded-full font-mono">
        <Sparkles className="w-2.5 h-2.5 mr-0.5 text-amber-600" /> AI Voice
      </span>
    </button>
  );
}
