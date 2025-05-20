export interface SearchQuery {
  country?: string;
  username?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface blogPostData {
  title: string;
  content: string;
  date_of_visit: string;
}
