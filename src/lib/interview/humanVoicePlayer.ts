/**
 * Realistic Human Voice Player for Gemini 2.0 Flash Audio
 * Converts Gemini 2.0 PCM/MP3 base64 audio data into Web Audio API buffers for crystal-clear playback.
 */

let activeAudioSource: AudioBufferSourceNode | null = null;
let activeAudioContext: AudioContext | null = null;

export async function playGeminiHumanVoice(
  base64Data: string,
  mimeType: string = "audio/pcm;rate=24000",
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  try {
    stopGeminiHumanVoice();

    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    activeAudioContext = new AudioCtx();

    if (activeAudioContext.state === "suspended") {
      await activeAudioContext.resume();
    }

    // Check if PCM raw 24kHz audio or standard MP3/WAV
    if (mimeType.includes("pcm")) {
      const pcm16 = new Int16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2);
      const sampleRate = 24000;
      const buffer = activeAudioContext.createBuffer(1, pcm16.length, sampleRate);
      const channelData = buffer.getChannelData(0);

      for (let i = 0; i < pcm16.length; i++) {
        channelData[i] = pcm16[i] / 32768.0;
      }

      const source = activeAudioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(activeAudioContext.destination);

      source.onended = () => {
        if (onEnd) onEnd();
        activeAudioSource = null;
      };

      activeAudioSource = source;
      if (onStart) onStart();
      source.start(0);
    } else {
      // Standard MP3/WAV decoding
      const decodedBuffer = await activeAudioContext.decodeAudioData(bytes.buffer);
      const source = activeAudioContext.createBufferSource();
      source.buffer = decodedBuffer;
      source.connect(activeAudioContext.destination);

      source.onended = () => {
        if (onEnd) onEnd();
        activeAudioSource = null;
      };

      activeAudioSource = source;
      if (onStart) onStart();
      source.start(0);
    }
  } catch (err) {
    console.warn("Human audio playback notice:", err);
    if (onEnd) onEnd();
  }
}

export function stopGeminiHumanVoice(): void {
  if (activeAudioSource) {
    try {
      activeAudioSource.stop();
      activeAudioSource.disconnect();
    } catch {}
    activeAudioSource = null;
  }
  if (activeAudioContext) {
    try {
      activeAudioContext.close();
    } catch {}
    activeAudioContext = null;
  }
}
