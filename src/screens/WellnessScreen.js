import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Animated, Easing,
} from 'react-native';
import { colors } from '../theme/colors';
import { breathingExercises, meditationTracks } from '../data';

// ── BREATHING EXERCISE SCREEN ─────────────────────────────────────────────────
function BreathingScreen({ exercise, onBack }) {
  const [phase, setPhase] = useState('ready'); // ready | inhale | hold | exhale | holdout | done
  const [cycle, setCycle] = useState(0);
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const phaseOrder = ['inhale', 'hold', 'exhale', 'holdout'];

  useEffect(() => {
    if (phase === 'ready' || phase === 'done') return;
    clearInterval(intervalRef.current);
    const phaseIndex = phaseOrder.indexOf(phase);
    const duration = exercise.pattern[phaseIndex];
    if (duration === 0) { advance(phase, cycle); return; }

    // Animate circle
    if (phase === 'inhale') {
      Animated.timing(scaleAnim, { toValue: 1.4, duration: duration * 1000, easing: Easing.linear, useNativeDriver: true }).start();
    } else if (phase === 'exhale') {
      Animated.timing(scaleAnim, { toValue: 1, duration: duration * 1000, easing: Easing.linear, useNativeDriver: true }).start();
    }

    setCount(duration);
    let remaining = duration;
    intervalRef.current = setInterval(() => {
      remaining--;
      setCount(remaining);
      if (remaining <= 0) { clearInterval(intervalRef.current); advance(phase, cycle); }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [phase]);

  const advance = (currentPhase, currentCycle) => {
    const i = phaseOrder.indexOf(currentPhase);
    const next = phaseOrder[(i + 1) % 4];
    if (next === 'inhale') {
      const newCycle = currentCycle + 1;
      if (newCycle >= exercise.cycles) { setPhase('done'); return; }
      setCycle(newCycle);
    }
    setPhase(next);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    scaleAnim.setValue(1);
    setPhase('ready');
    setCycle(0);
    setCount(0);
  };

  const phaseLabel = exercise.labels[phaseOrder.indexOf(phase)] || '';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: exercise.color }]}>
      <TouchableOpacity style={styles.breathBack} onPress={() => { clearInterval(intervalRef.current); onBack(); }}>
        <Text style={styles.breathBackTxt}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.breathCenter}>
        <Text style={styles.breathTitle}>{exercise.name}</Text>
        <Text style={styles.breathCycle}>
          {phase === 'done' ? 'Completed!' : `Cycle ${Math.min(cycle + 1, exercise.cycles)} of ${exercise.cycles}`}
        </Text>

        {/* Animated Ring */}
        <View style={styles.ringWrap}>
          <Animated.View style={[styles.outerRing, { backgroundColor: exercise.accent + '22', transform: [{ scale: scaleAnim }] }]} />
          <Animated.View style={[styles.midRing, { backgroundColor: exercise.accent + '33', transform: [{ scale: scaleAnim }] }]} />
          <View style={[styles.innerCircle, { backgroundColor: exercise.accent }]}>
            {phase === 'ready' && <Text style={styles.playIcon}>▶</Text>}
            {phase === 'done' && <Text style={styles.doneIcon}>✓</Text>}
            {phase !== 'ready' && phase !== 'done' && (
              <Text style={styles.countTxt}>{count}</Text>
            )}
          </View>
        </View>

        <Text style={styles.phaseLabel}>
          {phase === 'ready' ? '' : phase === 'done' ? 'Well done! 🎉' : phaseLabel}
        </Text>
        <Text style={styles.exerciseDesc}>{exercise.desc}</Text>

        {phase === 'ready' && (
          <TouchableOpacity style={[styles.startBtn, { backgroundColor: exercise.accent }]} onPress={() => setPhase('inhale')}>
            <Text style={styles.startBtnTxt}>▶</Text>
          </TouchableOpacity>
        )}
        {phase === 'done' && (
          <TouchableOpacity style={[styles.againBtn, { backgroundColor: exercise.accent }]} onPress={reset}>
            <Text style={styles.againBtnTxt}>Again ↺</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// ── MEDITATION SCREEN ─────────────────────────────────────────────────────────
function MeditationScreen({ track, onBack }) {
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!playing) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s >= track.seconds) { clearInterval(intervalRef.current); setPlaying(false); return s; }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const progress = seconds / track.seconds;
  const scriptIndex = Math.min(Math.floor(progress * track.script.length), track.script.length - 1);
  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const circumference = 2 * Math.PI * 70;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: track.color }]}>
      <TouchableOpacity style={styles.breathBack} onPress={() => { clearInterval(intervalRef.current); onBack(); }}>
        <Text style={styles.breathBackTxt}>← Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.medCenter}>
        <Text style={styles.medEmoji}>{track.emoji}</Text>
        <Text style={styles.medTitle}>{track.name}</Text>
        <Text style={styles.medDesc}>{track.desc}</Text>

        {/* Progress Circle (SVG-like using borders) */}
        <View style={styles.progressCircle}>
          <View style={[styles.progressTrack, { borderColor: track.accent + '33' }]}>
            <View style={styles.progressInner}>
              <Text style={styles.progressTime}>{formatTime(seconds)}</Text>
              <Text style={styles.progressDur}>/ {track.duration}</Text>
            </View>
          </View>
        </View>

        {/* Guide card */}
        <View style={styles.guideCard}>
          <Text style={styles.guideLabel}>GUIDE</Text>
          <Text style={styles.guideScript}>"{playing || seconds > 0 ? track.script[scriptIndex] : track.script[0]}"</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlBtn} onPress={() => { setSeconds(0); setPlaying(false); }}>
            <Text style={styles.controlBtnTxt}>↺</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.playBtn, { backgroundColor: track.accent }]} onPress={() => setPlaying(p => !p)}>
            <Text style={styles.playBtnTxt}>{playing ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={() => { setPlaying(false); clearInterval(intervalRef.current); }}>
            <Text style={styles.controlBtnTxt}>⏹</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── MAIN WELLNESS SCREEN ───────────────────────────────────────────────────────
export default function WellnessScreen({ navigation }) {
  const [breathExercise, setBreathExercise] = useState(null);
  const [medTrack, setMedTrack] = useState(null);

  if (breathExercise) return <BreathingScreen exercise={breathExercise} onBack={() => setBreathExercise(null)} />;
  if (medTrack) return <MeditationScreen track={medTrack} onBack={() => setMedTrack(null)} />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Breathe & Meditate</Text>
        <Text style={styles.headerSub}>Calm your mind in minutes</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>🌬  Breathing Exercises</Text>
        {breathingExercises.map(ex => (
          <TouchableOpacity
            key={ex.id}
            style={styles.card}
            onPress={() => setBreathExercise(ex)}
            activeOpacity={0.85}
          >
            <View style={[styles.cardThumb, { backgroundColor: ex.color }]}>
              <Text style={styles.cardEmoji}>{ex.emoji}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{ex.name}</Text>
              <Text style={styles.cardDesc}>{ex.desc}</Text>
              <Text style={[styles.cardMeta, { color: ex.accent }]}>
                {ex.pattern.filter(Boolean).join('-')} pattern · {ex.cycles} cycles
              </Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>🧘  Guided Meditations</Text>
        {meditationTracks.map(track => (
          <TouchableOpacity
            key={track.id}
            style={styles.card}
            onPress={() => setMedTrack(track)}
            activeOpacity={0.85}
          >
            <View style={[styles.cardThumb, { backgroundColor: track.color }]}>
              <Text style={styles.cardEmoji}>{track.emoji}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{track.name}</Text>
              <Text style={styles.cardDesc}>{track.desc}</Text>
              <Text style={[styles.cardMeta, { color: track.accent }]}>⏱  {track.duration}</Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgColor },
  header: { backgroundColor: '#00695C', paddingHorizontal: 22, paddingTop: 16, paddingBottom: 24 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 14 },
  backTxt: { color: 'rgba(255,255,255,0.8)', fontWeight: '700', fontSize: 14 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4 },
  list: { flex: 1, padding: 16 },
  sectionTitle: { fontWeight: '800', fontSize: 17, color: colors.darkBg, marginBottom: 14 },
  card: { backgroundColor: colors.white, borderRadius: 18, overflow: 'hidden', marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 },
  cardThumb: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center' },
  cardEmoji: { fontSize: 32 },
  cardBody: { flex: 1, padding: 14 },
  cardTitle: { fontWeight: '800', fontSize: 15, color: colors.darkBg },
  cardDesc: { color: '#888', fontSize: 13, marginTop: 3, lineHeight: 18 },
  cardMeta: { fontSize: 12, fontWeight: '700', marginTop: 5 },
  cardArrow: { color: '#ddd', fontSize: 22, marginRight: 16 },
  // Breathing
  breathBack: { paddingHorizontal: 22, paddingTop: 20 },
  breathBackTxt: { color: 'rgba(0,0,0,0.5)', fontWeight: '700', fontSize: 14 },
  breathCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, paddingBottom: 48 },
  breathTitle: { fontSize: 24, fontWeight: '800', color: colors.darkBg, textAlign: 'center', marginBottom: 6 },
  breathCycle: { color: '#666', fontSize: 14, marginBottom: 40 },
  ringWrap: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
  outerRing: { position: 'absolute', width: 200, height: 200, borderRadius: 100 },
  midRing: { position: 'absolute', width: 160, height: 160, borderRadius: 80 },
  innerCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  playIcon: { color: '#fff', fontSize: 36 },
  doneIcon: { color: '#fff', fontSize: 36 },
  countTxt: { color: '#fff', fontSize: 36, fontWeight: '900' },
  phaseLabel: { fontSize: 22, fontWeight: '800', color: colors.darkBg, minHeight: 32, textAlign: 'center' },
  exerciseDesc: { color: '#666', fontSize: 14, textAlign: 'center', marginTop: 8, marginBottom: 36 },
  startBtn: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  startBtnTxt: { color: '#fff', fontSize: 28 },
  againBtn: { borderRadius: 20, paddingHorizontal: 28, paddingVertical: 14 },
  againBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
  // Meditation
  medCenter: { alignItems: 'center', padding: 28, paddingBottom: 60 },
  medEmoji: { fontSize: 56, marginBottom: 12 },
  medTitle: { fontSize: 24, fontWeight: '800', color: colors.darkBg, textAlign: 'center', marginBottom: 6 },
  medDesc: { color: '#666', fontSize: 14, textAlign: 'center', marginBottom: 28 },
  progressCircle: { width: 160, height: 160, marginBottom: 28, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { width: 160, height: 160, borderRadius: 80, borderWidth: 8, alignItems: 'center', justifyContent: 'center' },
  progressInner: { alignItems: 'center' },
  progressTime: { fontSize: 22, fontWeight: '900', color: colors.darkBg },
  progressDur: { fontSize: 12, color: '#888' },
  guideCard: { backgroundColor: colors.white, borderRadius: 20, padding: 20, width: '100%', marginBottom: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6 },
  guideLabel: { color: '#999', fontSize: 12, fontWeight: '700', marginBottom: 8 },
  guideScript: { color: colors.darkBg, fontSize: 16, lineHeight: 26, fontStyle: 'italic' },
  controls: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  controlBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center' },
  controlBtnTxt: { fontSize: 18 },
  playBtn: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  playBtnTxt: { color: '#fff', fontSize: 28 },
});
