export enum DifficultyLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced"
}

export interface BookRecommendation {
  title: string;
  author: string;
  reason: string; // Why this book?
  isCurrent?: boolean; // Is this the book the user searched for?
}

export interface LevelNode {
  levelName: DifficultyLevel;
  description: string; // What defines this level in this domain?
  books: BookRecommendation[];
  keyConcepts: string[]; // What concepts are learned here?
}

export interface RoadmapData {
  domain: string; // The identified category (e.g., "Behavioral Psychology")
  summary: string; // Brief overview of the domain
  userBookAnalysis: {
    title: string;
    assignedLevel: DifficultyLevel;
    gapAnalysis: string; // What is missing if they only read this book?
    nextSteps: string; // Immediate advice
  };
  roadmap: LevelNode[];
}

export interface SearchRequest {
  query: string;
  mode: 'book' | 'topic'; // User can search by a specific book or just a topic
}