export interface JWTPayloadType {
  id: string;
}

export interface RecordsType {
  id: string;
  website_name: string;
  website_url: string;
  api_key: string;
  hits: number;
  createdAt: string;
}
