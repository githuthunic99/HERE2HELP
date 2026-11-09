import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import { changePassword, signOut } from '../services/firebase';
import { colors } from '../theme/colors';

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.'); return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.'); return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.'); return;
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from current password.'); return;
    }
    setLoading(true); setError('');
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
    } catch (e) {
      if (e.code === 'auth/wrong-password') setError('Current password is incorrect.');
      else setError('Failed to change password. Please try again.');
    }
    setLoading(false);
  };

  if (success) return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.successCenter}>
        <Text style={styles.successEmoji}>🔐</Text>
        <Text style={styles.successTitle}>Password Changed!</Text>
        <Text style={styles.successSub}>Your password has been updated successfully. Please sign in again.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => signOut()}>
          <Text style={styles.primaryBtnTxt}>Sign In Again →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <Text style={styles.headerSub}>Keep your account secure</Text>
      </View>

      <View style={styles.body}>
        {error ? <View style={styles.errorBox}><Text style={styles.errorTxt}>⚠️  {error}</Text></View> : null}

        <Text style={styles.label}>Current Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPasswords}
          />
          <TouchableOpacity onPress={() => setShowPasswords(p => !p)} style={styles.eyeBtn}>
            <Text>{showPasswords ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Min. 6 characters"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPasswords}
        />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repeat new password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPasswords}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleChange} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnTxt}>Update Password</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgColor },
  header: { backgroundColor: colors.darkBg, paddingHorizontal: 22, paddingTop: 16, paddingBottom: 28 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 14 },
  backTxt: { color: colors.tealPrimary, fontWeight: '700', fontSize: 14 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  body: { padding: 20 },
  errorBox: { backgroundColor: colors.errorLight, borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: colors.error },
  errorTxt: { color: colors.errorDark, fontSize: 14 },
  label: { fontSize: 13, fontWeight: '700', color: '#555', marginTop: 16, marginBottom: 6 },
  input: { borderWidth: 2, borderColor: '#EEEEEE', borderRadius: 14, padding: 13, fontSize: 15, color: colors.darkBg, backgroundColor: '#fff' },
  passwordRow: { flexDirection: 'row', borderWidth: 2, borderColor: '#EEEEEE', borderRadius: 14, backgroundColor: '#fff', alignItems: 'center' },
  passwordInput: { flex: 1, padding: 13, fontSize: 15, color: colors.darkBg },
  eyeBtn: { padding: 13 },
  primaryBtn: { backgroundColor: colors.tealPrimary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 24 },
  primaryBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  successCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successEmoji: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 26, fontWeight: '800', color: colors.darkBg, marginBottom: 10 },
  successSub: { color: '#666', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
});
