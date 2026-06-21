# 🎤 Hori - Voice-Activated AI Assistant

Hori is a mobile app inspired by the character Hori from the anime **Horimiya**. It's a voice-powered AI assistant that listens to your commands and responds with Hori's caring, supportive personality.

## ✨ Features

- **Voice Activation** - Tap the microphone button to talk with Hori
- **AI Powered** - Uses Google Gemini 2.0 Flash-Lite for intelligent responses
- **Personality-Driven** - Hori responds with caring, playful, serious, or encouraging tones
- **Text-to-Speech** - Hear Hori's voice respond to your queries
- **Conversation History** - View and manage past conversations
- **Dark Mode Support** - Beautiful UI with dark/light theme
- **Anime-Inspired Design** - Custom branding with Hori's character aesthetic

## 📱 Download & Installation

### **Option 1: Download Source Code (ZIP)**
1. Go to: https://github.com/mahagamer/hori-ai
2. Click **Code** → **Download ZIP**
3. Extract the folder
4. Install dependencies: `npm install` or `pnpm install`
5. Run: `npm start` or `pnpm dev`

### **Option 2: Build APK for Android**

#### Prerequisites:
- Node.js (v16+)
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`

#### Steps:
```bash
# 1. Clone the repository
git clone https://github.com/mahagamer/hori-ai.git
cd hori-ai

# 2. Install dependencies
pnpm install

# 3. Login to Expo
eas login

# 4. Build APK
eas build --platform android --local

# 5. Download the APK file and install on your Android phone
```

### **Option 3: Test with Expo Go**
1. Download **Expo Go** app on your phone
2. Clone the repo and run: `npm start`
3. Scan the QR code with Expo Go
4. App loads instantly!

## 🔧 Configuration

### Set Your Gemini API Key
1. Get a free API key from: https://aistudio.google.com/app/apikey
2. Open the app → Settings tab
3. Enter your API key
4. Start chatting with Hori!

## 📋 Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **AI**: Google Gemini 2.0 Flash-Lite API
- **Voice**: expo-speech (Text-to-Speech)
- **Storage**: AsyncStorage (Local persistence)

## 🎨 Project Structure

```
hori-ai/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home screen with voice button
│   │   ├── settings.tsx       # Settings & API configuration
│   │   └── history.tsx        # Conversation history
│   └── _layout.tsx            # Root layout
├── lib/
│   ├── hori-personality.ts    # Hori's personality system prompt
│   ├── hori-voice-config.ts   # Voice settings & configuration
│   ├── hori-tts-service.ts    # Text-to-speech service
│   └── speech-recognition-service.ts  # Wake word detection
├── components/
│   ├── screen-container.tsx   # SafeArea wrapper
│   └── ui/                    # UI components
├── assets/
│   └── images/                # App icons & branding
└── app.config.ts              # Expo configuration
```

## 🚀 Building for Production

### Android (APK)
```bash
eas build --platform android
```

### iOS (IPA)
```bash
eas build --platform ios
```

### Web
```bash
pnpm dev
```

## 📝 Usage

1. **Open the app** and tap the microphone button
2. **Speak your command** (e.g., "Hey Hori, what's the weather?")
3. **Hori responds** with her caring personality
4. **Listen to her voice** respond to your query
5. **View history** in the History tab

## ⚙️ Troubleshooting

### App won't start
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `pnpm install`
- Clear cache: `pnpm store prune`

### Voice not working
- Check microphone permissions
- Ensure API key is set in Settings
- Restart the app

### API errors
- Verify your Gemini API key is valid
- Check internet connection
- Ensure API key has proper scopes

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to fork, modify, and improve Hori! Submit pull requests with your enhancements.

## 📧 Support

For issues or questions, please open an issue on GitHub: https://github.com/mahagamer/hori-ai/issues

---

**Made with ❤️ for Horimiya fans everywhere**

Hori v1.1 - Voice-Activated AI Assistant
