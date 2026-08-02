import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../theme/colors';
import {TabletHomeScreen} from './screens/TabletHomeScreen';
import {TabletSectionScreen} from './screens/TabletSectionScreen';
import {
  tabletSections,
  type TabletDetailKey,
  type TabletSectionKey,
} from './tabletTypes';

const queryClient = new QueryClient();

function TabletRail({
  activeSection,
  onSelectSection,
}: {
  activeSection: TabletSectionKey;
  onSelectSection: (section: TabletSectionKey) => void;
}) {
  return (
    <View style={styles.rail}>
      <View style={styles.brandRow}>
        <Image source={require('../../assets/myhealthhub-icon.png')} style={styles.logo} />
        <View>
          <Text style={styles.brandName}>MyHealthHub</Text>
          <Text style={styles.brandSpace}>space</Text>
        </View>
      </View>

      <View style={styles.railGroup}>
        {tabletSections.map(section => {
          const isActive = section.key === activeSection;

          return (
            <Pressable
              key={section.key}
              accessibilityRole="button"
              onPress={() => onSelectSection(section.key)}
              style={({pressed}) => [
                styles.railItem,
                isActive && styles.railItemActive,
                pressed && styles.railItemPressed,
              ]}>
              <View style={[styles.railDot, {backgroundColor: isActive ? section.accent : '#B7C6D9'}]} />
              <View style={styles.railCopy}>
                <Text style={[styles.railTitle, isActive && styles.railTitleActive]}>{section.title}</Text>
                <Text style={styles.railSubtitle}>{section.subtitle}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.railFooter}>
        <Text style={styles.railFooterLabel}>Tablet shell</Text>
        <Text style={styles.railFooterValue}>iPadOS enabled</Text>
      </View>
    </View>
  );
}

export default function TabletApp() {
  const [activeSection, setActiveSection] = useState<TabletSectionKey>('home');
  const [activeDetail, setActiveDetail] = useState<TabletDetailKey>('appointments');

  const goHome = () => setActiveSection('home');

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.safeArea}>
          <View style={styles.shell}>
            <TabletRail activeSection={activeSection} onSelectSection={setActiveSection} />
            <View style={styles.content}>
              {activeSection === 'home' ? (
                <TabletHomeScreen
                  activeDetail={activeDetail}
                  onNavigateSection={setActiveSection}
                  onOpenDetail={setActiveDetail}
                />
              ) : (
                <TabletSectionScreen
                  section={activeSection}
                  onNavigateHome={goHome}
                  onOpenDetail={setActiveDetail}
                  activeDetail={activeDetail}
                />
              )}
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F9FF',
  },
  shell: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F6F9FF',
  },
  rail: {
    width: 270,
    backgroundColor: '#FFFFFF',
    borderRightColor: '#E6EDF7',
    borderRightWidth: 1,
    padding: 22,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 34,
  },
  logo: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  brandName: {
    color: colors.primary,
    fontSize: 23,
    fontWeight: '700',
  },
  brandSpace: {
    color: colors.accent,
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  railGroup: {
    gap: 10,
  },
  railItem: {
    minHeight: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  railItemActive: {
    backgroundColor: '#FFE5F0',
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  railItemPressed: {
    transform: [{scale: 0.99}],
  },
  railDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  railCopy: {
    flex: 1,
  },
  railTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  railTitleActive: {
    color: colors.accent,
  },
  railSubtitle: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  railFooter: {
    marginTop: 'auto',
    borderColor: '#DDE8F5',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#FBFDFF',
  },
  railFooterLabel: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  railFooterValue: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  content: {
    flex: 1,
  },
});
