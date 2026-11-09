import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';
import { moods, articles } from '../data';

export default function HomeScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodLogged, setMoodLogged] = useState(false);

  const quickActions = [
    { label: 'Call Support', emoji: '📞', bg: colors.blueLight, accent: colors.blue, screen: 'Call' },
    { label: 'Journal', emoji: '📓', bg: colors.purpleLight, accent: colors.purple, screen: 'Journal' },
    { label: 'Breathe & Meditate', emoji: '🧘', bg: '#E0F2F1', accent: '#00695C', screen: 'Wellness' },
    { label: 'Give Feedback', emoji: '📝', bg: '#F3E5F5', accent: '#8E24AA', screen: 'Feedback' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good afternoon 👋</Text>
          <Text style={styles.headerTitle}>How are you today?</Text>
          <Text style={styles.headerSub}>We're here whenever you need us.</Text>
        </View>

        <View style={styles.body}>
          {/* Mood Tracker */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Mood Tracker</Text>
              <Text style={styles.cardBadge}>Today</Text>
            </View>
            {moodLogged ? (
              <View style={styles.moodLogged}>
                <Text style={styles.moodEmoji}>
                  {moods.find(m => m.value === selectedMood)?.emoji}
                </Text>
                <Text style={styles.moodLoggedTitle}>Mood logged! ✓</Text>
                <Text style={styles.moodLoggedSub}>
                  Feeling {moods.find(m => m.value === selectedMood)?.label}
                </Text>
                <TouchableOpacity
                  style={styles.moodChangeBtn}
                  onPress={() => { setMoodLogged(false); setSelectedMood(null); }}
                >
                  <Text style={styles.moodChangeTxt}>Change</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.moodRow}>
                  {moods.map(m => (
                    <TouchableOpacity
                      key={m.value}
                      style={[
                        styles.moodBtn,
                        selectedMood === m.value && { backgroundColor: m.color + '22', borderColor: m.color },
                      ]}
                      onPress={() => setSelectedMood(m.value)}
                    >
                      <Text style={styles.moodIcon}>{m.emoji}</Text>
                      <Text style={[styles.moodLabel, selectedMood === m.value && { color: m.color }]}>
                        {m.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.logBtn, !selectedMood && styles.logBtnDisabled]}
                  onPress={() => selectedMood && setMoodLogged(true)}
                >
                  <Text style={[styles.logBtnTxt, !selectedMood && styles.logBtnTxtDisabled]}>
                    Log My Mood
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Chat with Counsellor */}
          <TouchableOpacity
            style={styles.counsellorCard}
            onPress={() => navigation.navigate('Counsellor')}
            activeOpacity={0.85}
          >
            <View style={styles.counsellorRow}>
              <View style={styles.counsellorIcon}>
                <Text style={{ fontSize: 24 }}>💬</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.counsellorTitle}>Chat with a Counsellor</Text>
                <Text style={styles.counsellorSub}>Connect with your school's support team</Text>
              </View>
              <Text style={styles.counsellorArrow}>›</Text>
            </View>
            <View style={styles.counsellorBadge}>
              <Text style={styles.counsellorBadgeTxt}>🔒  Strictly confidential · Available 24/7</Text>
            </View>
          </TouchableOpacity>

          {/* AI Companion */}
          <TouchableOpacity
            style={styles.aiCard}
            onPress={() => navigation.navigate('AIChat')}
            activeOpacity={0.85}
          >
            <View style={styles.aiRow}>
              <View style={styles.aiIcon}><Text style={{ fontSize: 22 }}>🤖</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiTitle}>AI Wellness Companion</Text>
                <Text style={styles.aiSub}>Chat anytime, no wait required</Text>
              </View>
              <Text style={styles.aiArrow}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickGrid}>
            {quickActions.map(action => (
              <TouchableOpacity
                key={action.label}
                style={[styles.quickBtn, { backgroundColor: action.bg }]}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.8}
              >
                <Text style={styles.quickEmoji}>{action.emoji}</Text>
                <Text style={[styles.quickLabel, { color: action.accent }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Featured Article */}
          <Text style={styles.sectionTitle}>Featured Today</Text>
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => navigation.navigate('Article', { article: articles.popular[0] })}
            activeOpacity={0.85}
          >
            <View style={styles.featuredBanner}>
              <Text style={{ fontSize: 52 }}>🌱</Text>
            </View>
            <View style={styles.featuredBody}>
              <Text style={styles.featuredMeta}>POPULAR • 4 MIN READ</Text>
              <Text style={styles.featuredTitle}>{articles.popular[0].title}</Text>
              <Text style={styles.featuredExcerpt}>{articles.popular[0].excerpt}</Text>
              <Text style={styles.readMore}>Read Article →</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgColor },
  scroll: { flex: 1 },
  header: {
    background: 'linear-gradient(135deg, #007A6E, #00BFA6)',
    backgroundColor: colors.tealDark,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 6 },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  body: { padding: 16 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 20, marginTop: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontWeight: '800', fontSize: 17, color: colors.darkBg },
  cardBadge: { fontSize: 12, color: colors.tealPrimary, fontWeight: '700' },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4, borderRadius: 14, marginHorizontal: 3, borderWidth: 2, borderColor: 'transparent' },
  moodIcon: { fontSize: 26 },
  moodLabel: { fontSize: 11, color: '#888', fontWeight: '700', marginTop: 6 },
  logBtn: { marginTop: 14, backgroundColor: colors.tealPrimary, borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  logBtnDisabled: { backgroundColor: '#eee' },
  logBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
  logBtnTxtDisabled: { color: '#aaa' },
  moodLogged: { alignItems: 'center', paddingVertical: 10 },
  moodEmoji: { fontSize: 44 },
  moodLoggedTitle: { color: colors.tealDark, fontWeight: '800', marginTop: 8, fontSize: 16 },
  moodLoggedSub: { color: '#888', fontSize: 13, marginTop: 4 },
  moodChangeBtn: { marginTop: 12, backgroundColor: colors.tealLight, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  moodChangeTxt: { color: colors.tealDark, fontWeight: '700', fontSize: 13 },
  counsellorCard: { backgroundColor: colors.darkBg, borderRadius: 20, padding: 22, marginTop: 16 },
  counsellorRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  counsellorIcon: { backgroundColor: colors.tealPrimary, borderRadius: 30, width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  counsellorTitle: { color: '#fff', fontWeight: '800', fontSize: 17 },
  counsellorSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 3 },
  counsellorArrow: { color: colors.tealPrimary, fontSize: 24 },
  counsellorBadge: { marginTop: 14, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: 10 },
  counsellorBadgeTxt: { color: 'rgba(255,255,255,0.65)', fontSize: 13 },
  aiCard: { backgroundColor: colors.tealPrimary, borderRadius: 20, padding: 18, marginTop: 12 },
  aiRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  aiIcon: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  aiTitle: { color: '#fff', fontWeight: '800', fontSize: 15 },
  aiSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  aiArrow: { color: 'rgba(255,255,255,0.55)', fontSize: 22 },
  sectionTitle: { fontWeight: '800', fontSize: 17, color: colors.darkBg, marginTop: 22, marginBottom: 14 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickBtn: { width: '47%', borderRadius: 18, padding: 18, gap: 10 },
  quickEmoji: { fontSize: 28 },
  quickLabel: { fontWeight: '800', fontSize: 14, lineHeight: 18 },
  featuredCard: { backgroundColor: colors.white, borderRadius: 20, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, marginBottom: 24 },
  featuredBanner: { backgroundColor: '#43A047', height: 110, alignItems: 'center', justifyContent: 'center' },
  featuredBody: { padding: 16 },
  featuredMeta: { color: colors.tealPrimary, fontWeight: '700', fontSize: 12, marginBottom: 6 },
  featuredTitle: { fontWeight: '800', fontSize: 17, color: colors.darkBg, marginBottom: 8, lineHeight: 24 },
  featuredExcerpt: { color: '#666', fontSize: 14, lineHeight: 21 },
  readMore: { color: colors.tealPrimary, fontWeight: '700', fontSize: 14, marginTop: 12 },
});
