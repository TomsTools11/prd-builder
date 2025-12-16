export interface PRDFormData {
  productName: string;
  description: string;
  goals: string;
  targetAudience: string;
  features: string[];
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  base64?: string;
}

export interface PRDStats {
  sections: number;
  words: number;
  pages: number;
  characters: number;
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  currentSection?: string;
  error?: string;
}
