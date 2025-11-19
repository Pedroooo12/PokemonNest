import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ HttpModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
