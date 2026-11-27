import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from '../auth/dto/register.dto.js';
import { LoginDto } from '../auth/dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from './decorators/roles.decorator.js';
import { Role } from '../users/user.entity.js';

@ApiTags('Authentication & Authorization')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({summary : 'Register a new user account'})
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    @ApiOperation({summary: 'Log in and receive a JWT access token'})
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    // PROTECTED ROUTE 1: Any logged in user (USER or ADMIN)
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({summary: 'Get logged in user profile (Any authenticated role)'})
    getProfile(@Request() req: any) {
        return {
            message: 'You are authenticated!',
            user: req.user
        }
    }

    // PROTECTED ROUTE 2: Logged in and must have 'admin' role
    @Get('admin-dashboard')
    @UseGuards(JwtAuthGuard, RolesGuard) // Order matters: Authenticate first, then Authorize
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({summary: 'Admin only endpoint (Requires admin role)'})
    getAdminData(@Request() req: any) {
        return {
            message: 'Welcome to admin dashboard',
            adminUser: req.user,
        }
    }
}
