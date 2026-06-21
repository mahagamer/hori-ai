import { ScrollView, Text, View, Pressable, ActivityIndicator } from "react-native";
import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/use-colors";
import { createHoriPrompt } from "@/lib/hori-personality";
import { getHoriTTSService } from "@/lib/hori-tts-service";

interface Message {
  id: string;
  type: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export default function HomeScreen() {
  const colors = useColors();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiKey, setApiKey] = useState<string>("");
  const scrollViewRef = useRef<ScrollView>(null);

  // Load API key from storage on mount
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const key = await AsyncStorage.getItem("gemini_api_key");
        if (key) {
          setApiKey(key);
        }
      } catch (error) {
        console.error("Error loading API key:", error);
      }
    };
    loadApiKey();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const startListening = async () => {
    if (!apiKey) {
      alert("Please set your Gemini API key in Settings first");
      return;
    }

    try {
      setIsListening(true);
      setTranscription("");
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // For now, we'll use a placeholder for speech recognition
      // In a real implementation, you'd use expo-speech-recognition or similar
      // This is a mock implementation
      setTranscription("Listening... (mock)");

      // Simulate listening for 2 seconds
      setTimeout(() => {
        setIsListening(false);
        setTranscription("What's the weather today?");
        processCommand("What's the weather today?");
      }, 2000);
    } catch (error) {
      console.error("Error starting listening:", error);
      setIsListening(false);
      alert("Error starting voice recognition");
    }
  };

  const processCommand = async (command: string) => {
    if (!command.trim()) return;

    try {
      setIsProcessing(true);

      // Add user message to conversation
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        text: command,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setTranscription("");

      // Call Gemini 2.0 Flash-Lite API with Hori's personality
      const horiPrompt = createHoriPrompt(command);
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: horiPrompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const assistantText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that request.";

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        text: assistantText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Speak the response with Hori's voice
      try {
        const ttsService = getHoriTTSService();
        // Determine context based on response content
        let context: "caring" | "playful" | "serious" | "encouraging" | "default" = "default";
        const lowerText = assistantText.toLowerCase();
        if (lowerText.includes("help") || lowerText.includes("support") || lowerText.includes("care")) {
          context = "caring";
        } else if (lowerText.includes("haha") || lowerText.includes("lol") || lowerText.includes("fun")) {
          context = "playful";
        } else if (lowerText.includes("important") || lowerText.includes("must") || lowerText.includes("serious")) {
          context = "serious";
        } else if (lowerText.includes("great") || lowerText.includes("awesome") || lowerText.includes("wonderful")) {
          context = "encouraging";
        }
        await ttsService.speak(assistantText, context);
      } catch (ttsError) {
        console.warn("TTS error:", ttsError);
        // Continue even if TTS fails
      }
    } catch (error) {
      console.error("Error processing command:", error);
      alert("Error processing your request. Check your API key.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceButtonPress = async () => {
    if (isListening) {
      setIsListening(false);
    } else {
      await startListening();
    }
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <View className="flex-1 flex-col">
        {/* Header */}
        <View className="px-6 py-4 border-b border-border">
          <Text className="text-3xl font-bold text-foreground">Hori</Text>
          <Text className="text-sm text-muted mt-1">Your caring AI companion</Text>
        </View>

        {/* Conversation Area */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
        >
          {messages.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-lg text-muted text-center">
                Tap the microphone button below to start talking with Hori
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {messages.map((message) => (
                <View
                  key={message.id}
                  className={cn(
                    "max-w-xs rounded-lg px-4 py-3",
                    message.type === "user"
                      ? "self-end bg-primary"
                      : "self-start bg-surface border border-border"
                  )}
                >
                  <Text
                    className={cn(
                      "text-base leading-relaxed",
                      message.type === "user"
                        ? "text-background"
                        : "text-foreground"
                    )}
                  >
                    {message.text}
                  </Text>
                  <Text
                    className={cn(
                      "text-xs mt-1",
                      message.type === "user"
                        ? "text-background opacity-70"
                        : "text-muted"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Transcription Display */}
        {transcription && (
          <View className="px-4 py-3 bg-surface border-t border-border">
            <Text className="text-sm text-foreground italic">{transcription}</Text>
          </View>
        )}

        {/* Voice Button */}
        <View className="px-6 py-6 items-center justify-center">
          <Pressable
            onPress={handleVoiceButtonPress}
            disabled={isProcessing}
            style={({ pressed }) => [
              {
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: isProcessing ? 0.6 : 1,
              },
            ]}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color={colors.background} />
            ) : (
              <Text className="text-4xl">
                {isListening ? "🔴" : "🎤"}
              </Text>
            )}
          </Pressable>

          {isListening && (
            <Text className="text-sm text-muted mt-3">Listening...</Text>
          )}
          {isProcessing && (
            <Text className="text-sm text-muted mt-3">Processing...</Text>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
