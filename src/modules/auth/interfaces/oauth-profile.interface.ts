import { AuthProvider } from '../../users/entities/user.entity';

export interface OAuthProfile {
  provider: AuthProvider;
  providerId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  accessToken: string;
  refreshToken?: string;
}