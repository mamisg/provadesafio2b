import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { LogModule } from "./log/log.module";
import { PostModule } from "./post/post.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [AuthModule, UserModule, PostModule, LogModule],
})
export class AppModule {}
