import { ScrollView, Text, View, Pressable, TextInput, Switch, Alert } from "react-native";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function SettingsScreen() {
  const colors = useColors();
  const [apiKey, setApiKey] = useState("");
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const key = await AsyncStorage.getItem("gemini_api_key");
        const audio = await AsyncStorage.getItem("audio_feedback");
        const haptic = await AsyncStorage.getItem("haptic_feedback");

        if (key) setApiKey(key);
        if (audio !== null) setAudioFeedback(audio === "true");
        if (haptic !== null) setHapticFeedback(haptic === "true");
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async () => {
    if (!apiKey.trim()) {
      Alert.alert("Error", "Please enter a valid API key");
      return;
    }

    try {
      setIsSaving(true);
      await AsyncStorage.setItem("gemini_api_key", apiKey);
      await AsyncStorage.setItem("audio_feedback", audioFeedback.toString());
      await AsyncStorage.setItem("haptic_feedback", hapticFeedback.toString());

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const clearHistory = async () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all conversation history?",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("conversation_history");
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("Success", "Conversation history cleared");
            } catch (error) {
              console.error("Error clearing history:", error);
              Alert.alert("Error", "Failed to clear history");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="px-6 py-4 border-b border-border">
          <Text className="text-3xl font-bold text-foreground">Settings</Text>
        </View>

        {/* API Key Section */}
        <View className="px-6 py-6 gap-4">
          <Text className="text-lg font-semibold text-foreground">API Configuration</Text>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Google Gemini API Key</Text>
            <TextInput
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Enter your Gemini API key"
              placeholderTextColor={colors.muted}
              secureTextEntry
              editable={!isSaving}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{
                color: colors.foreground,
              }}
            />
            <Text className="text-xs text-muted">
              Get your free API key from{" "}
              <Text className="font-semibold">console.cloud.google.com</Text>
            </Text>
          </View>
        </View>

        {/* Preferences Section */}
        <View className="px-6 py-6 gap-4 border-t border-border">
          <Text className="text-lg font-semibold text-foreground">Preferences</Text>

          {/* Audio Feedback */}
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-1">
              <Text className="text-base font-medium text-foreground">Audio Feedback</Text>
              <Text className="text-sm text-muted">Read responses aloud</Text>
            </View>
            <Switch
              value={audioFeedback}
              onValueChange={setAudioFeedback}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={audioFeedback ? colors.primary : colors.surface}
              disabled={isSaving}
            />
          </View>

          {/* Haptic Feedback */}
          <View className="flex-row items-center justify-between py-3 border-t border-border">
            <View className="flex-1">
              <Text className="text-base font-medium text-foreground">Haptic Feedback</Text>
              <Text className="text-sm text-muted">Vibration on interactions</Text>
            </View>
            <Switch
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={hapticFeedback ? colors.primary : colors.surface}
              disabled={isSaving}
            />
          </View>
        </View>

        {/* Data Management Section */}
        <View className="px-6 py-6 gap-4 border-t border-border">
          <Text className="text-lg font-semibold text-foreground">Data Management</Text>

          <Pressable
            onPress={clearHistory}
            disabled={isSaving}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View className="bg-surface border border-error rounded-lg px-4 py-3">
              <Text className="text-base font-medium text-error">Clear Conversation History</Text>
              <Text className="text-sm text-muted mt-1">
                Delete all stored conversations
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Save Button */}
        <View className="px-6 py-6">
          <Pressable
            onPress={saveSettings}
            disabled={isSaving}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="rounded-lg px-6 py-4 items-center justify-center"
          >
            <Text className="text-base font-semibold text-background">
              {isSaving ? "Saving..." : "Save Settings"}
            </Text>
          </Pressable>
        </View>

        {/* About Section */}
        <View className="px-6 py-6 border-t border-border">
          <Text className="text-sm text-muted text-center">
            Nova Agent v1.0.0{"\n"}
            Powered by Google Gemini 1.5 Flash
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
