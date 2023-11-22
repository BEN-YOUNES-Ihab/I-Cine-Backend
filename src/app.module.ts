import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SessionsModule } from './sessions/sessions.module';
import { OrdersModule } from './orders/orders.module';
import { EmailModule } from './email/email.module';
import { PayementModule } from './payement/payement.module';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    MoviesModule,
    CloudinaryModule,
    SessionsModule,
    OrdersModule,
    EmailModule,
    PayementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
