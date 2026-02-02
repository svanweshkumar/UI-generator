
export enum SectionType {
  NAVBAR = 'NAVBAR',
  HERO = 'HERO',
  FEATURES = 'FEATURES',
  CTA = 'CTA'
}

export type PrimaryColor = 'indigo' | 'sky' | 'rose' | 'emerald' | 'amber' | 'slate';

export interface SectionItem {
  title: string;
  description: string;
  icon?: string;
}

export interface SectionContent {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  items?: SectionItem[];
}

export interface UISection {
  id: string;
  type: SectionType;
  content: SectionContent;
}

export interface UISpec {
  name: string;
  theme: {
    primaryColor: PrimaryColor;
  };
  sections: UISection[];
}
