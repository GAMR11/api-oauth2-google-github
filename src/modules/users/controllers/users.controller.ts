import {
    Controller,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
  } from '@nestjs/common';
  import { UsersService } from '../services/users.service';
  import { UpdateUserDto } from '../dto/update-user.dto';
  import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../../auth/guards/roles.guard';
  import { Roles } from '../../auth/decorators/roles.decorator';
  import { CurrentUser } from '../../auth/decorators/current-user.decorator';
  import { UserRole, User } from '../entities/user.entity';
  
  @Controller('users')
  @UseGuards(JwtAuthGuard)
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    /**
     * GET /users/me
     * Obtener perfil propio
     */
    @Get('me')
    getMe(@CurrentUser() user: User) {
      return user;
    }
  
    /**
     * PATCH /users/me
     * Actualizar perfil propio
     */
    @Patch('me')
    updateMe(
      @CurrentUser('id') userId: string,
      @Body() updateUserDto: UpdateUserDto,
    ) {
      return this.usersService.update(userId, updateUserDto);
    }
  
    /**
     * GET /users
     * Listar todos los usuarios (solo admins)
     */
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    findAll() {
      return this.usersService.findAll();
    }
  
    /**
     * GET /users/:id
     * Obtener usuario por ID (solo admins)
     */
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.usersService.findById(id);
    }
  
    /**
     * PATCH /users/:id
     * Actualizar usuario (solo admins)
     */
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.update(id, updateUserDto);
    }
  
    /**
     * DELETE /users/:id
     * Eliminar usuario (solo admins)
     */
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.usersService.remove(id);
    }
  }