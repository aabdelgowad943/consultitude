// Add this to a shared models folder (e.g., src/app/models/response-depth.enum.ts)

export enum ResponseDepth {
  Basic = 2,
  Advanced = 3,
  Expert = 5,
}

// Helper function to convert string ID to enum value
export function getResponseDepthValue(depthId: string): ResponseDepth {
  switch (depthId.toLowerCase()) {
    case 'basic':
      return ResponseDepth.Basic;
    case 'advanced':
      return ResponseDepth.Advanced;
    case 'expert':
      return ResponseDepth.Expert;
    default:
      return ResponseDepth.Advanced; // Default to Advanced if invalid
  }
}

// Helper function to convert enum value to string ID
export function getResponseDepthString(depthValue: ResponseDepth): string {
  switch (depthValue) {
    case ResponseDepth.Basic:
      return 'basic';
    case ResponseDepth.Advanced:
      return 'advanced';
    case ResponseDepth.Expert:
      return 'expert';
    default:
      return 'advanced';
  }
}
