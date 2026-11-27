import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role, User } from '../../users/user.entity.js';

export class RegisterDto {
    @ApiProperty({ example : 'abc@gmail.com'})
    @IsEmail()
    email: string;

    @ApiProperty({example : 'StrongPass@123', minLength: 6})
    @IsString()
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    password: string;

    @ApiProperty({enum: Role, default: Role.USER, required: false})
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}