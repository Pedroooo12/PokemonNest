import {IsNumber, IsOptional, IsPositive, Max, Min } from "class-validator";

export class PaginationDto {

  @IsOptional()
  @IsPositive()
  @Min(1)
  @Max(100)
  @IsNumber()
  limit?: number

  @IsOptional()
  @IsPositive()
  @IsNumber()
  offset?: number
}