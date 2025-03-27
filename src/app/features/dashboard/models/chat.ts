export interface Chat {
  title: string;
  threadId?: string; // send null if not available
  serviceId: string;
  ownerId: string; // profileId from local storage
  ask: string;
  agents: string[]; // Array of agent IDs
  documents: string[]; // Array of document URLs
}
