import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from 'src/pokemon/entities/pokemon.entity';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  imports: [ 
    HttpModule,
    PokemonModule
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
