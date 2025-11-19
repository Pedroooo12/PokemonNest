import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PokeResponse, SmallPokemon } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';

@Injectable()
export class SeedService {

  private readonly POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon';

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){

  }

  async executeSeed(){
    try {

      //eliminamos todo lo que haya
      await this.pokemonModel.deleteMany();

      const limit = 100;
      const observable = this.httpService.get<PokeResponse>(`${this.POKE_API_URL}?limit=${limit}`);

      // 2. Convierte el Observable a una Promise y espera el primer valor (la respuesta HTTP)
      const { data } = await firstValueFrom(observable);

      const pokemonToInsert: CreatePokemonDto[] = [];

      data.results.forEach(({name, url}) => {
        const segments = url.split('/');
        const no: number = +segments[segments.length - 2];
        pokemonToInsert.push({name, no})
      });

      this.create(pokemonToInsert);

      return 'Seed executed'

    } catch (error) {
      throw new InternalServerErrorException('Cant connect to pokeApi - Check server logs');
    }
  }

  async create(pokemonList: CreatePokemonDto[]){
    try {
      const pokemonListDB = await this.pokemonModel.insertMany(pokemonList);
      return pokemonListDB;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`)
    }

    throw new InternalServerErrorException('Cant update pokemon - Check server logs')
  }
}
