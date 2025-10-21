// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { UsersService } from '../../users/services/users.service';
// import { TokenService } from './token.service';
// import { UnauthorizedException } from '@nestjs/common';
// import { User, AuthProvider, UserRole } from '../../users/entities/user.entity';

// describe('AuthService', () => {
//   let service: AuthService;
//   let usersService: UsersService;
//   let tokenService: TokenService;

//   const mockUsersService = {
//     findByEmail: jest.fn(),
//     create: jest.fn(),
//     validatePassword: jest.fn(),
//   };

//   const mockTokenService = {
//     generateAccessToken: jest.fn(),
//     generateRefreshToken: jest.fn(),
//     generateTokens: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         {
//           provide: UsersService,
//           useValue: mockUsersService,
//         },
//         {
//           provide: TokenService,
//           useValue: mockTokenService,
//         },
//       ],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//     usersService = module.get<UsersService>(UsersService);
//     tokenService = module.get<TokenService>(TokenService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('validateUser', () => {
//     it('should return user without password if credentials are valid', async () => {
//       const email = 'test@test.com';
//       const password = 'Password123!';
//       const user = {
//         id: '123',
//         email,
//         password: 'hashed_password',
//         role: UserRole.USER,
//       } as User;

//       mockUsersService.findByEmail.mockResolvedValue(user);
//       mockUsersService.validatePassword.mockResolvedValue(true);

//       const result = await service.validateUser(email, password);

//       expect(result).toBeDefined();
//       expect(result.password).toBeUndefined();
//       expect(result.email).toBe(email);
//     });

//     it('should return null if user not found', async () => {
//       mockUsersService.findByEmail.mockResolvedValue(null);

//       const result = await service.validateUser('wrong@test.com', 'password');

//       expect(result).toBeNull();
//     });

//     it('should return null if password is invalid', async () => {
//       const user = { id: '123', password: 'hashed' } as User;
//       mockUsersService.findByEmail.mockResolvedValue(user);
//       mockUsersService.validatePassword.mockResolvedValue(false);

//       const result = await service.validateUser('test@test.com', 'wrong');

//       expect(result).toBeNull();
//     });
//   });

//   describe('login', () => {
//     it('should return access and refresh tokens', async () => {
//       const user = { id: '123', email: 'test@test.com' } as User;
//       const tokens = {
//         accessToken: 'access_token',
//         refreshToken: 'refresh_token',
//       };

//       mockTokenService.generateTokens.mockResolvedValue(tokens);

//       const result = await service.login(user);

//       expect(result).toEqual(tokens);
//       expect(mockTokenService.generateTokens).toHaveBeenCalledWith(user);
//     });
//   });

//   describe('register', () => {
//     it('should create a new user and return tokens', async () => {
//       const registerDto = {
//         email: 'new@test.com',
//         password: 'Password123!',
//         firstName: 'John',
//         lastName: 'Doe',
//       };

//       const createdUser = {
//         id: '123',
//         ...registerDto,
//         role: UserRole.USER,
//       } as User;

//       const tokens = {
//         accessToken: 'access_token',
//         refreshToken: 'refresh_token',
//       };

//       mockUsersService.create.mockResolvedValue(createdUser);
//       mockTokenService.generateTokens.mockResolvedValue(tokens);

//       const result = await service.register(registerDto);

//       expect(result.user).toEqual(createdUser);
//       expect(result.tokens).toEqual(tokens);
//       expect(mockUsersService.create).toHaveBeenCalledWith(registerDto);
//     });
//   });
// });