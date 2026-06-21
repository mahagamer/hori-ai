/**
 * Speech Recognition Service with Wake Word Detection
 * Listens for "Hori" wake word and triggers voice input
 */

import * as Audio from "expo-audio";

interface SpeechRecognitionOptions {
  onWakeWordDetected?: () => void;
  onTranscriptionUpdate?: (text: string) => void;
  onError?: (error: string) => void;
  onListeningStart?: () => void;
  onListeningStop?: () => void;
}

export class HoriSpeechRecognitionService {
  private isListening = false;
  private recognitionActive = false;
  private options: SpeechRecognitionOptions = {};
  private wakeWordThreshold = 0.7; // Confidence threshold for wake word detection

  constructor(options: SpeechRecognitionOptions = {}) {
    this.options = options;
  }

  /**
   * Initialize audio permissions and setup
   */
  async initialize(): Promise<void> {
    try {
      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.options.onError?.(errorMessage);
      throw error;
    }
  }

  /**
   * Start continuous listening for wake word "Hori"
   */
  async startListening(): Promise<void> {
    if (this.isListening) {
      return;
    }

    try {
      this.isListening = true;
      this.recognitionActive = true;
      this.options.onListeningStart?.();

      // Simulate continuous listening with wake word detection
      // In a real implementation, this would use expo-speech-recognition
      // For now, we'll use a mock implementation that simulates wake word detection
      await this.mockContinuousListening();
    } catch (error) {
      this.isListening = false;
      this.recognitionActive = false;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.options.onError?.(errorMessage);
    }
  }

  /**
   * Stop listening
   */
  stopListening(): void {
    this.isListening = false;
    this.recognitionActive = false;
    this.options.onListeningStop?.();
  }

  /**
   * Check if a transcription contains the wake word "Hori"
   */
  private detectWakeWord(transcription: string): boolean {
    const lowerTranscription = transcription.toLowerCase().trim();
    
    // Check for exact match or variations of "Hori"
    const wakeWordPatterns = [
      /\bhori\b/i,
      /hey\s+hori/i,
      /hori\s+ai/i,
      /\bhori\s+chan\b/i,
    ];

    return wakeWordPatterns.some((pattern) => pattern.test(lowerTranscription));
  }

  /**
   * Mock continuous listening simulation
   * This demonstrates the wake word detection flow
   */
  private async mockContinuousListening(): Promise<void> {
    // This is a mock implementation for demonstration
    // In production, you would integrate with expo-speech-recognition
    // or a native speech recognition library

    // Simulate listening for voice input
    console.log("🎤 Hori is listening for wake word...");

    // Example: Simulate detecting wake word after user says "Hori"
    // In real implementation, this would be triggered by actual speech recognition
    setTimeout(() => {
      if (this.recognitionActive) {
        const mockTranscription = "Hori, what's the weather?";
        this.options.onTranscriptionUpdate?.(mockTranscription);

        if (this.detectWakeWord(mockTranscription)) {
          console.log("✨ Wake word 'Hori' detected!");
          this.options.onWakeWordDetected?.();
        }
      }
    }, 2000);
  }

  /**
   * Process transcription and detect wake word
   * Call this method when you receive transcription from speech recognition
   */
  processTranscription(transcription: string): void {
    this.options.onTranscriptionUpdate?.(transcription);

    if (this.detectWakeWord(transcription)) {
      console.log("✨ Wake word detected:", transcription);
      this.options.onWakeWordDetected?.();
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Set wake word detection confidence threshold
   */
  setWakeWordThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new Error("Threshold must be between 0 and 1");
    }
    this.wakeWordThreshold = threshold;
  }
}

// Singleton instance
let speechRecognitionService: HoriSpeechRecognitionService | null = null;

export function getSpeechRecognitionService(
  options?: SpeechRecognitionOptions
): HoriSpeechRecognitionService {
  if (!speechRecognitionService) {
    speechRecognitionService = new HoriSpeechRecognitionService(options);
  }
  return speechRecognitionService;
}
