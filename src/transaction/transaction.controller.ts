import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('transactions')
@ApiTags('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // @Post()
  // async create(@Body() createTransactionDto: CreateTransactionDto) {
  //   return await this.transactionService.create(createTransactionDto);
  // }

  // @Patch(':transaction_id')
  // async update(
  //   @Param('transaction_id') transaction_id: string,
  //   @Body() updateTransactionDto: UpdateTransactionDto,
  // ) {
  //   return await this.transactionService.update(
  //     transaction_id,
  //     updateTransactionDto,
  //   );
  // }

  @ApiOperation({
    summary: 'Finds all transactions on the records',
  })
  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @ApiOperation({
    summary: 'Finds a transaction using transaction_id field',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the found transition',
  })
  @Get(':transaction_id')
  async findByTransitionId(@Param('transaction_id') transactionId: string) {
    return await this.transactionService.findByTransactionId(transactionId);
  }

  @ApiOperation({
    summary: 'Finds all transactions that the account passed is involved in',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of transactions',
  })
  @Get('account/:account_id')
  async findByAccount(@Param('account_id') account: string) {
    return await this.transactionService.findByAccount(account);
  }
}
