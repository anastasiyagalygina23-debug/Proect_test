export type StyleOption = {
  id: string;
  title: string;
  description: string;
  promptFragment: string;
  mood: string;
};

export type ShotPlan = {
  id: string;
  caption: string;
  prompt: string;
  aspectRatio: "3:4" | "4:5" | "1:1";
};

export type AnalyzeResult = {
  sessionId: string;
  interpretedWish: string;
  masterPrompt: string;
  styles: StyleOption[];
  shots: ShotPlan[];
};

export type GeneratedShot = {
  id: string;
  caption: string;
  url: string;
  prompt: string;
};

export type GallerySession = {
  id: string;
  createdAt: string;
  wish: string;
  styleTitle: string;
  selfieUrl: string;
  interpretedWish: string;
  masterPrompt: string;
  shots: GeneratedShot[];
  demo: boolean;
};
