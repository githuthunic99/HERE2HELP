import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, RefreshControl,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { updateSessionStatus, signOut } from '../services/firebase';
import { colors } from '../theme/colors';

export default function CounsellorDashboard({ navigation }) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('waiting'); // waiting | active | completed

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('sessions')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSessions(data);
        setLoading(false);
      });
    return unsubscribe;
  }, []);

  const filtered = sessions.filter(s => s.status === activeTab);
  const waitingCount = sessions.filter(s => s.status === 'waiting').length;

  const acceptSession = async (sessionId) => {
    await updateSessionStatus(sessionId, 'active', user.uid);
  };

  const completeSession = async (sessionId) => {
    await updateSessionStatus(sessionId, 'completed');
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((Date.now() - timestamp.toMillis()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const statusColors = { waiting: '#FB8C00', active: colors.tealPrimary, completed: '#888' };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.headerTitle}>{user?.displayName || 'Counsellor'}</Text>
          <Text style={styles.headerSub}>Counsellor Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.signOutBtn} onPress={() => signOut()}>
          <Text style={styles.signOutTxt}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Waiting', count: sessions.filter(s => s.status === 'waiting').length, color: '#FB8C00', bg: '#FFF3E0' },
          { label: 'Active', count: sessions.filter(s => s.status === 'active').length, color: colors.tealPrimary, bg: colors.tealLight },
          { label: 'Completed', count: sessions.filter(s => s.status === 'completed').length, color: '#888', bg: '#F5F5F5' },
        ].map(stat => (
          <View key={stat.label} style={[styles.statCard, { backgroundColor: stat.bg }]}>
            <Text style={[styles.statCount, { color: stat.color }]}>{stat.count}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {['waiting', 'active', 'completed'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabTxt, activeTab === tab && styles.tabTxtActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'waiting' && waitingCount > 0 ? ` (${waitingCount})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Session List */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.tealPrimary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          style={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(false)} />}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>
                {activeTab === 'waiting' ? '✅' : activeTab === 'active' ? '💬' : '📋'}
              </Text>
              <Text style={styles.emptyTxt}>
                {activeTab === 'waiting' ? 'No students waiting' : activeTab === 'active' ? 'No active sessions' : 'No completed sessions yet'}
              </Text>
            </View>
          ) : filtered.map(session => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.studentAvatar}>
                  <Text style={{ fontSize: 20 }}>🎓</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName}>{session.studentName || 'Anonymous Student'}</Text>
                  <Text style={styles.sessionTime}>{timeAgo(session.createdAt)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColors[session.status] + '22' }]}>
                  <Text style={[styles.statusTxt, { color: statusColors[session.status] }]}>
                    {session.status}
                  </Text>
                </View>
              </View>

              {session.topic && (
                <View style={styles.topicBadge}>
                  <Text style={styles.topicTxt}>📌 {Array.isArray(session.topic) ? session.topic.join(', ') : session.topic}</Text>
                </View>
              )}

              {session.description ? (
                <Text style={styles.sessionDesc} numberOfLines={3}>{session.description}</Text>
              ) : null}

              <View style={styles.sessionActions}>
                {session.status === 'waiting' && (
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => acceptSession(session.id)}
                  >
                    <Text style={styles.acceptBtnTxt}>Accept Session →</Text>
                  </TouchableOpacity>
                )}
                {session.status === 'active' && (
                  <>
                    <TouchableOpacity
                      style={styles.chatBtn}
                      onPress={() => navigation.navigate('CounsellorChat', { session })}
                    >
                      <Text style={styles.chatBtnTxt}>💬 Open Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.completeBtn}
                      onPress={() => completeSession(session.id)}
                    >
                      <Text style={styles.completeBtnTxt}>✓ Complete</Text>
                    </TouchableOpacity>
                  </>
                )}
                {session.status === 'completed' && (
                  <Text style={styles.completedTxt}>✅ Session completed</Text>
                )}
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgColor },
  header: { backgroundColor: colors.darkBg, paddingHorizontal: 22, paddingTop: 20, paddingBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  greeting: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 2 },
  headerSub: { color: colors.tealPrimary, fontSize: 13, fontWeight: '700', marginTop: 3 },
  signOutBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  signOutTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 10, padding: 16 },
  statCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center' },
  statCount: { fontSize: 28, fontWeight: '900' },
  statLabel: { color: '#888', fontSize: 12, fontWeight: '700', marginTop: 4 },
  tabRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: '#F0F0F0' },
  tabActive: { backgroundColor: colors.tealPrimary },
  tabTxt: { fontWeight: '700', color: '#888', fontSize: 13 },
  tabTxtActive: { color: '#fff' },
  list: { flex: 1, paddingHorizontal: 16 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTxt: { color: '#888', fontSize: 16 },
  sessionCard: { backgroundColor: colors.white, borderRadius: 20, padding: 18, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6 },
  sessionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  studentAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.tealLight, alignItems: 'center', justifyContent: 'center' },
  studentName: { fontWeight: '800', fontSize: 16, color: colors.darkBg },
  sessionTime: { color: '#aaa', fontSize: 12, marginTop: 2 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusTxt: { fontWeight: '700', fontSize: 12 },
  topicBadge: { backgroundColor: colors.tealLight, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start', marginBottom: 10 },
  topicTxt: { color: colors.tealDark, fontWeight: '700', fontSize: 13 },
  sessionDesc: { color: '#666', fontSize: 14, lineHeight: 21, marginBottom: 14 },
  sessionActions: { flexDirection: 'row', gap: 8 },
  acceptBtn: { flex: 1, backgroundColor: colors.tealPrimary, borderRadius: 12, padding: 12, alignItems: 'center' },
  acceptBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
  chatBtn: { flex: 1, backgroundColor: colors.tealLight, borderRadius: 12, padding: 12, alignItems: 'center' },
  chatBtnTxt: { color: colors.tealDark, fontWeight: '800', fontSize: 14 },
  completeBtn: { backgroundColor: '#E8F5E9', borderRadius: 12, padding: 12, alignItems: 'center', paddingHorizontal: 16 },
  completeBtnTxt: { color: '#2E7D32', fontWeight: '800', fontSize: 14 },
  completedTxt: { color: '#888', fontSize: 14, fontWeight: '700' },
});
