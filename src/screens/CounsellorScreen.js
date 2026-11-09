import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Linking, Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { counsellorTopics } from '../data';
import { createSession } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

// ── IMPORTANT: Set your Zoom link here ──────────────────────────────────────
const ZOOM_MEETING_LINK = 'https://zoom.us/j/YOUR_ZOOM_MEETING_ID';
// Replace YOUR_ZOOM_MEETING_ID with your actual Zoom meeting ID
// e.g. 'https://zoom.us/j/1234567890?pwd=abc123'
// ─────────────────────────────────────────────────────────────────────────────

const ProgressBar = ({ current }) => (
  <View style={styles.progressRow}>
    {[1, 2, 3, 4].map(i => (
      <View key={i} style={[styles.progressSeg, i <= current && styles.progressSegActive]} />
    ))}
  </View>
);

export default function CounsellorScreen({ navigation }) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({ firstName: '', lastName: '', studentId: '', email: '', pronoun: '' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [chatDesc, setChatDesc] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [riskAnswer, setRiskAnswer] = useState(null);
  const [errors, setErrors] = useState({});
  const [sessionCreated, setSessionCreated] = useState(false);

  const toggleTopic = t =>
    setSelectedTopics(p => (p.includes(t) ? p.filter(x => x !== t) : [...p, t]));

  const validateDetails = () => {
    const e = {};
    if (!details.firstName.trim()) e.firstName = 'Required';
    if (!details.lastName.trim()) e.lastName = 'Required';
    if (!details.studentId.trim()) e.studentId = 'Required';
    if (!details.email.trim() || !details.email.includes('@')) e.email = 'Valid email required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConnectCounsellor = async () => {
    try {
      await createSession(
        user?.uid,
        `${details.firstName} ${details.lastName}`,
        selectedTopics,
        chatDesc
      );
      setSessionCreated(true);
    } catch (e) {
      setSessionCreated(true); // Still proceed even if Firestore fails
    }
    setStep(5);
  };

  const openZoom = () => {
    if (ZOOM_MEETING_LINK.includes('YOUR_ZOOM_MEETING_ID')) {
      Alert.alert(
        '⚠️ Zoom Not Configured',
        'The Zoom meeting link has not been set up yet. Please contact your administrator.',
        [{ text: 'OK' }]
      );
      return;
    }
    Linking.openURL(ZOOM_MEETING_LINK).catch(() => {
      Alert.alert('Error', 'Could not open Zoom. Please make sure the Zoom app is installed.');
    });
  };

  const HeaderBar = ({ title, sub, step: s }) => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => (s === 0 ? navigation.goBack() : setStep(s - 1))} style={styles.backBtn}>
        <Text style={styles.backTxt}>← Back</Text>
      </TouchableOpacity>
      {s === 0 ? (
        <>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}><Text style={{ fontSize: 18 }}>🧠</Text></View>
            <Text style={styles.logoTxt}>Here2Help</Text>
          </View>
          <Text style={styles.headerBig}>Connect with us for virtual support 24/7.</Text>
          <Text style={styles.headerSub}>All calls, chats, and conversations with Here2Help are strictly confidential.</Text>
        </>
      ) : (
        <>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerStepSub}>{sub}</Text>
          <ProgressBar current={s} />
        </>
      )}
    </View>
  );

  // STEP 0 — LANDING
  if (step === 0) return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar step={0} />
        <View style={styles.crisiBanner}>
          <Text style={styles.crisisTxt}>⚠️  <Text style={{ fontWeight: '800' }}>If you are in crisis or anticipate immediate harm, please call 999 or your local emergency services now.</Text></Text>
        </View>
        <View style={styles.body}>
          <TouchableOpacity style={styles.serviceCard} onPress={() => setStep(1)} activeOpacity={0.85}>
            <View style={[styles.serviceHeader, { backgroundColor: colors.tealPrimary }]}>
              <Text style={styles.serviceHeaderTxt}>💬  Chat with Counsellor</Text>
            </View>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceDesc}>Connect with a counsellor via Zoom video call for immediate support.</Text>
              <Text style={styles.serviceArrow}>›</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.serviceCard}>
            <View style={[styles.serviceHeader, { backgroundColor: colors.darkBg }]}>
              <Text style={styles.serviceHeaderTxt}>📞  Call Support</Text>
            </View>
            <View style={styles.callBody}>
              <Text style={styles.serviceDesc}>Speak to an agent for immediate support.</Text>
              {[
                { label: 'Kenya Emergency Services', num: '999' },
                { label: 'Mental Health Helpline', num: '0800 720 990' },
                { label: 'Suicide Prevention Kenya', num: '0722 178 177' },
              ].map(item => (
                <TouchableOpacity
                  key={item.num}
                  style={styles.callRow}
                  onPress={() => Linking.openURL(`tel:${item.num.replace(/\s/g, '')}`)}
                >
                  <View>
                    <Text style={styles.callLabel}>{item.label}</Text>
                    <Text style={styles.callNum}>{item.num}</Text>
                  </View>
                  <Text style={styles.serviceArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  // STEP 1 — DETAILS
  if (step === 1) return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar title="Your Details" sub="Step 1 of 4 — Personal Information" step={1} />
        <View style={styles.body}>
          <View style={styles.formCard}>
            {[
              { key: 'firstName', label: 'First Name', placeholder: 'Enter your first name' },
              { key: 'lastName', label: 'Last Name', placeholder: 'Enter your last name' },
              { key: 'studentId', label: 'Student ID', placeholder: 'e.g. S12345678' },
              { key: 'email', label: 'Email Address', placeholder: 'your@university.edu' },
            ].map(f => (
              <View key={f.key} style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>{f.label}</Text>
                <TextInput
                  style={[styles.fieldInput, errors[f.key] && styles.fieldInputError]}
                  value={details[f.key]}
                  onChangeText={v => setDetails({ ...details, [f.key]: v })}
                  placeholder={f.placeholder}
                  placeholderTextColor="#aaa"
                />
                {errors[f.key] && <Text style={styles.errorTxt}>{errors[f.key]}</Text>}
              </View>
            ))}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Preferred Pronoun (optional)</Text>
            <View style={styles.pronounRow}>
              {['She/Her', 'He/Him', 'They/Them', 'Prefer not to say'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.pronounBtn, details.pronoun === p && styles.pronounBtnActive]}
                  onPress={() => setDetails({ ...details, pronoun: details.pronoun === p ? '' : p })}
                >
                  <Text style={[styles.pronounTxt, details.pronoun === p && styles.pronounTxtActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => validateDetails() && setStep(2)}>
            <Text style={styles.primaryBtnTxt}>Continue →</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  // STEP 2 — TERMS
  if (step === 2) return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar title="Terms of Use" sub="Step 2 of 4 — Please read carefully" step={2} />
        <View style={styles.body}>
          <View style={[styles.formCard, { maxHeight: 340 }]}>
            <ScrollView nestedScrollEnabled>
              {[
                { title: '🔒 Confidentiality', body: 'All conversations with counsellors are strictly confidential. Your personal information will not be shared without your explicit consent, except where required by law.' },
                { title: '⚖️ Limits of Confidentiality', body: 'Confidentiality may be broken if there is a risk of harm to yourself or others, if a child is in danger, or if required by a court order.' },
                { title: '🔕 Service Availability', body: 'This service is available to enrolled students. Counsellors are available 24/7 and aim to respond within 5 minutes.' },
                { title: '✅ Appropriate Use', body: 'This platform is intended for mental health support. Abusive or threatening language will result in session termination.' },
                { title: '💾 Data Storage', body: 'Session transcripts may be stored securely for quality assurance. Your identity will be anonymised in any review.' },
                { title: '🆘 Not an Emergency Service', body: 'If you are in immediate danger, please call 999 or your local emergency services.' },
              ].map(s => (
                <View key={s.title} style={styles.termSection}>
                  <Text style={styles.termTitle}>{s.title}</Text>
                  <Text style={styles.termBody}>{s.body}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <TouchableOpacity style={styles.checkRow} onPress={() => setTermsAccepted(t => !t)}>
            <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>
              {termsAccepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>I have read and agree to the Terms of Use and understand the limits of confidentiality.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryBtn, !termsAccepted && styles.primaryBtnDisabled]}
            onPress={() => termsAccepted && setStep(3)}
          >
            <Text style={styles.primaryBtnTxt}>Accept & Continue →</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  // STEP 3 — DESCRIPTION
  if (step === 3) return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar title="What's on your mind?" sub="Step 3 of 4 — Help us prepare for your session" step={3} />
        <View style={styles.body}>
          <View style={styles.formCard}>
            <Text style={styles.formInfo}>Briefly describe what you'd like to talk about. This helps your counsellor be better prepared to support you.</Text>
            <Text style={styles.fieldLabel}>Select a topic (optional)</Text>
            <View style={styles.topicWrap}>
              {counsellorTopics.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.topicBtn, selectedTopics.includes(t) && styles.topicBtnActive]}
                  onPress={() => toggleTopic(t)}
                >
                  <Text style={[styles.topicTxt, selectedTopics.includes(t) && styles.topicTxtActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Add more details</Text>
            <TextInput
              style={[styles.fieldInput, styles.textarea]}
              value={chatDesc}
              onChangeText={v => setChatDesc(v.slice(0, 500))}
              placeholder="Describe what's been going on for you lately..."
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{chatDesc.length}/500</Text>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep(4)}>
            <Text style={styles.primaryBtnTxt}>Continue →</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  // STEP 4 — RISK
  if (step === 4) return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar title="Safety Check" sub="Step 4 of 4 — We ask everyone this question" step={4} />
        <View style={styles.body}>
          <View style={styles.formCard}>
            <Text style={styles.shieldEmoji}>🛡️</Text>
            <Text style={styles.riskQuestion}>Are you currently having thoughts of harming yourself or others?</Text>
            <Text style={styles.riskSub}>We ask this of everyone to ensure you get the right level of support.</Text>
            <TouchableOpacity
              style={[styles.riskBtn, riskAnswer === 'yes' && styles.riskBtnYes]}
              onPress={() => setRiskAnswer('yes')}
            >
              <Text style={[styles.riskBtnTxt, riskAnswer === 'yes' && styles.riskBtnTxtYes]}>Yes, I am having these thoughts</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.riskBtn, riskAnswer === 'no' && styles.riskBtnNo]}
              onPress={() => setRiskAnswer('no')}
            >
              <Text style={[styles.riskBtnTxt, riskAnswer === 'no' && styles.riskBtnTxtNo]}>No, I am not having these thoughts</Text>
            </TouchableOpacity>
          </View>
          {riskAnswer === 'yes' && (
            <View style={styles.crisisCard}>
              <Text style={styles.crisisTitle}>🆘 You are not alone — help is here</Text>
              <Text style={styles.crisisBody}>We're connecting you with a crisis counsellor. Please also consider calling a crisis line for immediate help.</Text>
              <TouchableOpacity style={styles.crisisCallBtn} onPress={() => Linking.openURL('tel:0722178177')}>
                <Text style={styles.crisisCallTxt}>📞 Crisis Line: 0722 178 177</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.errorDark, marginTop: 10 }]} onPress={handleConnectCounsellor}>
                <Text style={styles.primaryBtnTxt}>Connect with Crisis Counsellor →</Text>
              </TouchableOpacity>
            </View>
          )}
          {riskAnswer === 'no' && (
            <TouchableOpacity style={styles.primaryBtn} onPress={handleConnectCounsellor}>
              <Text style={styles.primaryBtnTxt}>Connect with a Counsellor →</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  // STEP 5 — QUEUED + ZOOM
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.queuedScreen}>
        <View style={styles.queuedCircle}><Text style={{ fontSize: 44 }}>💬</Text></View>
        <Text style={styles.queuedTitle}>You're in the queue!</Text>
        <Text style={styles.queuedSub}>A counsellor will be with you shortly.</Text>
        <View style={styles.waitBadge}><Text style={styles.waitTxt}>⏱  Estimated wait: ~3 minutes</Text></View>

        {/* Zoom Button */}
        <View style={styles.zoomCard}>
          <Text style={styles.zoomTitle}>📹 Join Your Session</Text>
          <Text style={styles.zoomSub}>When your counsellor is ready, join the video call on Zoom.</Text>
          <TouchableOpacity style={styles.zoomBtn} onPress={openZoom}>
            <Text style={styles.zoomBtnTxt}>🎥  Open Zoom Meeting</Text>
          </TouchableOpacity>
          <Text style={styles.zoomNote}>Make sure you have the Zoom app installed on your phone.</Text>
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>While you wait…</Text>
          {[
            'Try box breathing: inhale 4, hold 4, exhale 4, hold 4.',
            'You can browse self-help articles in the Explore tab.',
            'Reaching out is the bravest first step — well done.',
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipTxt}>{tip}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.backHomeBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backHomeTxt}>Back to Home</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgColor },
  header: { backgroundColor: colors.darkBg, paddingHorizontal: 22, paddingTop: 16, paddingBottom: 24 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 14 },
  backTxt: { color: colors.tealPrimary, fontWeight: '700', fontSize: 14 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  logoIcon: { width: 36, height: 36, backgroundColor: colors.tealPrimary, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoTxt: { color: '#fff', fontWeight: '900', fontSize: 20 },
  headerBig: { color: '#fff', fontSize: 24, fontWeight: '800', lineHeight: 32 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 21, marginTop: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 14, marginBottom: 4 },
  headerStepSub: { color: 'rgba(255,255,255,0.65)', fontSize: 13 },
  progressRow: { flexDirection: 'row', gap: 6, marginTop: 14 },
  progressSeg: { flex: 1, height: 4, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)' },
  progressSegActive: { backgroundColor: colors.tealPrimary },
  crisiBanner: { backgroundColor: '#FFF3E0', borderLeftWidth: 4, borderLeftColor: '#FB8C00', marginHorizontal: 16, marginTop: 20, borderRadius: 14, padding: 16 },
  crisisTxt: { fontSize: 14, color: '#7B4100', lineHeight: 21 },
  body: { padding: 16 },
  serviceCard: { backgroundColor: colors.white, borderRadius: 18, overflow: 'hidden', marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6 },
  serviceHeader: { paddingHorizontal: 18, paddingVertical: 14 },
  serviceHeaderTxt: { color: '#fff', fontWeight: '800', fontSize: 17 },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  serviceDesc: { color: '#555', fontSize: 15, lineHeight: 22, flex: 1 },
  serviceArrow: { color: '#ccc', fontSize: 24, marginLeft: 12 },
  callBody: { padding: 16 },
  callRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  callLabel: { color: '#999', fontSize: 12 },
  callNum: { color: colors.darkBg, fontWeight: '800', fontSize: 17 },
  formCard: { backgroundColor: colors.white, borderRadius: 18, padding: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 },
  fieldWrap: { marginTop: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#555' },
  fieldInput: { borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 14, padding: 13, fontSize: 15, marginTop: 6, color: colors.darkBg },
  fieldInputError: { borderColor: colors.error },
  errorTxt: { color: colors.error, fontSize: 12, marginTop: 4 },
  pronounRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  pronounBtn: { backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  pronounBtnActive: { backgroundColor: colors.tealPrimary },
  pronounTxt: { color: '#555', fontWeight: '700', fontSize: 13 },
  pronounTxtActive: { color: '#fff' },
  primaryBtn: { backgroundColor: colors.tealPrimary, borderRadius: 16, padding: 16, alignItems: 'center', marginTop: 20 },
  primaryBtnDisabled: { backgroundColor: '#ccc' },
  primaryBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 18, backgroundColor: colors.white, borderRadius: 14, padding: 16, elevation: 1 },
  checkbox: { width: 26, height: 26, borderRadius: 7, borderWidth: 2, borderColor: '#ddd', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  checkboxActive: { backgroundColor: colors.tealPrimary, borderColor: colors.tealPrimary },
  checkmark: { color: '#fff', fontSize: 15, fontWeight: '900' },
  checkLabel: { flex: 1, fontSize: 14, color: '#444', lineHeight: 21 },
  termSection: { marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  termTitle: { fontWeight: '800', color: colors.darkBg, fontSize: 15, marginBottom: 6 },
  termBody: { color: '#666', fontSize: 14, lineHeight: 22 },
  formInfo: { color: '#555', fontSize: 15, lineHeight: 22, marginBottom: 16 },
  topicWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  topicBtn: { backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  topicBtnActive: { backgroundColor: colors.tealLight, borderWidth: 2, borderColor: colors.tealPrimary },
  topicTxt: { color: '#555', fontWeight: '700', fontSize: 13 },
  topicTxtActive: { color: colors.tealDark },
  textarea: { minHeight: 110, textAlignVertical: 'top' },
  charCount: { color: '#bbb', fontSize: 12, textAlign: 'right', marginTop: 4 },
  shieldEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 18 },
  riskQuestion: { color: colors.darkBg, fontSize: 17, fontWeight: '800', textAlign: 'center', lineHeight: 26, marginBottom: 8 },
  riskSub: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  riskBtn: { padding: 16, borderRadius: 14, borderWidth: 2, borderColor: '#eee', marginBottom: 12, backgroundColor: '#fff' },
  riskBtnYes: { borderColor: colors.error, backgroundColor: colors.errorLight },
  riskBtnNo: { borderColor: colors.tealPrimary, backgroundColor: colors.tealLight },
  riskBtnTxt: { fontWeight: '800', fontSize: 16, textAlign: 'center', color: '#444' },
  riskBtnTxtYes: { color: colors.errorDark },
  riskBtnTxtNo: { color: colors.tealDark },
  crisisCard: { backgroundColor: colors.errorLight, borderRadius: 16, padding: 20, marginTop: 16, borderWidth: 1, borderColor: '#FFCDD2' },
  crisisTitle: { fontWeight: '800', color: colors.errorDark, fontSize: 16, marginBottom: 10 },
  crisisBody: { color: '#7B1818', fontSize: 14, lineHeight: 22, marginBottom: 16 },
  crisisCallBtn: { backgroundColor: colors.error, borderRadius: 12, padding: 13, alignItems: 'center', marginBottom: 4 },
  crisisCallTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
  queuedScreen: { alignItems: 'center', padding: 24, paddingTop: 40 },
  queuedCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: colors.tealLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  queuedTitle: { fontSize: 26, fontWeight: '800', color: colors.darkBg, marginBottom: 8 },
  queuedSub: { color: '#666', fontSize: 16, lineHeight: 24, marginBottom: 6 },
  waitBadge: { backgroundColor: colors.tealLight, borderRadius: 20, paddingHorizontal: 22, paddingVertical: 8, marginBottom: 24 },
  waitTxt: { color: colors.tealDark, fontWeight: '800', fontSize: 15 },
  zoomCard: { backgroundColor: '#E3F2FD', borderRadius: 20, padding: 22, width: '100%', marginBottom: 16, borderWidth: 1, borderColor: '#90CAF9' },
  zoomTitle: { fontWeight: '800', color: '#0D47A1', fontSize: 17, marginBottom: 8 },
  zoomSub: { color: '#1565C0', fontSize: 14, lineHeight: 21, marginBottom: 16 },
  zoomBtn: { backgroundColor: '#1976D2', borderRadius: 14, padding: 16, alignItems: 'center', elevation: 3 },
  zoomBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  zoomNote: { color: '#5C7A9A', fontSize: 12, textAlign: 'center', marginTop: 10 },
  tipsCard: { backgroundColor: colors.white, borderRadius: 20, padding: 20, width: '100%', marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6 },
  tipsTitle: { fontWeight: '800', color: colors.darkBg, marginBottom: 14, fontSize: 15 },
  tipRow: { flexDirection: 'row', gap: 10, marginBottom: 12, alignItems: 'flex-start' },
  tipBullet: { color: colors.tealPrimary, fontWeight: '900', fontSize: 16 },
  tipTxt: { color: '#555', fontSize: 14, lineHeight: 21, flex: 1 },
  backHomeBtn: { backgroundColor: '#f0f0f0', borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  backHomeTxt: { color: '#555', fontWeight: '700', fontSize: 15 },
});
