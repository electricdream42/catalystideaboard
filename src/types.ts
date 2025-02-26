export interface Idea {
  id: string;
  title: string;
  description: string;
  author: string;
  organization: string;
  votes: number;
  created_at: Date | string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  created_at: Date | string;
}

export interface IdeaFormData {
  title: string;
  description: string;
  author: string;
  organization: string;
}

export type Organization = 
  | "Swasti" 
  | "Vrutti" 
  | "Fuzhio" 
  | "Green Foundation" 
  | "Catalyst Foundation" 
  | "Catalyst Group"
  | "Solvist Financial Services" 
  | "Impact Catalysts Foundation";

export const ORGANIZATIONS: Organization[] = [
  "Catalyst Group",
  "Swasti",
  "Vrutti",
  "Fuzhio",
  "Green Foundation",
  "Catalyst Foundation",
  "Solvist Financial Services",
  "Impact Catalysts Foundation"
];