import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';

// Do not put a production API key in a mobile app bundle. Call your own backend instead.
const ANTHROPIC_API_KEY = '';

const SYSTEM_PROMPT = `You are a compassionate mental health support companion for university students called "Here2Help". 

YOUR ROLE:
- Provide empathetic, evidence-based mental health support
- Focus ONLY on mental health, emotional wellbeing, and student wellness topics
- Help students understand conditions like depression, anxiety, BPD, PTSD, OCD, eating disorders, grief, loneliness, stress, burnout, homesickness, relationship issues, and academic pressure
- Offer coping strategies, psychoeducation, and emotional validation
- Respond to the specific details in each message; do not reuse a fixed opening or generic fallback when the service succeeds
- Give one thoughtful, natural response at a time (usually 3-6 sentences): validate the feeling, explain a relevant wellbeing concept in plain language when useful, offer one manageable next step, then ask one gentle follow-up question
- Vary your wording and approach to fit the person. For example:
  * For "I'm feeling sad and depressed": validate that sadness can feel heavy; explain that low mood can affect energy, sleep, and concentration without diagnosing; suggest one small supportive action and invite them to share how long this has been going on
  * For anxiety: acknowledge the worry, briefly explain the body's stress response, and offer a grounding or slow-breathing exercise
  * For academic stress: recognize the pressure, explain how overload can affect focus, and help identify one small next task or a source of support
  * For loneliness: validate the disconnection, avoid minimizing it, and explore one low-pressure way to connect with someone
  * For feeling overwhelmed: help make the moment feel more manageable by focusing on one immediate need rather than giving a long list of advice
- Avoid presenting these examples as scripts; tailor each reply to the user's words and conversation history

STRICT RULES:
- ONLY discuss mental health, emotional wellbeing, student life stress, and related topics
- If asked about ANYTHING unrelated (homework help, coding, recipes, sports, politics, news, math, etc.), respond with: "I'm here specifically to support your mental health and emotional wellbeing. I'm not able to help with that topic, but I'd love to chat about how you're feeling or anything on your mind emotionally."
- Never provide medical diagnoses
- Never prescribe medications
- Always encourage professional help for serious concerns

CRISIS PROTOCOL:
- If a student mentions suicidal thoughts, self-harm, or immediate danger, always:
  1. Validate their feelings with compassion
  2. Encourage them to call emergency services (999/911) or a crisis line immediately
  3. Remind them that Here2Help counsellors are available 24/7
  4. Stay calm and supportive

TONE: Warm, non-judgmental, hopeful, professional but approachable. Use inclusive language.`;

const INITIAL_MESSAGE = {
  id: '0',
  role: 'assistant',
  text: "Hi there 👋 I'm Here2Help — your mental wellness companion. I'm here to listen and support you with anything on your mind emotionally. How are you feeling today?",
};

export default function AIChatScreen({ navigation }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    const userMsg = { id: Date.now().toString(), role: 'user', text: userText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      if (!ANTHROPIC_API_KEY) {
        throw new Error('AI service is not configured. Add a secure backend endpoint before enabling chat.');
      }

      // Build message history for  API
      const apiMessages = newMessages
        .filter(m => m.id !== '0') // exclude initial greeting
        .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || `AI service returned HTTP ${response.status}`);
      }
      const replyText = data.content
        ?.filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n\n')
        .trim();
      if (!replyText) throw new Error('AI service returned an empty response.');

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: replyText,
      }]);
    } catch (e) {
      console.warn('AI chat request failed:', e.message);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: "I couldn't get a reply from the AI service just now. Please try again in a moment. If this keeps happening, the chat service may need to be configured by the app team. If you're in crisis, contact emergency services or a crisis line in your area.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.msgRow, item.role === 'user' ? styles.msgRowUser : styles.msgRowAssist]}>
      {item.role === 'assistant' && (
        <View style={styles.avatar}><Text style={{ fontSize: 16 }}>🤖</Text></View>
      )}
      <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAssist]}>
        <Text style={[styles.bubbleTxt, item.role === 'user' && styles.bubbleTxtUser]}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.avatar}><Text style={{ fontSize: 20 }}>🤖</Text></View>
          <View>
            <Text style={styles.headerTitle}>AI Wellness Companion</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineTxt}>Mental health support only</Text>
            </View>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            loading ? (
              <View style={styles.msgRowAssist}>
                <View style={styles.avatar}><Text style={{ fontSize: 16 }}>🤖</Text></View>
                <View style={styles.bubbleAssist}>
                  <ActivityIndicator size="small" color={colors.tealPrimary} />
                </View>
              </View>
            ) : null
          }
        />

        {/* Crisis banner */}
        <View style={styles.crisisBanner}>
          <Text style={styles.crisisTxt}>🆘 In crisis? Call 999 or speak to a counsellor</Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="How are you feeling today?"
            placeholderTextColor="#aaa"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendTxt}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: colors.tealPrimary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 18 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 14 },
  backTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.tealLight, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#69F0AE' },
  onlineTxt: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  list: { padding: 16, gap: 14 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowAssist: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '75%', borderRadius: 18, padding: 13 },
  bubbleUser: { backgroundColor: colors.tealPrimary, borderBottomRightRadius: 4 },
  bubbleAssist: { backgroundColor: '#F2F2F2', borderBottomLeftRadius: 4, minWidth: 60, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  bubbleTxt: { fontSize: 15, lineHeight: 22, color: '#333' },
  bubbleTxtUser: { color: '#fff' },
  crisisBanner: { backgroundColor: '#FFF3E0', paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#FFE0B2' },
  crisisTxt: { color: '#E65100', fontSize: 12, fontWeight: '700', textAlign: 'center' },
  inputRow: { flexDirection: 'row', gap: 10, padding: 12, paddingBottom: 24, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'flex-end' },
  input: { flex: 1, borderWidth: 2, borderColor: colors.border, borderRadius: 24, paddingHorizontal: 18, paddingVertical: 12, fontSize: 15, maxHeight: 100, color: colors.darkBg },
  sendBtn: { backgroundColor: colors.tealPrimary, borderRadius: 24, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: '#ccc' },
  sendTxt: { color: '#fff', fontSize: 18 },
});
