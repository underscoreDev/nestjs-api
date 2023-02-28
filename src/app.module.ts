import { DataSource } from "typeorm";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { UsersModule } from "src/users/users.module";
import { User } from "src/users/entities/user.entity";
import { ProductModule } from "./product/product.module";
import { ReviewsModule } from "src/reviews/reviews.module";
import { SessionEntity } from "src/entities/session.entity";
import { Review } from "src/reviews/entities/reviews.entity";
import { Product } from "src/product/entities/product.entity";
import { Brand } from "./product/entities/brand.entity";
import { Category } from "./product/entities/category.entity";
import { SubCategory } from "./product/entities/subCategory.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ThrottlerModule.forRoot({ ttl: 60, limit: 10 }),

    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: process.env.LOCAL_DATABASE_PASSWORD,
      database: "nestjstest",
      entities: [User, Review, Brand, SubCategory, Category, Product, SessionEntity],
      synchronize: true,
      logging: false,
    }),

    AuthModule,
    UsersModule,
    ReviewsModule,
    ProductModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}

  async getSessionEntity() {
    return this.dataSource.getRepository(SessionEntity);
  }
}
