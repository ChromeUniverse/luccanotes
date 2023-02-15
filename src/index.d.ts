export type Note = {
  id: string;
  title: string;
  tags: Tag[];
  createdAt: Date;
  lastUpdated: Date;
};
