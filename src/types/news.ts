export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: "update" | "event" | "announcement" | "bugfix";
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
}

export interface NewsCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}
