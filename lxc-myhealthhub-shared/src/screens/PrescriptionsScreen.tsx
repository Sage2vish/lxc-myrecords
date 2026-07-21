import React from 'react';
import {Text} from 'react-native';
import {Card} from '../components/Card';
import {ListRow} from '../components/ListRow';
import {Screen} from '../components/Screen';
import {SectionHeader} from '../components/SectionHeader';
import {usePrescriptions} from '../hooks/useHealthData';

export function PrescriptionsScreen() {
  const {data = [], isLoading} = usePrescriptions();

  return (
    <Screen>
      <SectionHeader title="Prescriptions" subtitle="Track medicines, schedules, and reminders." />
      <Card>
        {isLoading ? <Text>Loading prescriptions...</Text> : null}
        {data.map(prescription => (
          <ListRow
            key={prescription.id}
            title={`${prescription.medicine} ${prescription.dosage}`}
            detail={prescription.schedule}
            meta={prescription.until}
          />
        ))}
      </Card>
    </Screen>
  );
}
