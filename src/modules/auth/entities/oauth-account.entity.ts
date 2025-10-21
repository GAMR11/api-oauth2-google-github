import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User, AuthProvider } from '../../users/entities/user.entity';

@Entity('oauth_accounts')
@Index(['provider', 'providerId'], { unique: true })
export class OAuthAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ✅ Alternativa: usar varchar en lugar de enum
  @Column({
    type: 'varchar',
    length: 50,
  })
  provider: AuthProvider;

  @Column({ name: 'provider_id' })
  providerId: string;

  @Column({ name: 'access_token', nullable: true })
  accessToken?: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;

  @Column({ type: 'jsonb', nullable: true })
  profile?: Record<string, any>;

  @ManyToOne(() => User, (user) => user.oauthAccounts, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}