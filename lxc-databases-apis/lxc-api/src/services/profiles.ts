export type FamilyMember = {
  profileId: string;
  relation: 'self' | 'child' | 'spouse' | 'parent' | 'dependent' | 'caregiver';
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  language: string;
  preferredContact: string;
  emergencyContact: string;
  address: string;
  profilePictureUrl?: string;
  caregiverAccess: boolean;
  sharingEnabled: boolean;
};

export type Profile = {
  profileId: string;
  userId: string;
  fullName: string;
  displayName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  profilePictureUrl?: string;
  language: string;
  timezone: string;
  caregiverAccess: boolean;
  sharingEnabled: boolean;
};

const selfProfile: Profile = {
  profileId: 'profile-self-001',
  userId: 'usr_demo',
  fullName: 'Priya Kumar',
  displayName: 'Priya',
  dateOfBirth: '1992-04-12',
  gender: 'female',
  email: 'priya@example.com',
  phone: '+971501112233',
  address: 'Downtown Dubai, UAE',
  emergencyContact: '+971501112244',
  profilePictureUrl: 'https://example.com/profile/priya.jpg',
  language: 'English',
  timezone: 'Asia/Dubai',
  caregiverAccess: false,
  sharingEnabled: true,
};

const familyMembers: FamilyMember[] = [
  {
    profileId: 'profile-child-001',
    relation: 'child',
    name: 'Ayaan Kumar',
    age: 7,
    gender: 'male',
    language: 'English',
    preferredContact: '+971501112233',
    emergencyContact: '+971501112244',
    address: 'Downtown Dubai, UAE',
    profilePictureUrl: 'https://example.com/profile/ayaan.jpg',
    caregiverAccess: true,
    sharingEnabled: true,
  },
  {
    profileId: 'profile-parent-001',
    relation: 'parent',
    name: 'Kavita Kumar',
    age: 64,
    gender: 'female',
    language: 'Hindi',
    preferredContact: '+971501112255',
    emergencyContact: '+971501112233',
    address: 'Jumeirah, Dubai, UAE',
    caregiverAccess: true,
    sharingEnabled: false,
  },
];

function updateProfileBase(profileId: string) {
  return {
    profileId,
    updatedAt: new Date().toISOString(),
  };
}

export function getCurrentUserProfile() {
  return selfProfile;
}

export function updateCurrentUserProfile(input: Partial<Profile>) {
  Object.assign(selfProfile, input);
  return {
    profile: selfProfile,
    ...updateProfileBase(selfProfile.profileId),
  };
}

export function listCurrentUserFamily() {
  return {
    profileId: selfProfile.profileId,
    items: familyMembers,
    count: familyMembers.length,
  };
}

export function addFamilyMember(input: Partial<FamilyMember>) {
  const member: FamilyMember = {
    profileId: input.profileId ?? `profile-family-${familyMembers.length + 1}`,
    relation: input.relation ?? 'dependent',
    name: input.name ?? 'Family Member',
    age: input.age ?? 0,
    gender: input.gender ?? 'other',
    language: input.language ?? selfProfile.language,
    preferredContact: input.preferredContact ?? selfProfile.phone,
    emergencyContact: input.emergencyContact ?? selfProfile.emergencyContact,
    address: input.address ?? selfProfile.address,
    profilePictureUrl: input.profilePictureUrl,
    caregiverAccess: input.caregiverAccess ?? false,
    sharingEnabled: input.sharingEnabled ?? true,
  };

  familyMembers.push(member);
  return member;
}

export function getProfileById(profileId: string) {
  if (profileId === selfProfile.profileId) {
    return selfProfile;
  }

  return familyMembers.find((member) => member.profileId === profileId) ?? null;
}

export function updateProfileById(profileId: string, input: Partial<Profile> | Partial<FamilyMember>) {
  if (profileId === selfProfile.profileId) {
    return updateCurrentUserProfile(input as Partial<Profile>);
  }

  const member = familyMembers.find((item) => item.profileId === profileId);
  if (!member) {
    return null;
  }

  Object.assign(member, input);
  return {
    profile: member,
    ...updateProfileBase(profileId),
  };
}

export function shareProfile(profileId: string) {
  const profile = getProfileById(profileId);
  if (!profile) {
    return null;
  }

  return {
    profileId,
    sharingEnabled: true,
    shareCode: `share_${profileId}`,
    sharedAt: new Date().toISOString(),
  };
}
