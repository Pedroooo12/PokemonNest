import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){

  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto:PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto;
    return this.pokemonModel.find().limit(limit).skip(offset).sort({no:1}).select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    //si es un numero
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term});
    }

    //MongoID
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findOne({_id: term});
    }

    //Name
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()});
    }

    //No existe
    if(!pokemon) throw new NotFoundException(`Pokemon with id, name or no ${term} not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    //si pasa de esta linea tenemos un pokemon
    const pokemon = await this.findOne(term);

    if(updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, {new: true});
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});

    if(deletedCount ===  0) throw new BadRequestException(`Pokemon with ${id} not found`)
  }

  async removeByTerm(term: string) {
    const pokemon = await this.findOne(term);

    await pokemon.deleteOne();
  }

  private handleExceptions(error: any){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`)
    }

    throw new InternalServerErrorException('Cant update pokemon - Check server logs')
  }
}
