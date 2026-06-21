/**
 * Hori Text-to-Speech Service
 * Handles voice output with Hori's personality voice
 */

import * as Speech from "expo-speech";
import {
  getHoriVoiceSettings,
  getHoriVoiceSettingsForContext,
} from "./hori-voice-config";

export type HoriSpeechContext = "caring" | "playful" | "serious" | "encouraging" | "default";

interface HoriTTSOptions {
  onStart?: () => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
}

export class HoriTextToSpeechService {
  private options: HoriTTSOptions = {};
  private isSpeaking = false;

  constructor(options: HoriTTSOptions = {}) {
    this.options = options;
  }

  /**
   * Speak text with Hori's voice
   */
  async speak(
    text: string,
    context: HoriSpeechContext = "default"
  ): Promise<void> {
    if (this.isSpeaking) {
      console.warn("Hori is already speaking");
      return;
    }

    try {
      this.isSpeaking = true;
      this.options.onStart?.();

      // Get voice settings based on context
      const voiceSettings =
        context === "default"
          ? getHoriVoiceSettings()
          : getHoriVoiceSettingsForContext(context as Exclude<HoriSpeechContext, "default">);

      // Speak the text with Hori's voice
      await Speech.speak(text, {
        language: voiceSettings.language,
        pitch: voiceSettings.pitch,
        rate: voiceSettings.rate,
        volume: voiceSettings.volume,
        onDone: () => {
          this.isSpeaking = false;
          this.options.onDone?.();
        },
        onError: (error: any) => {
          this.isSpeaking = false;
          const err = new Error(`Speech error: ${error?.error || error}`);
          this.options.onError?.(err);
        },
      });
    } catch (error) {
      this.isSpeaking = false;
      const err = error instanceof Error ? error : new Error(String(error));
      this.options.onError?.(err);
      throw err;
    }
  }

  /**
   * Stop speaking
   */
  async stop(): Promise<void> {
    try {
      await Speech.stop();
      this.isSpeaking = false;
    } catch (error) {
      console.error("Error stopping speech:", error);
    }
  }

  /**
   * Check if currently speaking
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Speak a caring response (softer, gentler voice)
   */
  async speakCaring(text: string): Promise<void> {
    return this.speak(text, "caring");
  }

  /**
   * Speak a playful response (higher pitch, faster)
   */
  async speakPlayful(text: string): Promise<void> {
    return this.speak(text, "playful");
  }

  /**
   * Speak a serious response (lower pitch, slower)
   */
  async speakSerious(text: string): Promise<void> {
    return this.speak(text, "serious");
  }

  /**
   * Speak an encouraging response (warm, confident)
   */
  async speakEncouraging(text: string): Promise<void> {
    return this.speak(text, "encouraging");
  }
}

// Singleton instance
let ttsService: HoriTextToSpeechService | null = null;

export function getHoriTTSService(options?: HoriTTSOptions): HoriTextToSpeechService {
  if (!ttsService) {
    ttsService = new HoriTextToSpeechService(options);
  }
  return ttsService;
}
