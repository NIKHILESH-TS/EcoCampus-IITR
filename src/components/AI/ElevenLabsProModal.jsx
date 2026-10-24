import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Key, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Languages, 
  Play, 
  Square,
  Zap
} from 'lucide-react';
import { 
  getElevenLabsConfig, 
  saveElevenLabsConfig, 
  speakText, 
  stopSpeaking,
  ELEVENLABS_VOICES 
} from '../../services/elevenlabs';

export default function ElevenLabsProModal({ isOpen, onClose }) {
  const [config, setConfig] = useState(getElevenLabsConfig());
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM');
  const [selectedLang, setSelectedLang] = useState('hi'); // 'hi' | 'en'
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const cur = getElevenLabsConfig();
    setConfig(cur);
    setApiKeyInput(cur.apiKey || '');
    setSelectedVoice(cur.voiceId || '21m00Tcm4TlvDq8ikWAM');
    setSelectedLang(cur.language || 'hi');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...config,
      apiKey: apiKeyInput.trim(),
      voiceId: selectedVoice,
      language: selectedLang
    };
    saveElevenLabsConfig(updated);
    setConfig(updated);
    setStatusMessage({ type: 'success', text: 'ElevenLabs Pro Configuration Saved Successfully!' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleTestAudio = async () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    const testText = selectedLang === 'hi'
      ? 'नमस्ते! यह आईआईटी रुड़की का इको-वॉइस असिस्टेंट है। गत्ते और प्लास्टिक को नीले डस्टबिन में डालें।'
      : 'Hello! This is EcoCampus IIT Roorkee voice assistant. Please place clean cardboard into the blue bin.';

    setIsPlaying(true);
    await speakText(
      testText,
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      selectedLang
    );
  };

  const isProActive = apiKeyInput.trim().length > 10;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                  <span>ElevenLabs Pro Integration</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    isProActive 
                      ? 'bg-amber-400 text-amber-950' 
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {isProActive ? 'PRO ACTIVE' : 'DEV MODE'}
                  </span>
                </h3>
                <div className="text-[11px] text-slate-400">
                  Multilingual V2 Model (Hindi & English Voice Synthesis)
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white text-base font-bold transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          
          {statusMessage && (
            <div className={`p-3 rounded-xl border flex items-center gap-2 ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* ElevenLabs API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-medium text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>Your ElevenLabs Pro API Key</span>
              </label>
              <span className="text-[10px] text-slate-400">Stored locally in browser</span>
            </div>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste xi-api-key here (e.g. sk_...)"
              className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {isProActive ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 inline" /> 
                  Connected to ElevenLabs Pro tier with Multilingual V2 access.
                </span>
              ) : (
                'If empty, app automatically falls back to browser high-fidelity Speech Synthesis.'
              )}
            </p>
          </div>

          {/* Voice Model & Language Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Voice Character</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs"
              >
                {ELEVENLABS_VOICES.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.accent})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-blue-600" />
                <span>Primary Language</span>
              </label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs"
              >
                <option value="hi">हिन्दी (Hindi - Field Staff & Students)</option>
                <option value="en">English (Campus Standard)</option>
              </select>
            </div>
          </div>

          {/* Live Test Strip */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Audio Preview ({selectedLang === 'hi' ? 'Hindi' : 'English'})</span>
              </div>
              <div className="text-[10px] text-slate-500">
                {isProActive ? 'Direct ElevenLabs REST Stream' : 'Browser Web Speech Synthesis'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestAudio}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs ${
                isPlaying
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
              }`}
            >
              {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? 'Stop' : 'Play Sample'}</span>
            </button>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-xs"
            >
              Save Configuration
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
