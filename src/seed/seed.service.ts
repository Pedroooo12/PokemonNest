import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private readonly httpService: HttpService){

  }

  async executeSeed(){
    try {
      const limit = 10;
      const observable = this.httpService.get<PokeResponse>(`${this.POKE_API_URL}?limit=${limit}`);

      // 2. Convierte el Observable a una Promise y espera el primer valor (la respuesta HTTP)
      const response = await firstValueFrom(observable);

      response.data.results.forEach(({name, url}) => {
        const segments = url.split('/');
        const no: number = +segments[segments.length - 2];

      });

      // 3. Retorna la data
      return response.data.results;

    } catch (error) {
      throw new InternalServerErrorException('Cant connect to pokeApi - Check server logs');
    }
  }
}
