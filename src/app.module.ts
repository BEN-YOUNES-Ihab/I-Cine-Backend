import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, MoviesModule, CloudinaryModule, SessionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
