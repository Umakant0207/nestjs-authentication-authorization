import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, Role } from '../users/user.entity.js';
import { RegisterDto } from '../auth/dto/register.dto.js';
import { LoginDto } from '../auth/dto/login.dto.js';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async register(dto: RegisterDto) {
        // 1. check if email is already present
        const existingUser = await this.userRepo.findOne({
            where: { email: dto.email.toLowerCase() }
        });
        if (existingUser) {
            throw new ConflictException('Email is already registered');
        }

        // 2. Hash the password (10 salt rounds is the industry standards)
        const hashedPassword = await bcrypt.hash(dto.password , 10);

        // 3. Create and Save the user 
        const user = this.userRepo.create({
            email: dto.email.toLowerCase(),
            password: hashedPassword,
            role: dto.role || Role.USER,
        })
        const savedUser =  await this.userRepo.save(user);

        // 4. Never return the password to the frontend, only return the result without password
        const {password , ... result } = savedUser;
        return result;
    }

    async login(dto: LoginDto) {
        // 1. Find user by email
        const user = await this.userRepo.findOne({
            where: { email : dto.email.toLowerCase() }
        })

        // 2. Compare the submitted password with stored bcrypt hash
        const isPasswordValid = user ? await bcrypt.compare(dto.password , user.password): false;

        if (!user || !isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // 3. Create JWT payload and sign the token
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        }

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        }
    }

}
