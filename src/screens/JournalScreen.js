import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { journalPrompts } from '../data';

const PIN_KEY = 'h2h_journal_pin';
const ENTRIES_KEY = 'h2h_journal_entries';

export default function JournalScreen({ navigation }) {
  const [pinState, setPinState] = useState('loading'); // loading | set | locked | open
  const [savedPin, setSavedPin] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [entries, setEntries] = useState([]);
  const [view, setView] = useState('list'); // list | write | read
  const [current, setCurrent] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [usedPrompt, setUsedPrompt] = useState(null);

  useEffect(() => {
    (async () => {
      const pin = await AsyncStorage.getItem(PIN_KEY);
      const stored = await AsyncStorage.getItem(ENTRIES_KEY);
      if (stored) setEntries(JSON.parse(stored));
      if (pin) { setSavedPin(pin); setPinState('locked'); }
      else setPinState('set');
    })();
  }, []);

  const saveEntries = async list => {
    setEntries(list);
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(list));
  };

  const handlePinDigit = async d => {
    if (d === '⌫') {
      setPinInput(current => current.slice(0, -1));
      setPinError('');
      return;
    }

    const next = pinInput + d;
    if (next.length > 4) return;

    setPinInput(next);
    if (next.length !== 4) {
      setPinError('');
      return;
    }

    if (pinState === 'set') {
      await AsyncStorage.setItem(PIN_KEY, next);
      setSavedPin(next);
      setPinState('open');
      setPinInput('');
      setPinError('');
      return;
    }

    const storedPin = await AsyncStorage.getItem(PIN_KEY);
    if (next === storedPin) {
      setPinState('open');
      setPinInput('');
      setPinError('');
      return;
    }

    setPinError('Incorrect PIN. Try again.');
    setPinInput('');
  };

  const deleteEntry = id => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { saveEntries(entries.filter(e => e.id !== id)); setView('list'); setCurrent(null); } },
    ]);
  };

  const saveEntry = async () => {
    if (!body.trim()) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    if (current) {
      const updated = entries.map(e => e.id === current.id ? { ...e, title: title || dateStr, body, updated: `${dateStr} ${timeStr}` } : e);
      await saveEntries(updated);
    } else {
      const entry = { id: Date.now().toString(), title: title || dateStr, body, date: dateStr, time: timeStr };
      await saveEntries([entry, ...entries]);
    }
    setView('list'); setTitle(''); setBody(''); setCurrent(null); setUsedPrompt(null);
  };

  // LOADING
  if (pinState === 'loading') return <SafeAreaView style={styles.safe} />;

  // PIN SCREEN
  if (pinState === 'set' || pinState === 'locked') {
    const pinDigits = ['1','2','3','4','5','6','7','8','9','','0','⌫'];
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.darkBg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.pinBack}>
          <Text style={styles.pinBackTxt}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.pinCenter}>
          <Text style={styles.pinLockIcon}>🔒</Text>
          <Text style={styles.pinTitle}>
            {pinState === 'set' ? 'Create Your Journal PIN' : 'Enter Your PIN'}
          </Text>
          <Text style={styles.pinSub}>
            {pinState === 'set'
              ? 'Your journal is private. Set a 4-digit PIN to protect your entries.'
              : 'Enter your 4-digit PIN to access your journal.'}
          </Text>
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={[styles.dot, pinInput.length > i && styles.dotFilled]} />
            ))}
          </View>
          {pinError ? <Text style={styles.pinError}>{pinError}</Text> : null}
          <View style={styles.keypad}>
            {pinDigits.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.key, d === '' && styles.keyEmpty]}
                onPress={() => {
                  if (d !== '') handlePinDigit(d);
                }}
                disabled={d === ''}
              >
                <Text style={styles.keyTxt}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // WRITE VIEW
  if (view === 'write') {
    const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.writeHeader}>
          <TouchableOpacity onPress={() => { setView('list'); setTitle(''); setBody(''); setCurrent(null); setUsedPrompt(null); }}>
            <Text style={styles.writeBack}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.writeTitle}>{current ? 'Edit Entry' : 'New Entry'}</Text>
          <Text style={styles.writeSub}>
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>
        <ScrollView style={styles.writeBody} keyboardShouldPersistTaps="handled">
          {!current && !usedPrompt && (
            <TouchableOpacity style={styles.promptCard} onPress={() => setUsedPrompt(randomPrompt)}>
              <Text style={styles.promptTxt}>✨ Need inspiration? Try: <Text style={{ fontWeight: '800' }}>"{randomPrompt}"</Text></Text>
            </TouchableOpacity>
          )}
          {usedPrompt && (
            <View style={styles.usedPrompt}>
              <Text style={styles.usedPromptTxt}>✨ {usedPrompt}</Text>
            </View>
          )}
          <TextInput style={styles.titleInput} value={title} onChangeText={setTitle} placeholder="Entry title (optional)" placeholderTextColor="#aaa" />
          <TextInput style={styles.bodyInput} value={body} onChangeText={setBody} placeholder="Start writing… this space is yours alone." placeholderTextColor="#aaa" multiline textAlignVertical="top" />
          <TouchableOpacity
            style={[styles.saveBtn, !body.trim() && styles.saveBtnDisabled]}
            onPress={saveEntry}
            disabled={!body.trim()}
          >
            <Text style={styles.saveBtnTxt}>Save Entry 💜</Text>
          </TouchableOpacity>
          <View style={{ height: 60 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // READ VIEW
  if (view === 'read' && current) return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.writeHeader}>
        <TouchableOpacity onPress={() => { setView('list'); setCurrent(null); }}>
          <Text style={styles.writeBack}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.writeTitle}>{current.title}</Text>
        <Text style={styles.writeSub}>{current.date} · {current.time}</Text>
      </View>
      <ScrollView style={styles.readBody}>
        <Text style={styles.readText}>{current.body}</Text>
        <View style={styles.readBtns}>
          <TouchableOpacity style={styles.editBtn} onPress={() => { setTitle(current.title); setBody(current.body); setView('write'); }}>
            <Text style={styles.editBtnTxt}>✏️  Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteEntry(current.id)}>
            <Text style={styles.deleteBtnTxt}>🗑  Delete</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );

  // LIST VIEW
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.writeHeader, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }]}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.writeBack}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.writeTitle}>My Journal</Text>
          <Text style={styles.writeSub}>🔒 Private · {entries.length} {entries.length === 1 ? 'entry' : 'entries'}</Text>
        </View>
        <TouchableOpacity style={styles.newBtn} onPress={() => { setTitle(''); setBody(''); setCurrent(null); setView('write'); }}>
          <Text style={styles.newBtnTxt}>+ New</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.listBody} showsVerticalScrollIndicator={false}>
        {entries.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📓</Text>
            <Text style={styles.emptyTitle}>Your journal is empty</Text>
            <Text style={styles.emptySub}>Writing your thoughts is a powerful way to process emotions and reduce stress.</Text>
            <TouchableOpacity style={styles.saveBtn} onPress={() => { setTitle(''); setBody(''); setCurrent(null); setView('write'); }}>
              <Text style={styles.saveBtnTxt}>Write Your First Entry ✍️</Text>
            </TouchableOpacity>
          </View>
        ) : entries.map(entry => (
          <TouchableOpacity
            key={entry.id}
            style={styles.entryCard}
            onPress={() => { setCurrent(entry); setView('read'); }}
            activeOpacity={0.8}
          >
            <Text style={styles.entryTitle}>{entry.title}</Text>
            <Text style={styles.entryPreview} numberOfLines={2}>{entry.body}</Text>
            <Text style={styles.entryDate}>{entry.date} · {entry.time}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgColor },
  pinBack: { paddingHorizontal: 22, paddingTop: 16 },
  pinBackTxt: { color: colors.tealPrimary, fontWeight: '700', fontSize: 14 },
  pinCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 60 },
  pinLockIcon: { fontSize: 52, marginBottom: 16 },
  pinTitle: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  pinSub: { color: 'rgba(255,255,255,0.55)', fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 32 },
  dotsRow: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  dot: { width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.2)' },
  dotFilled: { backgroundColor: colors.tealPrimary },
  pinError: { color: colors.crisis, fontSize: 13, marginBottom: 10 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 260, marginTop: 24, gap: 14 },
  key: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  keyEmpty: { backgroundColor: 'transparent' },
  keyTxt: { color: '#fff', fontSize: 22, fontWeight: '700' },
  writeHeader: { backgroundColor: colors.purple, paddingHorizontal: 22, paddingTop: 16, paddingBottom: 22 },
  writeBack: { color: 'rgba(255,255,255,0.8)', fontWeight: '700', fontSize: 14, marginBottom: 10 },
  writeTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  writeSub: { color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 4 },
  writeBody: { flex: 1, padding: 16 },
  promptCard: { backgroundColor: colors.purpleLight, borderWidth: 2, borderColor: '#9575CD', borderStyle: 'dashed', borderRadius: 14, padding: 14, marginBottom: 14 },
  promptTxt: { color: colors.purpleDark, fontSize: 14, lineHeight: 21 },
  usedPrompt: { backgroundColor: colors.purpleLight, borderRadius: 14, padding: 12, marginBottom: 14 },
  usedPromptTxt: { color: colors.purpleDark, fontSize: 14, fontWeight: '700' },
  titleInput: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.border, borderRadius: 14, padding: 13, fontSize: 15, marginBottom: 12, color: colors.darkBg },
  bodyInput: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.border, borderRadius: 14, padding: 13, fontSize: 15, minHeight: 260, marginBottom: 16, color: colors.darkBg, lineHeight: 24 },
  saveBtn: { backgroundColor: colors.purple, borderRadius: 14, padding: 15, alignItems: 'center' },
  saveBtnDisabled: { backgroundColor: '#ccc' },
  saveBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  readBody: { flex: 1, padding: 24 },
  readText: { fontSize: 16, color: '#444', lineHeight: 27 },
  readBtns: { flexDirection: 'row', gap: 10, marginTop: 28 },
  editBtn: { flex: 1, backgroundColor: colors.purpleLight, borderRadius: 14, padding: 14, alignItems: 'center' },
  editBtnTxt: { color: colors.purpleDark, fontWeight: '800', fontSize: 15 },
  deleteBtn: { flex: 1, backgroundColor: colors.errorLight, borderRadius: 14, padding: 14, alignItems: 'center' },
  deleteBtnTxt: { color: colors.errorDark, fontWeight: '800', fontSize: 15 },
  newBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 10 },
  newBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
  listBody: { flex: 1, padding: 16 },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontWeight: '800', fontSize: 18, color: colors.darkBg, marginBottom: 8 },
  emptySub: { color: '#888', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  entryCard: { backgroundColor: colors.white, borderRadius: 18, padding: 18, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#7986CB', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 5 },
  entryTitle: { fontWeight: '800', fontSize: 16, color: colors.darkBg, marginBottom: 5 },
  entryPreview: { color: '#888', fontSize: 13, lineHeight: 19, marginBottom: 10 },
  entryDate: { color: '#bbb', fontSize: 12 },
});
