import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Switch, Linking, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/firebase';
import { colors } from '../theme/colors';

export default function ProfileScreen({ navigation }) {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const handleEmergencyContacts = () => {
    Alert.alert(
      '🆘 Emergency Contacts',
      'Kenya Emergency Services: 999\nMental Health Helpline: 0800 720 990\nSuicide Prevention: 0722 178 177\nNairobi Women\'s Hospital: 0719 638 006',
      [
        { text: 'Call 999', onPress: () => Linking.openURL('tel:999') },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'ℹ️ About Here2Help',
      'Here2Help v2.0\n\nA student mental wellness companion providing 24/7 access to counselling, AI support, self-help resources, and wellness tools.\n\nAll conversations are strictly confidential.\n\n© 2026 Here2Help',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      '🔒 Privacy Settings',
      'Your data is encrypted and stored securely on Firebase. We never sell your personal information.\n\nSession transcripts are anonymised for quality review. You can request data deletion at any time.',
      [
        { text: 'Request Data Deletion', style: 'destructive', onPress: () => Alert.alert('Request Sent', 'We will process your request within 30 days.') },
        { text: 'OK' },
      ]
    );
  };

  const handleLanguage = () => {
    Alert.alert(
      '🌐 Language',
      'Currently available languages:',
      [
        { text: '🇬🇧 English (Current)', style: 'default' },
        { text: '🇰🇪 Swahili (Coming Soon)' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAccessibility = () => {
    Alert.alert(
      '♿ Accessibility',
      'Accessibility features:\n\n• Large text support\n• Screen reader compatible\n• High contrast mode (coming soon)\n• Voice navigation (coming soon)',
      [{ text: 'OK' }]
    );
  };

  const roleColors = {
    student: { bg: colors.tealLight, text: colors.tealDark, label: '🎓 Student' },
    counsellor: { bg: colors.purpleLight, text: colors.purpleDark, label: '💬 Counsellor' },
    admin: { bg: '#FFF3E0', text: '#7B4100', label: '⚙️ Admin' },
  };

  const currentRole = roleColors[role] || roleColors.student;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>
          <Text style={styles.name}>{user?.displayName || 'Student Profile'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
          <View style={[styles.roleBadge, { backgroundColor: currentRole.bg }]}>
            <Text style={[styles.roleTxt, { color: currentRole.text }]}>{currentRole.label}</Text>
          </View>
        </View>

        <View style={styles.body}>

          {/* Account Section */}
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.section}>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ChangePassword')}>
              <Text style={styles.rowIcon}>🔑</Text>
              <Text style={styles.rowLabel}>Change Password</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={handlePrivacy}>
              <Text style={styles.rowIcon}>🔒</Text>
              <Text style={styles.rowLabel}>Privacy Settings</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Preferences Section */}
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.rowIcon}>🔔</Text>
              <Text style={styles.rowLabel}>Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#ddd', true: colors.tealPrimary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={handleLanguage}>
              <Text style={styles.rowIcon}>🌐</Text>
              <Text style={styles.rowLabel}>Language</Text>
              <Text style={styles.rowValue}>English</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={handleAccessibility}>
              <Text style={styles.rowIcon}>♿</Text>
              <Text style={styles.rowLabel}>Accessibility</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Support Section */}
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.section}>
            <TouchableOpacity style={styles.row} onPress={handleEmergencyContacts}>
              <Text style={styles.rowIcon}>🆘</Text>
              <Text style={styles.rowLabel}>Emergency Contacts</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Feedback')}>
              <Text style={styles.rowIcon}>📝</Text>
              <Text style={styles.rowLabel}>Give Feedback</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={handleAbout}>
              <Text style={styles.rowIcon}>ℹ️</Text>
              <Text style={styles.rowLabel}>About Here2Help</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Out */}
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutTxt}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Here2Help v2.0 · 🔒 All data is encrypted</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgColor },
  header: { backgroundColor: colors.tealDark, paddingHorizontal: 22, paddingTop: 20, paddingBottom: 40, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  name: { color: '#fff', fontWeight: '800', fontSize: 22 },
  email: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  roleBadge: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginTop: 10 },
  roleTxt: { fontWeight: '700', fontSize: 13 },
  body: { padding: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginTop: 20, marginBottom: 8, marginLeft: 4 },
  section: { backgroundColor: colors.white, borderRadius: 18, overflow: 'hidden', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  rowIcon: { fontSize: 20, width: 28 },
  rowLabel: { flex: 1, fontWeight: '700', color: colors.darkBg, fontSize: 15 },
  rowValue: { color: '#aaa', fontSize: 14, marginRight: 4 },
  chevron: { color: '#ccc', fontSize: 20 },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 58 },
  signOutBtn: { backgroundColor: colors.errorLight, borderRadius: 16, padding: 16, alignItems: 'center', marginTop: 24, borderWidth: 1, borderColor: '#FFCDD2' },
  signOutTxt: { color: colors.errorDark, fontWeight: '800', fontSize: 16 },
  version: { textAlign: 'center', color: '#bbb', fontSize: 12, marginTop: 16 },
});
