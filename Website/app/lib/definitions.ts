export interface JWTPayloadType {
  id: string;
}

export interface RecordsType {
  id: string;
  websiteName: string;
  websiteDomain: string;
  apiKey: string;
  hits: number;
  createdAt: string;
  verified: boolean;
}

export interface RecordsPostType {
  websiteName: string;
  websiteDomain: string;
}
