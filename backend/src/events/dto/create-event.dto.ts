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

  @IsOptional() 
  file?: any;

  @IsBoolean()
  @IsOptional()
  isRead: boolean = false;

  @IsString()
  @IsOptional()
  videoUrl: boolean = false;
}
