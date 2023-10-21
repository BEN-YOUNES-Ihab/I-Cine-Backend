import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SessionsModule } from './sessions/sessions.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, MoviesModule, CloudinaryModule, SessionsModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
