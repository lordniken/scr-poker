import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorieEntity } from 'src/entities';
import { StorieResolver } from './storie.resolver';
import { StorieService } from './storie.service';

@Module({
  imports: [TypeOrmModule.forFeature([StorieEntity])],
  providers: [StorieResolver, StorieService],
  exports: [StorieService],
})
export default class StorieModule {}
