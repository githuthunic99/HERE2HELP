import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, Alert, TextInput,
} from 'react-native';
import { getAllUsers, updateUserRole, deactivateUser, signOut } from '../services/firebase';
import { colors } from '../theme/colors';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [activeTab, setActiveTab] = useState('users'); // users | stats

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load users.');
    }
    setLoading(false);
  };

  const handleRoleChange = (uid, currentRole) => {
    const roles = ['student', 'counsellor', 'admin'];
    const options = roles.filter(r => r !== currentRole);
    Alert.alert('Change Role', `Change this user's role to:`, [
      ...options.map(role => ({
        text: role.charAt(0).toUpperCase() + role.slice(1),
        onPress: async () => {
          await updateUserRole(uid, role);
          setUsers(prev => prev.map(u => u.id === uid ? { ...u, role } : u));
        },
      })),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleDeactivate = (uid, name) => {
    Alert.alert('Deactivate User', `Are you sure you want to deactivate ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Deactivate', style: 'destructive',
        onPress: async () => {
          await deactivateUser(uid);
          setUsers(prev => prev.map(u => u.id === uid ? { ...u, isActive: false } : u));
        },
      },
    ]);
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const roleColors = {
    student: { bg: colors.tealLight, text: colors.tealDark },
    counsellor: { bg: colors.purpleLight, text: colors.purpleDark },
    admin: { bg: '#FFF3E0', text: '#7B4100' },
  };

  const roleEmojis = { student: '🎓', counsellor: '💬', admin: '⚙️' };

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    counsellors: users.filter(u => u.role === 'counsellor').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.isActive !== false).length,
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSub}>Here2Help Management</Text>
        </View>
        <TouchableOpacity style={styles.signOutBtn} onPress={() => signOut()}>
          <Text style={styles.signOutTxt}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Tab bar */}
      <View style={styles.tabRow}>
        {['users', 'stats'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabTxt, activeTab === tab && styles.tabTxtActive]}>
              {tab === 'users' ? '👥 Users' : '📊 Stats'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'stats' ? (
        <ScrollView style={styles.list}>
          <Text style={styles.sectionTitle}>Platform Overview</Text>
          {[
            { label: 'Total Users', value: stats.total, emoji: '👥', color: colors.tealPrimary, bg: colors.tealLight },
            { label: 'Students', value: stats.students, emoji: '🎓', color: colors.tealDark, bg: colors.tealLight },
            { label: 'Counsellors', value: stats.counsellors, emoji: '💬', color: colors.purple, bg: colors.purpleLight },
            { label: 'Admins', value: stats.admins, emoji: '⚙️', color: '#FB8C00', bg: '#FFF3E0' },
            { label: 'Active Users', value: stats.active, emoji: '✅', color: '#43A047', bg: '#E8F5E9' },
          ].map(stat => (
            <View key={stat.label} style={[styles.statRow, { backgroundColor: stat.bg }]}>
              <Text style={styles.statEmoji}>{stat.emoji}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        <>
          {/* Search and filter */}
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name or email..."
              placeholderTextColor="#aaa"
            />
          </View>
          <View style={styles.filterRow}>
            {['all', 'student', 'counsellor', 'admin'].map(role => (
              <TouchableOpacity
                key={role}
                style={[styles.filterBtn, filterRole === role && styles.filterBtnActive]}
                onPress={() => setFilterRole(role)}
              >
                <Text style={[styles.filterTxt, filterRole === role && styles.filterTxtActive]}>
                  {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.tealPrimary} style={{ marginTop: 40 }} />
          ) : (
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              <Text style={styles.resultCount}>{filtered.length} user{filtered.length !== 1 ? 's' : ''}</Text>
              {filtered.map(user => (
                <View key={user.id} style={[styles.userCard, !user.isActive && styles.userCardInactive]}>
                  <View style={styles.userRow}>
                    <View style={styles.userAvatar}>
                      <Text style={{ fontSize: 20 }}>{roleEmojis[user.role] || '👤'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.nameRow}>
                        <Text style={styles.userName}>{user.name || 'Unknown'}</Text>
                        {!user.isActive && <Text style={styles.inactiveBadge}>Inactive</Text>}
                      </View>
                      <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                    <View style={[styles.roleBadge, { backgroundColor: roleColors[user.role]?.bg || '#F5F5F5' }]}>
                      <Text style={[styles.roleTxt, { color: roleColors[user.role]?.text || '#555' }]}>
                        {user.role}
                      </Text>
                    </View>
                  </View>
                  {user.isActive !== false && (
                    <View style={styles.userActions}>
                      <TouchableOpacity
                        style={styles.roleBtn}
                        onPress={() => handleRoleChange(user.id, user.role)}
                      >
                        <Text style={styles.roleBtnTxt}>Change Role</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deactivateBtn}
                        onPress={() => handleDeactivate(user.id, user.name)}
                      >
                        <Text style={styles.deactivateBtnTxt}>Deactivate</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
              <View style={{ height: 40 }} />
            </ScrollView>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgColor },
  header: { backgroundColor: colors.darkBg, paddingHorizontal: 22, paddingTop: 20, paddingBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  headerSub: { color: colors.tealPrimary, fontSize: 13, fontWeight: '700', marginTop: 3 },
  signOutBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  signOutTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  tabRow: { flexDirection: 'row', padding: 16, gap: 8 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center', backgroundColor: '#F0F0F0' },
  tabActive: { backgroundColor: colors.tealPrimary },
  tabTxt: { fontWeight: '700', color: '#888' },
  tabTxtActive: { color: '#fff' },
  searchRow: { paddingHorizontal: 16, marginBottom: 10 },
  searchInput: { backgroundColor: colors.white, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, borderWidth: 2, borderColor: colors.border, color: colors.darkBg },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#F0F0F0' },
  filterBtnActive: { backgroundColor: colors.tealPrimary },
  filterTxt: { fontWeight: '700', color: '#888', fontSize: 13 },
  filterTxtActive: { color: '#fff' },
  list: { flex: 1, paddingHorizontal: 16 },
  resultCount: { color: '#aaa', fontSize: 13, marginBottom: 10 },
  userCard: { backgroundColor: colors.white, borderRadius: 18, padding: 16, marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 5 },
  userCardInactive: { opacity: 0.5 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.tealLight, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userName: { fontWeight: '800', fontSize: 15, color: colors.darkBg },
  inactiveBadge: { backgroundColor: '#eee', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, fontSize: 11, color: '#888', fontWeight: '700' },
  userEmail: { color: '#888', fontSize: 13, marginTop: 2 },
  roleBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  roleTxt: { fontWeight: '700', fontSize: 12 },
  userActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  roleBtn: { flex: 1, backgroundColor: colors.purpleLight, borderRadius: 10, padding: 10, alignItems: 'center' },
  roleBtnTxt: { color: colors.purpleDark, fontWeight: '700', fontSize: 13 },
  deactivateBtn: { flex: 1, backgroundColor: colors.errorLight, borderRadius: 10, padding: 10, alignItems: 'center' },
  deactivateBtnTxt: { color: colors.errorDark, fontWeight: '700', fontSize: 13 },
  sectionTitle: { fontWeight: '800', fontSize: 18, color: colors.darkBg, marginBottom: 16 },
  statRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 18, marginBottom: 10, gap: 14 },
  statEmoji: { fontSize: 24 },
  statLabel: { flex: 1, fontWeight: '700', color: '#555', fontSize: 15 },
  statValue: { fontSize: 28, fontWeight: '900' },
});
