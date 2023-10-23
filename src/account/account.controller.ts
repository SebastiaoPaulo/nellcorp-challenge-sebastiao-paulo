import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('accounts')
@ApiTags('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({
    summary: 'Creates an account',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the created Account',
  })
  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return await this.accountService.create(createAccountDto);
  }

  @ApiOperation({
    summary: 'Finds all accounts on the records',
  })
  @Get()
  async findAll() {
    return await this.accountService.findAll();
  }

  // @Get(':id')
  // async findById(@Param('id') id: number) {
  //   return await this.accountService.findById(id);
  // }

  @ApiOperation({
    summary: 'Finds an Account using the account_number field',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the found Account',
  })
  @Get(':account_number')
  async findByAccountNumber(@Param('account_number') accountNumber: string) {
    return await this.accountService.findByAccountNumber(accountNumber);
  }

  @ApiOperation({
    summary: 'Gets the balance from an account',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the balance of the passed account',
  })
  @Get(':account_number/balance')
  async getBalance(@Param('account_number') accountNumber: string) {
    return await this.accountService.getBalance(accountNumber);
  }

  @ApiOperation({
    summary: 'Updates an Account',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated Account',
  })
  @ApiBody({ type: CreateAccountDto })
  @Patch(':account_number')
  async update(
    @Param('account_number') accountNumber: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return await this.accountService.update(accountNumber, updateAccountDto);
  }

  @ApiOperation({
    summary: 'Makes a deposit to a specified Account',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated Account',
  })
  @Post(':account_number/deposit')
  async deposit(
    @Param('account_number') accountNumber: string,
    @Body() depositDto: DepositDto,
  ) {
    return await this.accountService.deposit(accountNumber, depositDto.amount);
  }

  @ApiOperation({
    summary: 'Makes a withdrawal to a specified Account',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated Account',
  })
  @Post(':account_number/withdrawal')
  async withdrawal(
    @Param('account_number') accountNumber: string,
    @Body() depositDto: DepositDto,
  ) {
    return await this.accountService.withdrawal(
      accountNumber,
      depositDto.amount,
    );
  }

  @ApiOperation({
    summary: 'Makes a transfer from an account to another',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns an operation success message',
  })
  @Post('transfer')
  async transfer(@Body() transferDto: TransferDto) {
    return await this.accountService.transfer(transferDto);
  }

  @ApiOperation({
    summary: 'Makes a refund of an existing transaction',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns an operation success message',
  })
  @Post(':account_number/transaction/:transaction_id/refund')
  async refund(
    @Param('account_number') accountNumber: string,
    @Param('transaction_id') transactionId: string,
  ) {
    return await this.accountService.refund(accountNumber, transactionId);
  }

  @ApiOperation({
    summary: 'Makes a refund of an existing transaction',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns an operation success message',
  })
  @Delete(':account_number')
  async delete(@Param('account_number') account_number: string) {
    return await this.accountService.delete(account_number);
  }
}
