import {
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
  Equals,
} from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(6)
  password: string;

  //   @IsString()
  //   @MinLength(6)
  //   @Equals("password")
  //   confirmPassword: string;

  @IsString()
  username: string;

  //   @IsBoolean()
  //   termsAndConditionsAccepted: boolean;
}
