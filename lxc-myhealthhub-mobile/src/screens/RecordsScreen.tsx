import React from 'react';
import {Text} from 'react-native';
import {Card} from '../components/Card';
import {ListRow} from '../components/ListRow';
import {Screen} from '../components/Screen';
import {SectionHeader} from '../components/SectionHeader';
import {useRecords} from '../hooks/useHealthData';

export function RecordsScreen() {
  const {data = [], isLoading} = useRecords();

  return (
    <Screen>
      <SectionHeader title="Medical Records" subtitle="Lab reports, diagnoses, and care summaries." />
      <Card>
        {isLoading ? <Text>Loading records...</Text> : null}
        {data.map(record => (
          <ListRow
            key={record.id}
            title={record.title}
            detail={`${record.provider} • ${record.summary}`}
            meta={record.date}
          />
        ))}
      </Card>
    </Screen>
  );
}
