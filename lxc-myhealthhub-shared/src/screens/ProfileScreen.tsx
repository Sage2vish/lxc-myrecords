import React from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {Card} from '../components/Card';
import {ListRow} from '../components/ListRow';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {SectionHeader} from '../components/SectionHeader';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

const profile = {
  title: 'Mr.',
  firstName: 'Sage',
  lastName: 'Vish',
  patientId: 'MHH-10024',
  dob: '14 Mar 1990',
  bloodGroup: 'O+',
  location: 'Bengaluru, Karnataka',
  mobile: '+91 98765 43210',
  email: 'sage.vish@example.com',
  address: '221B, Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
  abhaId: '14-1234-5678-9012',
  aadhaar: 'XXXX XXXX 4321',
};

const emergencyContact = {
  name: 'Rajesh Vish',
  relation: 'Father',
  phone: '+91 90000 00000',
};

const detailTiles = [
  {label: 'Title', value: profile.title, icon: '🏷'},
  {label: 'Date of Birth', value: profile.dob, icon: '🎂'},
  {label: 'Blood Group', value: profile.bloodGroup, icon: '🩸'},
  {label: 'Location', value: profile.location, icon: '📍'},
];

const comingSoon = () => Alert.alert('Coming soon', 'Profile editing is not available yet.');

export function ProfileScreen() {
  return (
    <Screen>
      <SectionHeader title="Profile" subtitle="Patient identity, care team, and app settings." />

      <View style={styles.hero}>
        <Pressable style={styles.photoWrap} onPress={comingSoon}>
          <View style={styles.photoCircle}>
            <Text style={styles.photoInitials}>
              {profile.firstName[0]}
              {profile.lastName[0]}
            </Text>
          </View>
          <View style={styles.photoEditBadge}>
            <Text style={styles.photoEditIcon}>✎</Text>
          </View>
        </Pressable>
        <Text style={styles.heroName}>
          {profile.title} {profile.firstName} {profile.lastName}
        </Text>
        <View style={styles.idPill}>
          <Text style={styles.idPillText}>Patient ID · {profile.patientId}</Text>
        </View>
      </View>

      <SectionHeader title="Personal Details" />
      <View style={styles.tileGrid}>
        {detailTiles.map(tile => (
          <View key={tile.label} style={styles.tile}>
            <Text style={styles.tileIcon}>{tile.icon}</Text>
            <Text style={styles.tileLabel}>{tile.label}</Text>
            <Text style={styles.tileValue}>{tile.value}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Contact Information" />
      <Card>
        <ListRow title="Mobile" detail={profile.mobile} />
        <ListRow title="Email" detail={profile.email} />
        <ListRow title="Address" detail={profile.address} />
      </Card>

      <SectionHeader title="Government IDs" subtitle="Used to verify identity with care providers." />
      <Card>
        <ListRow title="ABHA ID" detail={profile.abhaId} />
        <ListRow title="Aadhaar" detail={profile.aadhaar} />
      </Card>

      <SectionHeader title="Emergency Contact" />
      <View style={styles.emergencyCard}>
        <View style={styles.emergencyIcon}>
          <Text style={styles.emergencyIconText}>✚</Text>
        </View>
        <View style={styles.emergencyBody}>
          <Text style={styles.emergencyName}>
            {emergencyContact.name} · {emergencyContact.relation}
          </Text>
          <Text style={styles.emergencyPhone}>{emergencyContact.phone}</Text>
        </View>
      </View>

      <PrimaryButton label="Edit Profile" onPress={comingSoon} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    paddingVertical: spacing.lg,
  },
  photoWrap: {
    marginBottom: spacing.sm,
  },
  photoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  photoInitials: {
    color: colors.surface,
    fontSize: 30,
    fontWeight: '900',
  },
  photoEditBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primarySoft,
  },
  photoEditIcon: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '900',
  },
  heroName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  idPill: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  idPillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  tile: {
    width: '48.5%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {height: 3, width: 0},
    elevation: 1,
  },
  tileIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  tileLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  tileValue: {
    marginTop: 2,
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: 16,
    padding: spacing.md,
  },
  emergencyIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emergencyIconText: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '900',
  },
  emergencyBody: {
    flex: 1,
  },
  emergencyName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  emergencyPhone: {
    marginTop: 2,
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
});
