import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    //configuracion variables de entorno
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema
    }),

    //configuracion contenido estatico
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),

    //configuracion mongoDB
    MongooseModule.forRoot(process.env.MONGODB!, {
      dbName: 'pokemonsdb'
    }),

    PokemonModule,
    CommonModule,
    SeedModule
  ]
})
export class AppModule {}
