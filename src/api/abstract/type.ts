export interface paperList {
  current: number;
  pages: number;
  size: number;
  total: number;
  records: Array<{}>;
}

export interface paper {
  absProp: string;
  absTitle: string;
  absType: string;
  allAuthor: string;
  allAuthorAffiliation: string;
}
