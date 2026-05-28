/**
 * App global types
 */

export interface Message {
  id: string;
  name: string;
  location: string;
  message: string;
  date: string;
}

export interface StoryItem {
  id: string;
  number: string;
  title: string;
  description: string;
  detailedStory: string;
  linkText: string;
  linkUrl: string;
  suggestedVoice: string;
  recitationText: string;
}

export interface ReportItem {
  id: string;
  source: string;
  quote: string;
  category: string;
  author?: string;
  href?: string;
}

export interface ShirtDetail {
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  color: "Black" | "Vintage White" | "Charcoal";
  quantity: number;
}
