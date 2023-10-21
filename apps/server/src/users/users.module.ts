import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegularUser, OAuthUser } from "./users.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshToken } from "./refresh-token.entity";

@Module({
  imports: [TypeOrmModule.forFeature([RegularUser, OAuthUser, RefreshToken])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
