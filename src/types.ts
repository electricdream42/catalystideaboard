export interface Idea {
  id: string;
  title: string;
  description: string;
  author: string;
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
}