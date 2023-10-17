import { Module } from '@nestjs/common';
import { AuthService, jwtConstants } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategys/local.strategy';
import { jwtStrategy } from './strategys/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports:[
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn:'1d'},
      global:true
    })
  ],
  providers: [AuthService, LocalStrategy, jwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
