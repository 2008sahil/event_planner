import { IsNotEmpty, IsString, IsISO8601, IsOptional, IsBoolean } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsISO8601()
  date: string;

  @IsNotEmpty()
  @IsISO8601()
  time: string;

  @IsOptional() // File is optional, so you can skip validation
  file?: any; // This can be any type since it's being handled as a Buffer in the backend

  @IsBoolean()
  @IsOptional() // You can make this optional, as default value is false
  isRead: boolean = false; // Default value of false
}
