import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';
import { articles, exploreCategories } from '../data';

export default function ExploreScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState('popular');
  const categoryArticles = articles[activeCategory] || articles.popular;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSub}>Curated resources for your wellbeing</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {exploreCategories.map(cat => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.categoryBtn, activeCategory === cat.key && styles.categoryBtnActive]}
            onPress={() => setActiveCategory(cat.key)}
          >
            <Text style={[styles.categoryTxt, activeCategory === cat.key && styles.categoryTxtActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {categoryArticles.map(article => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleCard}
            onPress={() => navigation.navigate('Article', { article })}
            activeOpacity={0.85}
          >
            <View style={[styles.articleThumb, { backgroundColor: article.color }]}>
              <Text style={styles.articleEmoji}>{article.emoji}</Text>
            </View>
            <View style={styles.articleBody}>
              <Text style={[styles.articleMeta, { color: article.accent }]}>
                {article.category.toUpperCase()} • {article.read}
              </Text>
              <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
              <Text style={styles.articleExcerpt} numberOfLines={2}>{article.excerpt}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgColor },
  header: { backgroundColor: colors.tealDark, paddingHorizontal: 22, paddingTop: 20, paddingBottom: 24 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 4 },
  categoryScroll: { maxHeight: 56 },
  categoryContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  categoryBtn: { backgroundColor: colors.white, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8, borderWidth: 2, borderColor: colors.border },
  categoryBtnActive: { backgroundColor: colors.tealPrimary, borderColor: colors.tealPrimary },
  categoryTxt: { color: '#555', fontWeight: '700', fontSize: 13 },
  categoryTxtActive: { color: '#fff' },
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  articleCard: { backgroundColor: colors.white, borderRadius: 20, overflow: 'hidden', marginBottom: 14, flexDirection: 'row', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 },
  articleThumb: { width: 90, alignItems: 'center', justifyContent: 'center' },
  articleEmoji: { fontSize: 34 },
  articleBody: { flex: 1, padding: 14 },
  articleMeta: { fontSize: 11, fontWeight: '700', marginBottom: 5 },
  articleTitle: { fontWeight: '800', fontSize: 15, color: colors.darkBg, lineHeight: 21, marginBottom: 6 },
  articleExcerpt: { color: '#888', fontSize: 13, lineHeight: 19 },
});
