export interface ExternalAuthResponse {
  isSucceed: boolean;
  errorMessage: string;
  token: string;
  provider: string;
}
