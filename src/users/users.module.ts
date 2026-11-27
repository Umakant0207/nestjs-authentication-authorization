import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity.js';


@Module({
  imports:[ TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule], // Export it so that AuthModule can inject UserRepository
  providers: []
})
export class UsersModule {}
