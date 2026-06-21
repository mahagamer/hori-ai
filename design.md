# Nova Agent - Mobile App Design

## Overview
Nova Agent is a voice-activated AI assistant app powered by Google Gemini 1.5 Flash. Users can activate the agent by tapping a button or saying "Hey Nova," and the app will listen to commands, process them through the Gemini AI model, and execute agentic tasks like opening apps, searching the web, answering questions, and providing information.

## Design Principles
- **Mobile Portrait Orientation (9:16)**: All screens designed for single-handed usage on portrait phones
- **Voice-First Interaction**: Large, accessible voice activation button as the primary UI element
- **iOS-Style Design**: Follows Apple Human Interface Guidelines (HIG) with clean, minimal aesthetics
- **Real-time Feedback**: Visual and haptic feedback for voice recording, processing, and results

## Screen List

### 1. **Home Screen (Main Agent Interface)**
- **Primary Content**: 
  - Large circular voice activation button (center-bottom)
  - Real-time transcription display (top)
  - Agent response text area (middle)
  - Conversation history list (scrollable)
- **Functionality**: 
  - Tap to activate voice recording
  - Visual waveform animation during recording
  - Display transcribed text in real-time
  - Show AI response with typing animation
  - Tap to interrupt/stop recording
  - Swipe to clear conversation

### 2. **Settings Screen**
- **Primary Content**:
  - API Key input (for Gemini API)
  - Voice language selection
  - Voice feedback toggle
  - Haptic feedback toggle
  - Clear conversation history button
  - About section with app version
- **Functionality**:
  - Securely store API key
  - Change voice recognition language
  - Enable/disable audio feedback
  - Enable/disable haptic feedback

### 3. **Conversation History Screen**
- **Primary Content**:
  - List of past conversations with timestamps
  - Search/filter conversations
  - Delete individual or all conversations
- **Functionality**:
  - Tap to view full conversation details
  - Swipe to delete
  - Search by keyword

## Key User Flows

### Flow 1: Voice Command Execution
1. User opens app → Home screen displays
2. User taps voice activation button → Microphone activates, waveform animation starts
3. User speaks command (e.g., "What's the weather?")
4. App transcribes speech in real-time
5. Gemini AI processes command and generates response
6. App displays response with typing animation
7. App optionally reads response aloud (if audio feedback enabled)
8. User can tap button again to ask follow-up question

### Flow 2: Settings Configuration
1. User taps Settings tab
2. User enters Gemini API key (stored securely)
3. User adjusts voice language, feedback preferences
4. Changes auto-save
5. User returns to Home screen

### Flow 3: View Conversation History
1. User taps History tab
2. List of past conversations appears
3. User taps conversation to view full exchange
4. User can delete conversation or return to list

## Color Choices (Brand Palette)

| Element | Light Mode | Dark Mode | Purpose |
|---------|-----------|-----------|---------|
| Primary (Accent) | `#0A7EA4` (Teal) | `#0A7EA4` (Teal) | Voice button, active states |
| Background | `#FFFFFF` | `#151718` (Dark Gray) | Screen background |
| Surface | `#F5F5F5` | `#1E2022` (Charcoal) | Cards, input fields |
| Foreground (Text) | `#11181C` (Dark Gray) | `#ECEDEE` (Light Gray) | Primary text |
| Muted (Secondary Text) | `#687076` (Gray) | `#9BA1A6` (Light Gray) | Secondary text, timestamps |
| Border | `#E5E7EB` (Light Gray) | `#334155` (Dark Gray) | Dividers, borders |
| Success | `#22C55E` | `#4ADE80` | Command success feedback |
| Error | `#EF4444` | `#F87171` | Error states |

## UI Components

### Voice Activation Button
- **Size**: 80px diameter (tappable area 44px minimum)
- **State**: 
  - Idle: Teal background with microphone icon
  - Recording: Animated waveform, pulsing background
  - Processing: Loading spinner
  - Ready: Checkmark with success color
- **Feedback**: Haptic pulse on tap, scale animation

### Transcription Display
- **Position**: Top of screen, scrollable text area
- **Style**: Monospace font, left-aligned, real-time update
- **Animation**: Fade in as text appears

### AI Response Area
- **Position**: Middle section, scrollable
- **Style**: Natural language text, left-aligned
- **Animation**: Typing effect, fade in

### Conversation History Item
- **Content**: User command + AI response + timestamp
- **Interaction**: Tap to expand, swipe to delete
- **Visual**: Subtle background color, divider between items

## Interaction Patterns

- **Press Feedback**: Voice button scales to 0.97 on press + haptic light impact
- **Loading States**: Spinner or animated dots while processing
- **Error Handling**: Toast notifications for API errors, retry button
- **Voice Waveform**: Real-time animated bars during recording
- **Typing Animation**: Smooth character-by-character reveal of AI response

## Accessibility
- Large touch targets (minimum 44x44 points)
- High contrast text (WCAG AA compliant)
- Voice feedback for all actions
- Clear visual indicators for recording/processing states
- Haptic feedback as alternative to audio cues
