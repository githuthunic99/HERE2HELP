import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';
import { articles } from '../data';

const allArticles = Object.values(articles).flat();

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const results = query
    ? allArticles.filter(
        a =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase()),
      )
    : allArticles;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search articles, topics..."
          placeholderTextColor="#aaa"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {query !== '' && results.length === 0 && (
          <Text style={styles.noResults}>No results for "{query}"</Text>
        )}
        {results.map(article => (
          <TouchableOpacity
            key={article.id}
            style={styles.row}
            onPress={() => navigation.navigate('Article', { article })}
            activeOpacity={0.8}
          >
            <View style={[styles.thumb, { backgroundColor: article.color }]}>
              <Text style={styles.thumbEmoji}>{article.emoji}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>{article.title}</Text>
              <Text style={[styles.category, { color: article.accent }]}>{article.category}</Text>
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
  header: { padding: 20, paddingTop: 20 },
  headerTitle: { fontWeight: '800', fontSize: 26, color: colors.darkBg, marginBottom: 16 },
  searchInput: { backgroundColor: colors.white, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 14, fontSize: 15, borderWidth: 2, borderColor: colors.border, color: colors.darkBg },
  list: { flex: 1, paddingHorizontal: 16 },
  noResults: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 15 },
  row: { backgroundColor: colors.white, borderRadius: 18, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 14, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 },
  thumb: { borderRadius: 14, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  thumbEmoji: { fontSize: 22 },
  info: { flex: 1 },
  title: { fontWeight: '800', fontSize: 15, color: colors.darkBg, lineHeight: 21 },
  category: { fontSize: 12, fontWeight: '700', marginTop: 3 },
});
