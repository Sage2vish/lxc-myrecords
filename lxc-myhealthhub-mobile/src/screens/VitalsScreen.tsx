import React from 'react';
import {Alert, Text} from 'react-native';
import {Card} from '../components/Card';
import {ListRow} from '../components/ListRow';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {SectionHeader} from '../components/SectionHeader';
import {useVitals} from '../hooks/useHealthData';

export function VitalsScreen() {
  const {data = [], isLoading} = useVitals();

  return (
    <Screen>
      <SectionHeader title="Vitals" subtitle="Log and review key health measurements." />
      <PrimaryButton
        label="Add Vital Reading"
        onPress={() => Alert.alert('Coming soon', 'Manual vital entry is not available yet.')}
      />
      <Card>
        {isLoading ? <Text>Loading vitals...</Text> : null}
        {data.map(vital => (
          <ListRow
            key={vital.id}
            title={vital.label}
            detail={`${vital.value} • ${vital.recordedAt}`}
            meta={vital.trend}
          />
        ))}
      </Card>
    </Screen>
  );
}
