import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    Index,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  
  @Entity('refresh_tokens')
  @Index(['token'], { unique: true })
  export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    token: string;
  
    @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
    user: User;
  
    @Column({ name: 'expires_at' })
    expiresAt: Date;
  
    @Column({ name: 'is_revoked', default: false })
    isRevoked: boolean;
  
    @Column({ nullable: true })
    ip?: string;
  
    @Column({ name: 'user_agent', nullable: true })
    userAgent?: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    isExpired(): boolean {
      return new Date() > this.expiresAt;
    }
  
    isValid(): boolean {
      return !this.isRevoked && !this.isExpired();
    }
  }