import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Username is required.' })
  @IsString({ message: 'Username must be a string.' })
  userName: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;

  // confirm password must be the same as password

  @Field()
  @IsNotEmpty({ message: 'Confirm Password is required.' })
  // must be the same as password
  confirmPassword: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
