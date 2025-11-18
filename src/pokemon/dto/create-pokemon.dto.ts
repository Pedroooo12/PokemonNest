import { IsNumber, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
  //entero, positivo, minimo 1
  @IsNumber()
  @IsPositive()
  @Min(1)
  readonly no: number;

  // string, minlenght 1
  @IsString()
  @MinLength(1)
  name: string;
}
