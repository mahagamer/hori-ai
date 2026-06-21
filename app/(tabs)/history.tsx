import { ScrollView, Text, View, Pressable, FlatList, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface ConversationItem {
  id: string;
  userMessage: string;
  assistantMessage: string;
  timestamp: Date;
}

export default function HistoryScreen() {
  const colors = useColors();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load conversations when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadConversations();
    }, [])
  );

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem("conversation_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = (id: string) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const updated = conversations.filter((c) => c.id !== id);
              setConversations(updated);
              await AsyncStorage.setItem("conversation_history", JSON.stringify(updated));
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error("Error deleting conversation:", error);
              Alert.alert("Error", "Failed to delete conversation");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderConversation = ({ item }: { item: ConversationItem }) => (
    <View className="bg-surface border border-border rounded-lg p-4 mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-xs text-muted flex-1">
          {new Date(item.timestamp).toLocaleString()}
        </Text>
        <Pressable
          onPress={() => deleteConversation(item.id)}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text className="text-lg text-error">✕</Text>
        </Pressable>
      </View>

      <View className="gap-2">
        <View className="bg-primary rounded-lg px-3 py-2">
          <Text className="text-sm text-background font-medium">You:</Text>
          <Text className="text-sm text-background mt-1">{item.userMessage}</Text>
        </View>

        <View className="bg-background border border-border rounded-lg px-3 py-2">
          <Text className="text-sm text-foreground font-medium">Nova:</Text>
          <Text className="text-sm text-foreground mt-1 line-clamp-3">
            {item.assistantMessage}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border">
        <Text className="text-3xl font-bold text-foreground">Hori's Memory</Text>
        <Text className="text-sm text-muted mt-1">
          {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Conversations List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">Loading...</Text>
        </View>
      ) : conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg text-muted text-center">
            No conversations yet. Start chatting with Hori to see your memories here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          scrollEnabled
        />
      )}
    </ScreenContainer>
  );
}


