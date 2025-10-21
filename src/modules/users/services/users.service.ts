import {
    Injectable,
    ConflictException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { User } from '../entities/user.entity';
  import { CreateUserDto } from '../dto/create-user.dto';
  import { UpdateUserDto } from '../dto/update-user.dto';
  import * as bcrypt from 'bcrypt';
  
  @Injectable()
  export class UsersService {
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
    ) {}
  
    async create(createUserDto: CreateUserDto): Promise<User> {
      const existingUser = await this.findByEmail(createUserDto.email);
  
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
  
      const user = this.userRepository.create(createUserDto);
  
      if (createUserDto.password) {
        user.password = await this.hashPassword(createUserDto.password);
      }
  
      return this.userRepository.save(user);
    }
  
    async findByEmail(email: string): Promise<User | null> {
      return this.userRepository.findOne({
        where: { email },
        relations: ['oauthAccounts'],
      });
    }
  
    async findById(id: string): Promise<User> {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['oauthAccounts'],
      });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      return user;
    }
  
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
      const user = await this.findById(id);
  
      if (updateUserDto.password) {
        updateUserDto.password = await this.hashPassword(updateUserDto.password);
      }
  
      Object.assign(user, updateUserDto);
      return this.userRepository.save(user);
    }
  
    async validatePassword(
      plainPassword: string,
      hashedPassword: string,
    ): Promise<boolean> {
      return bcrypt.compare(plainPassword, hashedPassword);
    }
  
    private async hashPassword(password: string): Promise<string> {
      const saltRounds = 10;
      return bcrypt.hash(password, saltRounds);
    }
  
    async findAll(): Promise<User[]> {
      return this.userRepository.find();
    }
  
    async remove(id: string): Promise<void> {
      const user = await this.findById(id);
      await this.userRepository.remove(user);
    }
  }