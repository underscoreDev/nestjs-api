import { Request as ERequest } from "express";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/users/entities/user.entity";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { StandardResponse } from "src/utils/responseManager.utils";
import { ChangePasswordDto, EmailDto, LoginDto, ResetPasswordDto } from "src/users/dto/login.dto";
import {
  Post,
  Body,
  Param,
  Patch,
  Request,
  HttpCode,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";

@ApiTags("Auth")
@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(201)
  @ApiCreatedResponse({ description: "Registration Successful", type: User })
  async register(@Body() createUserDto: CreateUserDto): Promise<StandardResponse<User>> {
    return await this.authService.createUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(200)
  async login(
    @Request() req: ERequest & { user: User },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _loginDto: LoginDto,
  ): Promise<{ token: string; status: string }> {
    return await this.authService.login(req.user);
  }

  @HttpCode(200)
  @Post("verify-email/:token")
  async confirmEmail(@Param("token") token: string): Promise<StandardResponse<User>> {
    return this.authService.confirmEmail(token);
  }

  @HttpCode(200)
  @Post("resend-email-verification-code")
  async resendEmailVerificationCode(@Body() email: EmailDto): Promise<StandardResponse<User>> {
    return this.authService.resendEmailVerificationCode(email);
  }

  @HttpCode(200)
  @Post("forgot-password")
  async forgotPassword(@Body() email: EmailDto): Promise<StandardResponse<User>> {
    return this.authService.forgotPassword(email);
  }

  @HttpCode(200)
  @Post("resend-forgot-password")
  async resendForgotPassword(@Body() email: EmailDto): Promise<StandardResponse<User>> {
    return this.authService.forgotPassword(email);
  }

  @HttpCode(200)
  @Patch("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<StandardResponse<User>> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @HttpCode(200)
  @Patch("change-password")
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req: ERequest & { user: User },
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<StandardResponse<User>> {
    return this.authService.changePassword(req.user, changePasswordDto);
  }
}
