/**
 * Hori Voice Configuration
 * Configures text-to-speech to sound like Hori from Horimiya
 * - Softer, caring tone
 * - Slightly higher pitch (female voice)
 * - Moderate speaking speed
 * - Warm and approachable
 */

export interface HoriVoiceSettings {
  language: string;
  pitch: number; // 0.5 to 2.0 (1.0 is normal)
  rate: number; // 0.5 to 2.0 (1.0 is normal)
  volume: number; // 0 to 1
  voiceId?: string; // Platform-specific voice identifier
}

/**
 * Default voice settings for Hori
 * Optimized for iOS and Android
 */
export const HORI_VOICE_SETTINGS: HoriVoiceSettings = {
  language: "en-US",
  pitch: 1.2, // Slightly higher pitch for feminine voice
  rate: 0.9, // Slightly slower for clarity and warmth
  volume: 1.0,
};

/**
 * Platform-specific voice configurations
 */
export const PLATFORM_VOICES = {
  ios: {
    // iOS voice options that sound warm and caring
    default: "com.apple.ttsbundle.Samantha-compact", // Samantha - warm female voice
    alternative: "com.apple.ttsbundle.Victoria-compact", // Victoria - friendly female voice
  },
  android: {
    // Android voice options
    default: "en-US-Neural2-C", // Google Neural voice (female)
    alternative: "en-US-Neural2-E", // Alternative female voice
  },
};

/**
 * Get the best voice for the current platform
 */
export function getHoriVoiceId(): string | undefined {
  // This would be determined at runtime based on the platform
  // For now, return undefined to use system default
  return undefined;
}

/**
 * Get Hori's voice settings
 */
export function getHoriVoiceSettings(): HoriVoiceSettings {
  return { ...HORI_VOICE_SETTINGS };
}

/**
 * Adjust voice settings for different emotions/contexts
 */
export function getHoriVoiceSettingsForContext(
  context: "caring" | "playful" | "serious" | "encouraging"
): HoriVoiceSettings {
  const baseSettings = getHoriVoiceSettings();

  switch (context) {
    case "caring":
      // Softer, slower, more gentle
      return {
        ...baseSettings,
        pitch: 1.1,
        rate: 0.85,
      };
    case "playful":
      // Slightly higher pitch, faster
      return {
        ...baseSettings,
        pitch: 1.3,
        rate: 1.0,
      };
    case "serious":
      // Lower pitch, slower, more deliberate
      return {
        ...baseSettings,
        pitch: 1.0,
        rate: 0.8,
      };
    case "encouraging":
      // Warm, confident, moderate speed
      return {
        ...baseSettings,
        pitch: 1.15,
        rate: 0.95,
      };
    default:
      return baseSettings;
  }
}

/**
 * Voice quality presets
 */
export const VOICE_QUALITY_PRESETS = {
  natural: {
    description: "Natural, warm voice",
    settings: getHoriVoiceSettings(),
  },
  soft: {
    description: "Soft and gentle",
    settings: getHoriVoiceSettingsForContext("caring"),
  },
  energetic: {
    description: "Energetic and playful",
    settings: getHoriVoiceSettingsForContext("playful"),
  },
  professional: {
    description: "Professional and clear",
    settings: getHoriVoiceSettingsForContext("serious"),
  },
};
