type Note = {
  noteTitle: string;
  lastUpdated: string;
  tags: Tag[];
};
export type Tag = {
  label: string;
  color: TagColors;
};
