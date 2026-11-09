import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, Linking, ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';

// ── FEEDBACK SCREEN — with 5-star rating ─────────────────────────────────────
export function FeedbackScreen({ navigation }) {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const categories = ['AI Companion', 'Counsellor Session', 'Articles', 'Wellness Tools', 'App Design', 'Other'];
  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  const ratingColors = ['', '#E53935', '#FB8C00', '#F9A825', '#43A047', '#00BFA6'];

  if (sent) return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.successCenter}>
        <Text style={styles.successEmoji}>💚</Text>
        <Text style={styles.successTitle}>Thank you!</Text>
        <Text style={styles.successSub}>Your feedback helps us improve Here2Help for every student.</Text>
        <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.doneBtnTxt}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backTxt}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Give Feedback</Text>
          <Text style={styles.headerSub}>Help us improve Here2Help for students like you.</Text>
        </View>

        <View style={styles.body}>
          {/* Star Rating */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>How would you rate Here2Help overall?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                  <Text style={[styles.star, star <= rating && styles.starActive]}>
                    {star <= rating ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={[styles.ratingLabel, { color: ratingColors[rating] }]}>
                {ratingLabels[rating]}
              </Text>
            )}
          </View>

          {/* Category */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What are you giving feedback on?</Text>
            <View style={styles.categoryRow}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catBtn, category === cat && styles.catBtnActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.catTxt, category === cat && styles.catTxtActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Comments */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Share your experience or suggestions</Text>
            <TextInput
              style={styles.textarea}
              value={text}
              onChangeText={v => setText(v.slice(0, 500))}
              placeholder="Tell us what you think..."
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{text.length}/500</Text>
          </View>

          <TouchableOpacity
            style={[styles.sendBtn, rating === 0 && styles.sendBtnDisabled]}
            onPress={() => rating > 0 && setSent(true)}
            disabled={rating === 0}
          >
            <Text style={styles.sendBtnTxt}>
              {rating === 0 ? 'Please select a rating ★' : 'Send Feedback ★'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── CALL SCREEN ───────────────────────────────────────────────────────────────
export function CallScreen({ navigation }) {
  const numbers = [
    { label: 'Kenya Emergency Services', num: '999' },
    { label: 'Mental Health Helpline (Kenya)', num: '0800720990' },
    { label: 'Suicide Prevention Kenya', num: '0722178177' },
    { label: 'International Support', num: '+16046425212' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Call Support</Text>
        <Text style={styles.headerSub}>Real-time private and confidential support from your phone.</Text>
      </View>
      <ScrollView style={styles.body}>
        {numbers.map(item => (
          <TouchableOpacity
            key={item.num}
            style={styles.callRow}
            onPress={() => Linking.openURL(`tel:${item.num}`)}
          >
            <View>
              <Text style={styles.callLabel}>{item.label}</Text>
              <Text style={styles.callNum}>{item.num}</Text>
            </View>
            <View style={styles.callIcon}>
              <Text style={{ fontSize: 20 }}>📞</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgColor },
  header: { backgroundColor: colors.darkBg, paddingHorizontal: 22, paddingTop: 16, paddingBottom: 28 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 14 },
  backTxt: { color: colors.tealPrimary, fontWeight: '700', fontSize: 14 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 6, lineHeight: 21 },
  body: { padding: 16 },
  card: { backgroundColor: colors.white, borderRadius: 18, padding: 20, marginBottom: 14, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 },
  cardTitle: { fontWeight: '800', fontSize: 16, color: colors.darkBg, marginBottom: 16 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 10 },
  star: { fontSize: 44, color: '#DDD' },
  starActive: { color: '#F9A825' },
  ratingLabel: { textAlign: 'center', fontWeight: '800', fontSize: 16 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: { backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 2, borderColor: 'transparent' },
  catBtnActive: { backgroundColor: colors.tealLight, borderColor: colors.tealPrimary },
  catTxt: { color: '#666', fontWeight: '700', fontSize: 13 },
  catTxtActive: { color: colors.tealDark },
  textarea: { borderWidth: 2, borderColor: '#EEEEEE', borderRadius: 14, padding: 13, fontSize: 15, minHeight: 120, color: colors.darkBg, backgroundColor: '#FAFAFA' },
  charCount: { color: '#bbb', fontSize: 12, textAlign: 'right', marginTop: 4 },
  sendBtn: { backgroundColor: colors.tealPrimary, borderRadius: 16, padding: 16, alignItems: 'center', marginTop: 4, elevation: 3 },
  sendBtnDisabled: { backgroundColor: '#ccc' },
  sendBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  successCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successEmoji: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 26, fontWeight: '800', color: colors.darkBg, marginBottom: 10 },
  successSub: { color: '#666', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  doneBtn: { backgroundColor: colors.tealPrimary, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 },
  doneBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  callRow: { backgroundColor: colors.white, borderRadius: 16, padding: 18, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 5 },
  callLabel: { color: '#999', fontSize: 12, marginBottom: 4 },
  callNum: { color: colors.darkBg, fontWeight: '800', fontSize: 18 },
  callIcon: { backgroundColor: colors.tealLight, borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
