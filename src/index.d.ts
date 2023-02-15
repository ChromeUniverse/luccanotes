export type Note = {
  id: string;
  title: string;
  tags: Tag[];
  createdAt: Date;
  lastUpdated: Date;
};

export type TagsKeys =
  | "coding"
  | "music"
  | "school"
  | "general"
  | "tasks"
  | "work";
