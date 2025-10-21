import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { AuthProvider } from '../../users/entities/user.entity';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { id, username, emails, displayName, photos } = profile;

    // ✅ GitHub puede no retornar email si no es público
    const email = emails && emails[0]?.value 
      ? emails[0].value 
      : `${username}@github.local`;

    // ✅ Manejar displayName undefined
    const fullName = displayName || username || 'GitHub User';
    const [firstName, ...lastNameParts] = fullName.split(' ');

    // ✅ Manejar photos undefined
    const avatar = photos && photos[0]?.value ? photos[0].value : undefined;

    const oauthProfile: OAuthProfile = {
      provider: AuthProvider.GITHUB,
      providerId: id,
      email,
      firstName,
      lastName: lastNameParts.length > 0 ? lastNameParts.join(' ') : undefined,
      avatar,
      accessToken,
      refreshToken,
    };

    const user = await this.authService.validateOAuthUser(oauthProfile);

    done(null, user);
  }
}