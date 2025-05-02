
export interface DonateItem {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  popular?: boolean;
  discount?: number;
  category: string;
}

export interface DonationCategory {
  id: string;
  label: string;
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
