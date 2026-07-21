import React from 'react';
import {Alert, StyleSheet, Text} from 'react-native';
import {Card} from '../components/Card';
import {ListRow} from '../components/ListRow';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {SectionHeader} from '../components/SectionHeader';
import {colors} from '../theme/colors';

export function ProfileScreen() {
  return (
    <Screen>
      <SectionHeader title="Profile" subtitle="Patient identity, care team, and app settings." />
      <Card>
        <Text style={styles.name}>Sage Vish</Text>
        <Text style={styles.meta}>Patient ID: MHH-10024</Text>
        <ListRow title="Primary clinic" detail="Lexvora Health Clinic" />
        <ListRow title="Emergency contact" detail="+91 00000 00000" />
        <ListRow title="Language" detail="English" />
      </Card>
      <PrimaryButton
        label="Edit Profile"
        onPress={() => Alert.alert('Coming soon', 'Profile editing is not available yet.')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
});
