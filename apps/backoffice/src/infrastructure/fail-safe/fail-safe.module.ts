import { Module } from '@nestjs/common';
import { RedisModule } from '../redis';
import { FailSafeService } from './services/fail-safe.service';

@Module({
    imports: [RedisModule],
    providers: [FailSafeService],
    exports: [FailSafeService],
})
export class FailSafeModule {}
