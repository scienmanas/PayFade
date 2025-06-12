export interface OAuthData {
  provider: "google" | "github";
  token: string;
}

export interface WebsiteRecordData {
  id: string;
  website_name: string;
  website_url: string;
  api_key: string;
  hits: number;
  createdAt: string;
}
