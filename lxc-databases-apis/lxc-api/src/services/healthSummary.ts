export type HealthSummaryMetadata = {
  profileId: string;
  dataClassification: 'Sensitive Medical Data';
  consentRequired: boolean;
  encryptionStatus: 'Encrypted at rest and in transit';
  auditLoggingStatus: 'Enabled';
  retentionPolicy: string;
};

export type HealthCondition = {
  conditionId: string;
  profileId: string;
  name: string;
  status: 'active' | 'inactive' | 'resolved';
  diagnosedAt: string;
  notes: string;
};

export type Allergy = {
  allergyId: string;
  profileId: string;
  allergen: string;
  severity: 'low' | 'medium' | 'high';
  reaction: string;
};

export type VitalSign = {
  vitalId: string;
  profileId: string;
  type: 'blood-pressure' | 'blood-glucose' | 'weight-bmi' | 'heart-rate';
  measuredAt: string;
  value: string;
  unit: string;
};

const summaryMetadata: HealthSummaryMetadata = {
  profileId: 'profile-self-001',
  dataClassification: 'Sensitive Medical Data',
  consentRequired: true,
  encryptionStatus: 'Encrypted at rest and in transit',
  auditLoggingStatus: 'Enabled',
  retentionPolicy: 'Retain for 7 years from the last activity date',
};

const conditions: HealthCondition[] = [
  {
    conditionId: 'cond-001',
    profileId: 'profile-self-001',
    name: 'Asthma',
    status: 'active',
    diagnosedAt: '2021-05-10',
    notes: 'Mild seasonal symptoms, inhaler as needed.',
  },
];

const allergies: Allergy[] = [
  {
    allergyId: 'allergy-001',
    profileId: 'profile-self-001',
    allergen: 'Peanuts',
    severity: 'high',
    reaction: 'Shortness of breath and swelling',
  },
];

const vitals: VitalSign[] = [
  {
    vitalId: 'vital-001',
    profileId: 'profile-self-001',
    type: 'blood-pressure',
    measuredAt: '2026-08-02T08:30:00+04:00',
    value: '118/76',
    unit: 'mmHg',
  },
  {
    vitalId: 'vital-002',
    profileId: 'profile-self-001',
    type: 'heart-rate',
    measuredAt: '2026-08-02T08:30:00+04:00',
    value: '72',
    unit: 'bpm',
  },
];

export function getHealthSummary(profileId: string) {
  return {
    profileId,
    summary: {
      wellnessScore: 86,
      riskLevel: 'low',
      recentActivity: ['Logged daily vitals', 'Updated allergy profile', 'Reviewed care plan'],
      medicationSummary: ['No active medication concerns'],
    },
    metadata: summaryMetadata,
  };
}

export function listHealthConditions(profileId: string) {
  return {
    profileId,
    count: conditions.filter((item) => item.profileId === profileId).length,
    items: conditions.filter((item) => item.profileId === profileId),
  };
}

export function addHealthCondition(profileId: string, input: Partial<HealthCondition>) {
  const item: HealthCondition = {
    conditionId: input.conditionId ?? `cond-${conditions.length + 1}`.padStart(7, '0'),
    profileId,
    name: input.name ?? 'Condition',
    status: input.status ?? 'active',
    diagnosedAt: input.diagnosedAt ?? new Date().toISOString().slice(0, 10),
    notes: input.notes ?? '',
  };
  conditions.push(item);
  return item;
}

export function listAllergies(profileId: string) {
  return {
    profileId,
    count: allergies.filter((item) => item.profileId === profileId).length,
    items: allergies.filter((item) => item.profileId === profileId),
  };
}

export function listVitals(profileId: string) {
  return {
    profileId,
    count: vitals.filter((item) => item.profileId === profileId).length,
    items: vitals.filter((item) => item.profileId === profileId),
    metadata: summaryMetadata,
  };
}

export function addVital(profileId: string, input: Partial<VitalSign>) {
  const item: VitalSign = {
    vitalId: input.vitalId ?? `vital-${vitals.length + 1}`.padStart(7, '0'),
    profileId,
    type: input.type ?? 'blood-pressure',
    measuredAt: input.measuredAt ?? new Date().toISOString(),
    value: input.value ?? '',
    unit: input.unit ?? '',
  };
  vitals.push(item);
  return item;
}

export function getHealthScore(profileId: string) {
  return {
    profileId,
    wellnessScore: 86,
    riskLevel: 'low',
    riskFactors: ['No active medication concerns', 'Allergy profile up to date'],
    metadata: summaryMetadata,
  };
}
