import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';

export default function ArticleScreen({ route, navigation }) {
  const { article } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: article.accent }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backTxt}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.emoji}>{article.emoji}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryTxt}>{article.category}</Text>
          </View>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.readTime}>{article.read}</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.excerpt}>{article.excerpt}</Text>
          <Text style={styles.para}>
            Mental wellness is a journey, not a destination. Small consistent steps make a real difference — for your mood, your relationships, and your resilience over time.
          </Text>
          <Text style={styles.para}>
            Research shows that self-awareness, social connection, and proactive coping strategies are among the strongest predictors of long-term mental health. You don't have to have it all figured out — just keep showing up for yourself.
          </Text>

          <View style={styles.takeaway}>
            <Text style={styles.takeawayTitle}>💡 Key Takeaway</Text>
            <Text style={styles.takeawayBody}>
              Progress looks different for everyone. Be patient and compassionate with yourself as you grow.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('Counsellor')}
          >
            <Text style={styles.ctaTxt}>Talk to a Counsellor 💬</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgColor },
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28 },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8, alignSelf: 'flex-start', marginBottom: 20 },
  backTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  emoji: { fontSize: 44, marginBottom: 12 },
  categoryBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 12 },
  categoryTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', lineHeight: 34 },
  readTime: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 10 },
  body: { padding: 24, paddingBottom: 60 },
  excerpt: { fontSize: 16, color: '#444', lineHeight: 27, marginTop: 0 },
  para: { fontSize: 16, color: '#444', lineHeight: 27, marginTop: 16 },
  takeaway: { backgroundColor: colors.tealLight, borderRadius: 16, padding: 20, marginTop: 24, borderLeftWidth: 4, borderLeftColor: colors.tealPrimary },
  takeawayTitle: { fontWeight: '800', color: colors.tealDark, marginBottom: 6, fontSize: 15 },
  takeawayBody: { color: '#333', fontSize: 15, lineHeight: 23 },
  ctaBtn: { marginTop: 28, backgroundColor: colors.tealPrimary, borderRadius: 16, padding: 16, alignItems: 'center' },
  ctaTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
