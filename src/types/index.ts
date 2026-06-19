export type Category = 'weddings' | 'restaurant';

export interface Template {
  id: string;
  name: string;
  category: Category;
  description: string;
  longDescription: string;
  previewVideo: string;
  images: string[];
  price: number;
  features: string[];
  techStack: string[];
  livePreviewUrl?: string;
}

export interface CartItem {
  templateId: string;
  template: Template;
}
