import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SessionsModule } from './sessions/sessions.module';
<<<<<<< HEAD
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, MoviesModule, CloudinaryModule, SessionsModule, OrdersModule],
=======
import { PayementModule } from './payement/payement.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    MoviesModule,
    CloudinaryModule,
    SessionsModule,
    PayementModule,
    EmailModule,
  ],
>>>>>>> 9aa2475 (payement & mail)
  controllers: [],
  providers: [],
})
export class AppModule {}
