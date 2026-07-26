// ============================================================================
// FILE        : AppSettingsScreen.tsx
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 26-July-2026 | 00:00 Hrs
//
// PURPOSE     : Premium App Settings screen for MyHealthHub. Exposes health
//               integrations, behavior toggles, privacy actions, and support
//               cards in a wallet-like layout.
// ============================================================================

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {useRoute, type RouteProp} from '@react-navigation/native';
import {Card} from '../../components/Card';
import {Screen} from '../../components/Screen';
import {SectionHeader} from '../../components/SectionHeader';
import {colors} from '../../theme/colors';
import {commonTheme} from '../../theme/common';
import {fontSizes, fontWeights} from '../../theme/typography';
import {radii} from '../../theme/radii';
import {spacing} from '../../theme/spacing';
import type {RootTabParamList} from '../../navigation/RootNavigator';
import {
  behaviorDefaults,
  behaviorRows,
  healthIntegrations,
  privacyActions,
  supportActions,
  type SettingsSectionKey,
} from './settingsData';

type Route = RouteProp<RootTabParamList, 'Settings'>;

type ToggleState = Record<keyof typeof behaviorDefaults, boolean>;

function sectionTitle(section: SettingsSectionKey) {
  switch (section) {
    case 'integrations':
      return 'Health Integrations';
    case 'behavior':
      return 'App Behavior';
    case 'privacy':
      return 'Data & Privacy';
    case 'support':
      return 'Support & More';
  }
}

function sectionSubtitle(section: SettingsSectionKey) {
  switch (section) {
    case 'integrations':
      return 'Connect the devices that can feed your health timeline.';
    case 'behavior':
      return 'Tune the quick behaviors that shape the app experience.';
    case 'privacy':
      return 'Keep consent, data visibility, and exports in one place.';
    case 'support':
      return 'Help, product updates, and sharing tools for the app.';
  }
}

export function AppSettingsScreen() {
  const route = useRoute<Route>();
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<SettingsSectionKey, number>>({
    integrations: 0,
    behavior: 0,
    privacy: 0,
    support: 0,
  });
  const [toggles, setToggles] = useState<ToggleState>(behaviorDefaults);
  const focusSection = route.params?.section;

  useEffect(() => {
    if (!focusSection) {
      return;
    }

    const timer = requestAnimationFrame(() => {
      const y = sectionOffsets.current[focusSection];
      scrollRef.current?.scrollTo({y: Math.max(y - 16, 0), animated: true});
    });

    return () => cancelAnimationFrame(timer);
  }, [focusSection]);

  const healthSummary = useMemo(
    () => [
      {label: 'Device', value: 'Mobile-first', tone: colors.primarySoft},
      {label: 'Sync', value: 'Ready', tone: colors.accentSoft},
      {label: 'Privacy', value: 'Controlled', tone: colors.purpleSoft},
    ],
    [],
  );

  const handleConnect = (title: string) => {
    Alert.alert(title, 'Connection flow can be wired to the native health provider later.');
  };

  const handleToggle = (key: keyof ToggleState) => {
    setToggles(current => ({...current, [key]: !current[key]}));
  };

  const handleAction = (title: string) => {
    Alert.alert(title, 'This control is ready for its native or backend implementation.');
  };

  return (
    <Screen scroll={false}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.kicker}>App Settings</Text>
              <Text style={styles.heroTitle}>Wallet-style controls for the app experience.</Text>
            </View>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>MyHealthHub</Text>
            </View>
          </View>
          <Text style={styles.heroCopy}>
            Keep the drawer, health integrations, privacy, and small behavioral choices in
            one place so the product feels premium and predictable.
          </Text>
          <View style={styles.summaryRow}>
            {healthSummary.map(item => (
              <View key={item.label} style={[styles.summaryChip, {backgroundColor: item.tone}]}>
                <Text style={styles.summaryLabel}>{item.label}</Text>
                <Text style={styles.summaryValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View
          onLayout={event => {
            sectionOffsets.current.integrations = event.nativeEvent.layout.y;
          }}>
          <SectionHeader
            title={sectionTitle('integrations')}
            subtitle={sectionSubtitle('integrations')}
          />
          <View style={styles.integrationGrid}>
            {healthIntegrations.map(card => (
              <Card key={card.key}>
                <View style={styles.integrationCard}>
                  <View style={[styles.integrationGlyph, {backgroundColor: card.tone}]}>
                    <Text style={styles.integrationGlyphText}>{card.glyph}</Text>
                  </View>
                  <View style={styles.integrationCopy}>
                    <View style={styles.integrationTitleRow}>
                      <Text style={styles.integrationTitle}>{card.title}</Text>
                      <View style={styles.integrationPill}>
                        <Text style={styles.integrationPillText}>{card.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.integrationSubtitle}>{card.subtitle}</Text>
                    <View style={styles.chipRow}>
                      {card.chips.map(chip => (
                        <View key={chip} style={styles.chip}>
                          <Text style={styles.chipText}>{chip}</Text>
                        </View>
                      ))}
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handleConnect(card.title)}
                      style={({pressed}) => [styles.primaryButton, pressed && styles.pressed]}>
                      <Text style={styles.primaryButtonText}>{card.actionLabel}</Text>
                    </Pressable>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </View>

        <View
          onLayout={event => {
            sectionOffsets.current.behavior = event.nativeEvent.layout.y;
          }}>
          <SectionHeader title={sectionTitle('behavior')} subtitle={sectionSubtitle('behavior')} />
          <Card>
            <View style={styles.toggleCard}>
              {behaviorRows.map((row, index) => (
                <View
                  key={row.key}
                  style={[styles.toggleRow, index !== behaviorRows.length - 1 && styles.rowDivider]}>
                  <View style={styles.toggleCopy}>
                    <Text style={styles.toggleTitle}>{row.title}</Text>
                    <Text style={styles.toggleSubtitle}>{row.subtitle}</Text>
                  </View>
                  <Switch
                    accessibilityLabel={row.title}
                    value={toggles[row.key]}
                    onValueChange={() => handleToggle(row.key)}
                    trackColor={{false: '#D7E3F0', true: colors.primarySoft}}
                    thumbColor={toggles[row.key] ? colors.primary : '#ffffff'}
                    ios_backgroundColor="#D7E3F0"
                  />
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View
          onLayout={event => {
            sectionOffsets.current.privacy = event.nativeEvent.layout.y;
          }}>
          <SectionHeader title={sectionTitle('privacy')} subtitle={sectionSubtitle('privacy')} />
          <View style={styles.actionGrid}>
            {privacyActions.map(action => (
              <Pressable
                key={action.key}
                accessibilityRole="button"
                onPress={() => handleAction(action.title)}
                style={({pressed}) => [styles.actionCard, pressed && styles.pressed]}>
                <View style={[styles.actionGlyph, {backgroundColor: action.accent}]}>
                  <Text style={styles.actionGlyphText}>{action.glyph}</Text>
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View
          onLayout={event => {
            sectionOffsets.current.support = event.nativeEvent.layout.y;
          }}>
          <SectionHeader title={sectionTitle('support')} subtitle={sectionSubtitle('support')} />
          <Card>
            {supportActions.map((action, index) => (
              <Pressable
                key={action.key}
                accessibilityRole="button"
                onPress={() => handleAction(action.title)}
                style={({pressed}) => [
                  styles.supportRow,
                  index !== supportActions.length - 1 && styles.rowDivider,
                  pressed && styles.supportRowPressed,
                ]}>
                <View style={styles.supportLeft}>
                  <View style={[styles.supportGlyph, {backgroundColor: action.accent}]}>
                    <Text style={styles.supportGlyphText}>{action.glyph}</Text>
                  </View>
                  <View style={styles.supportCopy}>
                    <View style={styles.supportTitleRow}>
                      <Text style={styles.supportTitle}>{action.title}</Text>
                      {action.badge ? <Text style={styles.supportBadge}>{action.badge}</Text> : null}
                    </View>
                    <Text style={styles.supportSubtitle}>{action.subtitle}</Text>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            ))}
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: commonTheme.settings.sectionGap,
    paddingBottom: spacing.xl,
  },
  hero: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: commonTheme.cards.radius,
    borderWidth: 1,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 10},
    elevation: 2,
  },
  heroTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  kicker: {
    color: colors.accent,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.extrabold800,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: fontWeights.extrabold800,
    maxWidth: 260,
    marginTop: spacing.xs,
  },
  heroPill: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  heroPillText: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.extrabold700,
  },
  heroCopy: {
    color: colors.muted,
    fontSize: fontSizes.lg,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  summaryChip: {
    flex: 1,
    borderRadius: 16,
    padding: spacing.md,
  },
  summaryLabel: {
    color: colors.text,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.extrabold700,
    letterSpacing: 0.4,
    opacity: 0.72,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.extrabold800,
    marginTop: 4,
  },
  integrationGrid: {
    gap: spacing.md,
  },
  integrationCard: {
    gap: spacing.md,
  },
  integrationGlyph: {
    alignItems: 'center',
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  integrationGlyphText: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: fontWeights.extrabold800,
  },
  integrationCopy: {
    gap: spacing.sm,
  },
  integrationTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  integrationTitle: {
    color: colors.text,
    flex: 1,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold800,
  },
  integrationPill: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  integrationPillText: {
    color: colors.accent,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.extrabold700,
  },
  integrationSubtitle: {
    color: colors.muted,
    fontSize: fontSizes.lg,
    lineHeight: 21,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  chipText: {
    color: colors.primaryDark,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.extrabold700,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 11,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.extrabold700,
  },
  toggleCard: {
    overflow: 'hidden',
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: 14,
  },
  rowDivider: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  toggleCopy: {
    flex: 1,
    gap: 4,
  },
  toggleTitle: {
    color: colors.text,
    fontSize: fontSizes.lg16,
    fontWeight: fontWeights.extrabold700,
  },
  toggleSubtitle: {
    color: colors.muted,
    fontSize: fontSizes.lg,
    lineHeight: 20,
  },
  actionGrid: {
    gap: spacing.sm,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: commonTheme.cards.radius,
    borderWidth: 1,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 1,
  },
  actionGlyph: {
    alignItems: 'center',
    borderRadius: 18,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  actionGlyphText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: fontWeights.extrabold800,
  },
  actionTitle: {
    color: colors.text,
    fontSize: fontSizes.lg16,
    fontWeight: fontWeights.extrabold800,
    marginTop: spacing.sm,
  },
  actionSubtitle: {
    color: colors.muted,
    fontSize: fontSizes.lg,
    lineHeight: 20,
    marginTop: 4,
  },
  supportRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: 14,
  },
  supportRowPressed: {
    opacity: 0.7,
  },
  supportLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  supportGlyph: {
    alignItems: 'center',
    borderRadius: 18,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  supportGlyphText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: fontWeights.extrabold800,
  },
  supportCopy: {
    flex: 1,
    gap: 3,
  },
  supportTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  supportTitle: {
    color: colors.text,
    flex: 1,
    fontSize: fontSizes.lg16,
    fontWeight: fontWeights.extrabold800,
  },
  supportBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    color: colors.accent,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.extrabold800,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  supportSubtitle: {
    color: colors.muted,
    fontSize: fontSizes.lg,
    lineHeight: 20,
  },
  chevron: {
    color: colors.muted,
    fontSize: 26,
    marginTop: -2,
  },
  pressed: {
    opacity: 0.72,
  },
});

