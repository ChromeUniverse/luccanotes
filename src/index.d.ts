type Note = {
  title: string;
  tags: Tag[];
  createdAt: Date;
  lastUpdated: Date;
};
export type Tag = {
  label: string;
  color: TagColors;
};
