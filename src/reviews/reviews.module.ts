import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "src/reviews/entities/reviews.entity";
import { ReviewsService } from "src/reviews/reviews.service";
import { ReviewsController } from "src/reviews/reviews.controller";

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [TypeOrmModule.forFeature([Review])],
})
export class ReviewsModule {}
