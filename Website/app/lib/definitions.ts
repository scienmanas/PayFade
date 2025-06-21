export interface JWTPayloadType {
  email: string;
}

export interface RecordsType {
  id: string;
  website_name: string;
  website_url: string;
  api_key: string;
  hits: number;
  createdAt: string;
}
