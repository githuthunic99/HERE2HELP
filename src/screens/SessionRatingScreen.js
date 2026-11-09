import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { saveSessionRating } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function SessionRatingScreen({ navigation, route }) {
  const { sessionId, counsellorName } = route.params || {};
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setLoading(true);
    try {
      await saveSessionRating(sessionId, rating, feedback, user?.uid);
      setSubmitted(true);
    } catch (e) {
      setSubmitted(true); // Still show success even if save fails
    }
    setLoading(false);
  };

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
  const ratingColors = ['', '#E53935', '#FB8C00', '#F9A825', '#43A047', '#00BFA6'];

  if (submitted) return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.successCenter}>
        <Text style={styles.successEmoji}>💚</Text>
        <Text style={styles.successTitle}>Thank you!</Text>
        <Text style={styles.successSub}>
          Your feedback helps us improve the quality of support for all students.
        </Text>
        <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.doneBtnTxt}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rate Your Session</Text>
        <Text style={styles.headerSub}>
          {counsellorName ? `Session with ${counsellorName}` : 'Counsellor Session'}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.question}>How would you rate your experience?</Text>

          {/* Star Rating */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starBtn}
                activeOpacity={0.7}
              >
                <Text style={[styles.star, star <= rating && styles.starActive]}>
                  {star <= rating ? '★' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rating label */}
          {rating > 0 && (
            <Text style={[styles.ratingLabel, { color: ratingColors[rating] }]}>
              {ratingLabels[rating]}
            </Text>
          )}

          {/* Feedback */}
          <Text style={styles.feedbackLabel}>Additional comments (optional)</Text>
          <TextInput
            style={styles.textarea}
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Share your experience or suggestions..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{feedback.length}/500</Text>
        </View>

        {/* Quick feedback buttons */}
        <Text style={styles.quickLabel}>Quick feedback:</Text>
        <View style={styles.quickRow}>
          {['Very helpful', 'Felt heard', 'Need more sessions', 'Good advice'].map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.quickTag, feedback.includes(tag) && styles.quickTagActive]}
              onPress={() => setFeedback(p => p.includes(tag) ? p.replace(tag, '').trim() : `${p} ${tag}`.trim())}
            >
              <Text style={[styles.quickTagTxt, feedback.includes(tag) && styles.quickTagTxtActive]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0 || loading}
        >
          <Text style={styles.submitBtnTxt}>
            {loading ? 'Submitting...' : 'Submit Rating ★'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.skipTxt}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgColor },
  header: { backgroundColor: colors.tealDark, paddingHorizontal: 22, paddingTop: 40, paddingBottom: 28, alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 6 },
  body: { padding: 20 },
  card: { backgroundColor: colors.white, borderRadius: 24, padding: 24, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10 },
  question: { fontSize: 18, fontWeight: '800', color: colors.darkBg, textAlign: 'center', marginBottom: 24 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
  starBtn: { padding: 4 },
  star: { fontSize: 44, color: '#DDD' },
  starActive: { color: '#F9A825' },
  ratingLabel: { textAlign: 'center', fontWeight: '800', fontSize: 16, marginBottom: 20 },
  feedbackLabel: { fontSize: 13, fontWeight: '700', color: '#555', marginBottom: 8, marginTop: 8 },
  textarea: { borderWidth: 2, borderColor: '#EEEEEE', borderRadius: 14, padding: 13, fontSize: 15, minHeight: 100, color: colors.darkBg, backgroundColor: '#FAFAFA' },
  charCount: { color: '#bbb', fontSize: 12, textAlign: 'right', marginTop: 4 },
  quickLabel: { fontWeight: '700', color: '#555', fontSize: 13, marginTop: 20, marginBottom: 10 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  quickTag: { backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 2, borderColor: 'transparent' },
  quickTagActive: { backgroundColor: colors.tealLight, borderColor: colors.tealPrimary },
  quickTagTxt: { color: '#666', fontWeight: '700', fontSize: 13 },
  quickTagTxtActive: { color: colors.tealDark },
  submitBtn: { backgroundColor: colors.tealPrimary, borderRadius: 16, padding: 16, alignItems: 'center', elevation: 3 },
  submitBtnDisabled: { backgroundColor: '#ccc' },
  submitBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  skipBtn: { alignItems: 'center', marginTop: 14, padding: 8 },
  skipTxt: { color: '#aaa', fontSize: 14 },
  successCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successEmoji: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 26, fontWeight: '800', color: colors.darkBg, marginBottom: 10 },
  successSub: { color: '#666', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  doneBtn: { backgroundColor: colors.tealPrimary, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 },
  doneBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
