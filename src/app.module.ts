import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { Account } from './account/entities/account.entity';
import { Transaction } from './transaction/entities/transaction.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      entities: [Account, Transaction],
      synchronize: true,
    }),
    AccountModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
