export interface Profile {
  id?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  about?: string;
  title?: string;
  profileUrl?: string;
  thumbnail?: string;
  skills?: UserSkills;
  email?: string;
  password?: string;
  country?: string;
  nationality?: string;
}

export interface UserSkills {
  industryFocus: IndustryFocus[];
  domainFocus: DomainFocus[];
  regionalFocus: RegionalFocus[];
}

export interface IndustryFocus {
  areaOfFocusId: string;
}

export interface DomainFocus {
  domainId: string;
}

export interface RegionalFocus {
  regionId: string;
}
