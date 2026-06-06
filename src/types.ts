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

export interface EmailSignupData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  agreed_to_terms: boolean;
  created_at: string;
  source: string;
}

export interface EmailSignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  agreedToTerms: boolean;
}

export interface EmailSignupResponse {
  id: string;
  message: string;
  email: string;
}
