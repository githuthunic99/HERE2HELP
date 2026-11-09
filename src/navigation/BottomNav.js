import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const TABS = [
  { key: 'Home', label: 'Explore', emoji: '🧭' },
  { key: 'Explore', label: 'Articles', emoji: '📖' },
  { key: 'Search', label: 'Search', emoji: '🔍' },
  { key: 'Profile', label: 'Profile', emoji: '⚙️' },
];

export default function BottomNav({ activeTab, onTabPress }) {
  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.emoji, !isActive && styles.inactive]}>{tab.emoji}</Text>
            <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  emoji: {
    fontSize: 22,
  },
  inactive: {
    opacity: 0.4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeLabel: {
    color: colors.tealPrimary,
    fontWeight: '800',
  },
  inactiveLabel: {
    color: '#aaa',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.tealPrimary,
    marginTop: 2,
  },
});
