import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Screen} from '../components/Screen';

const records = [
  {icon: '▤', title: 'Blood Test Report', detail: '14 May 2024  ·  City Labs', tag: 'PDF', tone: '#e8f2ff'},
  {icon: '◉', title: 'X-Ray Chest', detail: '10 May 2024  ·  HealthScan', tag: 'DICOM', tone: '#f0ebff'},
  {icon: 'ℙ', title: 'Prescription', detail: 'Dr. Neha Sharma  ·  08 May 2024', tag: '2 Medicines', tone: '#e8f9f1'},
  {icon: '▣', title: 'Consultation Note', detail: 'Dr. Neha Sharma  ·  08 May 2024', tag: '', tone: '#ffedf5'},
];

export function HomeScreen() {
  return (
    <Screen scroll={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>✚</Text></View>
          <View style={styles.brandText}><Text style={styles.brandTitle}>MyHealthHub</Text><Text style={styles.brandSub}>Space</Text></View>
          <Text style={styles.headerIcon}>♧</Text><Text style={styles.headerIcon}>◉</Text>
        </View>

        <Text style={styles.title}>Health Vault <Text style={styles.verified}>●</Text></Text>
        <Text style={styles.subtitle}>Your records. Secure. Private. Always in your control.</Text>

        <View style={styles.actionRow}>
          <Action icon="▣" label="ABHA\nLinked" tone="#e8f2ff" />
          <Action icon="♧" label="Secure\nSharing" tone="#ffedf5" />
          <Action icon="♧" label="Consent\nManager" tone="#e8f9f1" />
          <Action icon="◷" label="Activity\nLog" tone="#f0ebff" />
        </View>

        <View style={styles.tabs}><Tab active label="All Records" /><Tab label="Reports" /><Tab label="Prescriptions" /><Tab label="Visits" /></View>
        {records.map(record => <RecordCard key={record.title} {...record} />)}

        <Text style={styles.sectionTitle}>Visit Timeline</Text>
        <View style={styles.timelineCard}><View style={styles.timelineDot} /><View><Text style={styles.detail}>08 May 2024  ·  11:00 AM</Text><Text style={styles.recordTitle}>Consultation with Dr. Neha Sharma</Text><Text style={styles.detail}>Cardiology  ·  Apollo Clinic</Text></View><Text style={styles.chevron}>›</Text></View>

        <View style={styles.bottomNav}><Nav icon="⌂" label="Home" tone="#e8f2ff" /><Nav icon="♡" label="Health" tone="#ffedf5" /><View style={styles.addButton}><Text style={styles.addText}>+</Text></View><Nav icon="▣" label="Vault" tone="#e8f9f1" active /><Nav icon="☰" label="More" tone="#f0ebff" /></View>
      </ScrollView>
    </Screen>
  );
}

function Action({icon, label, tone}: {icon: string; label: string; tone: string}) { return <TouchableOpacity style={[styles.action, {backgroundColor: tone}]}><Text style={styles.actionIcon}>{icon}</Text><Text style={styles.actionLabel}>{label}</Text></TouchableOpacity>; }
function Tab({label, active = false}: {label: string; active?: boolean}) { return <TouchableOpacity style={[styles.tab, active && styles.activeTab]}><Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text></TouchableOpacity>; }
function RecordCard({icon, title, detail, tag, tone}: {icon: string; title: string; detail: string; tag: string; tone: string}) { return <TouchableOpacity style={styles.record}><View style={[styles.recordIcon, {backgroundColor: tone}]}><Text style={styles.recordIconText}>{icon}</Text></View><View style={styles.recordBody}><Text style={styles.recordTitle}>{title}</Text><Text style={styles.detail}>{detail}</Text>{tag ? <Text style={styles.tag}>{tag}</Text> : null}</View><Text style={styles.chevron}>›</Text></TouchableOpacity>; }
function Nav({icon, label, tone, active = false}: {icon: string; label: string; tone: string; active?: boolean}) { return <TouchableOpacity style={styles.navItem}><View style={[styles.navIcon, {backgroundColor: tone}]}><Text style={[styles.navIconText, active && styles.activeNav]}>{icon}</Text></View><Text style={styles.navLabel}>{label}</Text></TouchableOpacity>; }

const styles = StyleSheet.create({
  content: {padding: 16, paddingBottom: 26, backgroundColor: '#f7f9fd'},
  header: {height: 94, borderRadius: 18, backgroundColor: '#0755ae', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, marginBottom: 26},
  brandMark: {width: 52, height: 52, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'},
  brandMarkText: {fontSize: 22, color: '#f23884'}, brandText: {flex: 1, marginLeft: 10}, brandTitle: {color: '#fff', fontSize: 17, fontWeight: '800'}, brandSub: {color: '#d7e7ff', fontSize: 12, marginTop: 1}, headerIcon: {fontSize: 22, color: '#fff', marginLeft: 15},
  title: {fontSize: 23, color: '#14284b', fontWeight: '800'}, verified: {fontSize: 12, color: '#24a66f'}, subtitle: {fontSize: 13, color: '#596574', marginTop: 4, marginBottom: 18},
  actionRow: {flexDirection: 'row', gap: 8, marginBottom: 18}, action: {flex: 1, minHeight: 90, borderRadius: 12, alignItems: 'center', justifyContent: 'center'}, actionIcon: {fontSize: 23, color: '#1769bd', marginBottom: 7}, actionLabel: {textAlign: 'center', color: '#213047', fontSize: 12, fontWeight: '700', lineHeight: 16},
  tabs: {height: 42, borderRadius: 13, backgroundColor: '#e5effb', flexDirection: 'row', alignItems: 'center', padding: 4, marginBottom: 13}, tab: {flex: 1, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 10}, activeTab: {backgroundColor: '#1266c2'}, tabText: {fontSize: 11, color: '#4e5d70'}, activeTabText: {color: '#fff', fontWeight: '800'},
  record: {minHeight: 82, borderRadius: 15, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e5eaf1'}, recordIcon: {width: 48, height: 48, borderRadius: 11, alignItems: 'center', justifyContent: 'center'}, recordIconText: {fontSize: 23, color: '#2773c7'}, recordBody: {flex: 1, marginLeft: 12}, recordTitle: {fontSize: 14, fontWeight: '800', color: '#253148'}, detail: {fontSize: 12, color: '#687486', marginTop: 3}, tag: {alignSelf: 'flex-start', backgroundColor: '#eee9ff', color: '#6552b6', fontSize: 11, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, marginTop: 4, borderRadius: 4}, chevron: {fontSize: 24, color: '#536174', paddingHorizontal: 5},
  sectionTitle: {fontSize: 18, color: '#14284b', fontWeight: '800', marginTop: 8, marginBottom: 10}, timelineCard: {minHeight: 90, borderRadius: 15, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', padding: 14, borderWidth: 1, borderColor: '#e5eaf1', marginBottom: 20}, timelineDot: {width: 12, height: 12, borderRadius: 6, borderWidth: 3, borderColor: '#ef4b92', marginRight: 12},
  bottomNav: {height: 98, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5eaf1', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 6, marginTop: 8}, navItem: {alignItems: 'center', justifyContent: 'center', width: 60, minHeight: 76}, navIcon: {width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center'}, navIconText: {fontSize: 21, color: '#1769bd'}, activeNav: {color: '#0755ae'}, navLabel: {fontSize: 11, color: '#536174', marginTop: 5}, addButton: {width: 62, height: 62, borderRadius: 31, backgroundColor: '#f23884', alignItems: 'center', justifyContent: 'center', marginTop: -20}, addText: {color: '#fff', fontSize: 36, fontWeight: '300'},
});
