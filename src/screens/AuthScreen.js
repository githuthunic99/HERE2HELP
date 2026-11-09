import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { signIn, signUp, forgotPassword } from '../services/firebase';
import { colors } from '../theme/colors';

const ROLES = ['student', 'counsellor', 'admin'];

export default function AuthScreen() {
  const [screen, setScreen] = useState('login'); // login | signup | forgot
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup fields
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');

  const clearMessages = () => { setError(''); setSuccess(''); };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return; }
    setLoading(true); clearMessages();
    try {
      await signIn(email.trim(), password);
      // AuthContext will handle navigation automatically
    } catch (e) {
      if (e.code === 'auth/user-not-found') setError('No account found with this email.');
      else if (e.code === 'auth/wrong-password') setError('Incorrect password.');
      else if (e.code === 'auth/invalid-email') setError('Please enter a valid email.');
      else setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.'); return;
    }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); clearMessages();
    try {
      await signUp(email.trim(), password, name.trim(), selectedRole);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') setError('An account with this email already exists.');
      else if (e.code === 'auth/invalid-email') setError('Please enter a valid email.');
      else setError('Sign up failed. Please try again.');
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true); clearMessages();
    try {
      await forgotPassword(email.trim());
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (e) {
      if (e.code === 'auth/user-not-found') setError('No account found with this email.');
      else setError('Failed to send reset email. Please try again.');
    }
    setLoading(false);
  };

  const roleColors = {
    student: { bg: colors.tealLight, active: colors.tealPrimary, text: colors.tealDark },
    counsellor: { bg: colors.purpleLight, active: colors.purple, text: colors.purpleDark },
    admin: { bg: '#FFF3E0', active: '#FB8C00', text: '#7B4100' },
  };

  const roleEmojis = { student: '🎓', counsellor: '💬', admin: '⚙️' };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🧠</Text>
            </View>
            <Text style={styles.appName}>Here2Help</Text>
            <Text style={styles.tagline}>Your student wellness companion</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>

            {/* Tab switcher */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tab, screen === 'login' && styles.tabActive]}
                onPress={() => { setScreen('login'); clearMessages(); }}
              >
                <Text style={[styles.tabTxt, screen === 'login' && styles.tabTxtActive]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, screen === 'signup' && styles.tabActive]}
                onPress={() => { setScreen('signup'); clearMessages(); }}
              >
                <Text style={[styles.tabTxt, screen === 'signup' && styles.tabTxtActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Error / Success messages */}
            {error ? <View style={styles.errorBox}><Text style={styles.errorTxt}>⚠️  {error}</Text></View> : null}
            {success ? <View style={styles.successBox}><Text style={styles.successTxt}>✅  {success}</Text></View> : null}

            {/* ── LOGIN SCREEN ── */}
            {screen === 'login' && (
              <View style={styles.form}>
                <Text style={styles.formTitle}>Welcome back 👋</Text>
                <Text style={styles.formSub}>Sign in to your Here2Help account</Text>

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@university.edu"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.eyeBtn}>
                    <Text style={styles.eyeTxt}>{showPassword ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => { setScreen('forgot'); clearMessages(); }} style={styles.forgotBtn}>
                  <Text style={styles.forgotTxt}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnTxt}>Sign In →</Text>}
                </TouchableOpacity>

                <Text style={styles.switchTxt}>
                  Don't have an account?{' '}
                  <Text style={styles.switchLink} onPress={() => { setScreen('signup'); clearMessages(); }}>
                    Sign Up
                  </Text>
                </Text>
              </View>
            )}

            {/* ── SIGNUP SCREEN ── */}
            {screen === 'signup' && (
              <View style={styles.form}>
                <Text style={styles.formTitle}>Create Account 🌱</Text>
                <Text style={styles.formSub}>Join Here2Help today</Text>

                <Text style={styles.label}>I am a...</Text>
                <View style={styles.roleRow}>
                  {ROLES.map(r => (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.roleBtn,
                        { backgroundColor: roleColors[r].bg },
                        selectedRole === r && { borderColor: roleColors[r].active, borderWidth: 2 },
                      ]}
                      onPress={() => setSelectedRole(r)}
                    >
                      <Text style={styles.roleEmoji}>{roleEmojis[r]}</Text>
                      <Text style={[styles.roleTxt, { color: roleColors[r].text }]}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </Text>
                      {selectedRole === r && <Text style={styles.roleCheck}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  placeholderTextColor="#aaa"
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@university.edu"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Min. 6 characters"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.eyeBtn}>
                    <Text style={styles.eyeTxt}>{showPassword ? '🙈' : '👁️'}</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repeat your password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword}
                />

                <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnTxt}>Create Account →</Text>}
                </TouchableOpacity>

                <Text style={styles.switchTxt}>
                  Already have an account?{' '}
                  <Text style={styles.switchLink} onPress={() => { setScreen('login'); clearMessages(); }}>
                    Sign In
                  </Text>
                </Text>
              </View>
            )}

            {/* ── FORGOT PASSWORD SCREEN ── */}
            {screen === 'forgot' && (
              <View style={styles.form}>
                <Text style={styles.formTitle}>Reset Password 🔑</Text>
                <Text style={styles.formSub}>We'll send a reset link to your email</Text>

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@university.edu"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TouchableOpacity style={styles.primaryBtn} onPress={handleForgotPassword} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnTxt}>Send Reset Email →</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setScreen('login'); clearMessages(); }} style={styles.backBtn}>
                  <Text style={styles.backBtnTxt}>← Back to Login</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={styles.footer}>🔒 All conversations are strictly confidential</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.darkBg },
  scroll: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  header: { alignItems: 'center', paddingVertical: 32 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.tealPrimary, alignItems: 'center', justifyContent: 'center', marginBottom: 14, elevation: 8, shadowColor: colors.tealPrimary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  logoEmoji: { fontSize: 36 },
  appName: { color: '#fff', fontSize: 32, fontWeight: '900', letterSpacing: 1 },
  tagline: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 6 },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 24, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 16 },
  tabRow: { flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 16, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: colors.tealPrimary, elevation: 2 },
  tabTxt: { fontWeight: '700', color: '#888', fontSize: 15 },
  tabTxtActive: { color: '#fff' },
  errorBox: { backgroundColor: colors.errorLight, borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: colors.error },
  errorTxt: { color: colors.errorDark, fontSize: 14, lineHeight: 21 },
  successBox: { backgroundColor: '#E8F5E9', borderRadius: 12, padding: 12, marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#43A047' },
  successTxt: { color: '#2E7D32', fontSize: 14, lineHeight: 21 },
  form: { gap: 4 },
  formTitle: { fontSize: 22, fontWeight: '800', color: colors.darkBg, marginBottom: 4 },
  formSub: { color: '#888', fontSize: 14, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#555', marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 2, borderColor: '#EEEEEE', borderRadius: 14, padding: 13, fontSize: 15, color: colors.darkBg, backgroundColor: '#FAFAFA' },
  passwordRow: { flexDirection: 'row', borderWidth: 2, borderColor: '#EEEEEE', borderRadius: 14, backgroundColor: '#FAFAFA', alignItems: 'center' },
  passwordInput: { flex: 1, padding: 13, fontSize: 15, color: colors.darkBg },
  eyeBtn: { padding: 13 },
  eyeTxt: { fontSize: 18 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 8, marginBottom: 4 },
  forgotTxt: { color: colors.tealPrimary, fontWeight: '700', fontSize: 13 },
  primaryBtn: { backgroundColor: colors.tealPrimary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 20, elevation: 3, shadowColor: colors.tealPrimary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 8 },
  primaryBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  switchTxt: { textAlign: 'center', color: '#888', fontSize: 14, marginTop: 18 },
  switchLink: { color: colors.tealPrimary, fontWeight: '700' },
  roleRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  roleBtn: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 6, borderWidth: 2, borderColor: 'transparent' },
  roleEmoji: { fontSize: 22 },
  roleTxt: { fontWeight: '700', fontSize: 12 },
  roleCheck: { fontSize: 12, color: colors.tealPrimary, fontWeight: '900' },
  backBtn: { alignItems: 'center', marginTop: 16 },
  backBtnTxt: { color: colors.tealPrimary, fontWeight: '700', fontSize: 14 },
  footer: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 24 },
});
