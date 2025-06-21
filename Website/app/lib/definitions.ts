export interface JWTPayloadType {
  id: string;
}

export interface RecordsType {
  id: string;
  websiteDomain: string;
  websiteUrl: string;
  apiKey: string;
  hits: number;
  createdAt: string;
}

export interface RecordsPostType {
  websiteName: string;
  websiteDomain: string;
}
