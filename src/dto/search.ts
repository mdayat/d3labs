interface SearchItemResponse {
  login: string;
  id: number;
  avatar_url: string;
}

interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: SearchItemResponse[];
}

export type { SearchResponse, SearchItemResponse };
