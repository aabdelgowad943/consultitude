export interface Agent {
  id?: string;
  name: string;
  sectors: string;
  domains: string;
  output: string;

  persona?: string;
  domain?: string;
  location?: string;
  profileId?: string;
}
