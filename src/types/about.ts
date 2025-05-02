
export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  description: string;
}

export interface ServerFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ServerRule {
  category: string;
  items: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}
