import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { TransferDto } from './dto/transfer.dto';
import { Account } from './entities/account.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    private readonly transactionService: TransactionService,
    private dataSource: DataSource,
  ) {}

  /********************************************************************
   * @description Creates a new account
   * @param { Account } account
   * @returns created account
   * @author Sebastião Paulo
   *******************************************************************/
  async create(account: Partial<Account>): Promise<Account> {
    const newAccount = this.accountRepository.create(account);
    return await this.accountRepository.save(newAccount);
  }

  /********************************************************************
   * @description Get all accounts on the records
   * @returns Account[]
   * @author Sebastião Paulo
   *******************************************************************/
  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find();
  }

  /********************************************************************
   * @description Finds an account by id
   * @param { number } id
   * @returns The found account
   * @author Sebastião Paulo
   *******************************************************************/
  async findById(id: number): Promise<Account> {
    const account = await this.accountRepository.findOneBy({ id });

    if (!account)
      throw new NotFoundException(
        `There is not an account with this id: ${id}`,
      );
    return account;
  }

  /********************************************************************
   * @description Finds an accound by accountNumber
   * @param { uuid } AccountNumber
   * @returns The found account
   * @author Sebastião Paulo
   *******************************************************************/
  async findByAccountNumber(accountNumber: string): Promise<Account> {
    const isValidUuid = uuid.validate(accountNumber);

    //Must have this validation because of uuid validation exceptions on TypeOrm
    if (isValidUuid) {
      const account = await this.accountRepository.findOneBy({
        account_number: accountNumber,
      });

      if (account) return account;
    }
    throw new NotFoundException(
      `There is not an account with this account number: ${accountNumber}`,
    );
  }

  /********************************************************************
   * @description Gets the actual balance of a specific account
   * @param { uuid } accountNumber
   * @returns The found account's balance
   * @author Sebastião Paulo
   *******************************************************************/
  async getBalance(accountNumber: string): Promise<any> {
    const account = await this.findByAccountNumber(accountNumber);

    return { balance: account.balance };
  }

  /********************************************************************
   * @description Updates an Account
   * @param { uuid } accountNumber
   * @param { Account } account (Data to be updated)
   * @returns The updated account
   * @author Sebastião Paulo
   *******************************************************************/
  async update(
    accountNumber: string,
    account: Partial<Account>,
  ): Promise<Account> {
    const isValidUuid = uuid.validate(accountNumber);

    //Must have this validation because of uuid validation exceptions on TypeOrm
    if (isValidUuid) {
      const accountUpdated = await this.accountRepository.update(
        { account_number: accountNumber },
        account,
      );

      if (accountUpdated.affected > 0)
        return await this.accountRepository.findOneBy({
          account_number: accountNumber,
        });
    }
    throw new NotFoundException(
      `There is not an account with this account number: ${accountNumber}`,
    );
  }

  /********************************************************************
   * @description Makes a deposit to an account
   * @param { uuid } accountNumber
   * @param { Number } amount
   * @OptionalParam { String } op - Is used to differentiate the operations
   * @returns The updated account
   * @author Sebastião Paulo
   *******************************************************************/
  async deposit(
    accountNumber: string,
    amount: number,
    op?: string,
  ): Promise<Account> {
    const account = await this.findByAccountNumber(accountNumber);

    if (!op) await this.verifyAccount(account);

    account.balance += amount;

    const accountUpdated = await this.update(accountNumber, account);

    //Only creates a transaction in case the op is null. If it's not, the transaction will be created by another function(operation)
    if (!op) {
      const operation = 'deposit';
      await this.transactionService.create({
        amount,
        account: accountNumber,
        operation,
      });
    }

    return accountUpdated;
  }

  /********************************************************************
   * @description Makes a withdrawal from an account
   * @param { uuid } accountNumber
   * @param { Number } amount
   * @OptionalParam { String } op - Is used to differentiate the operations
   * @returns The updated account
   * @author Sebastião Paulo
   *******************************************************************/
  async withdrawal(
    accountNumber: string,
    amount: number,
    op?: string,
  ): Promise<Account> {
    const account = await this.findByAccountNumber(accountNumber);

    if (!op) await this.verifyAccount(account);

    if (account.balance - amount > 0) {
      account.balance -= amount;

      const accountUpdated = await this.update(accountNumber, account);

      //Only creates a transaction in case the op is null. If it's not, the transaction will be created by another function(operation)
      if (!op) {
        const operation = 'withdrawal';
        await this.transactionService.create({
          amount,
          account: accountNumber,
          operation,
        });
      }

      return accountUpdated;
    }

    if (op)
      throw new BadRequestException(
        'The amount you want to transfer is greater than the account balance',
      );
    throw new BadRequestException(
      'The amount you want to withdraw is greater than the account balance',
    );
  }

  /********************************************************************
   * @description Makes a transfer from an account to another
   * @param { TransferDto } transferDto
   * @OptionalParam { String } op - Is used to differentiate the operations
   * @returns { message } - A success message
   * @author Sebastião Paulo
   *******************************************************************/
  async transfer(transferDto: TransferDto, op?: string): Promise<any> {
    const { account, receiver, amount } = transferDto;

    if (account == receiver)
      throw new BadRequestException('Sender and Receiver must be differents');

    //Verifies if the accounts are active
    await this.verifyAccount(null, account);
    await this.verifyAccount(null, receiver);

    //Changes the operation in case that the original operation is not a transfer
    let operation = 'transfer';
    if (op) operation = op;

    //The transfer proccess. Withdraw from one account and deposit on another
    await this.withdrawal(account, amount, operation);
    await this.deposit(receiver, amount, operation);

    //Creates a transaction with operation especified
    await this.transactionService.create({
      amount,
      account,
      receiver,
      operation,
    });

    return {
      message: `Transfer of ${amount} from ${account} to ${receiver} completed`,
    };
  }

  /********************************************************************
   * @description Deletes an account
   * @param { uuid } accountNumber
   * @returns the deleted account
   * @author Sebastião Paulo
   *******************************************************************/
  async delete(accountNumber: string): Promise<Account> {
    const account = await this.findByAccountNumber(accountNumber);

    const accountDeleted = await this.accountRepository.delete(account.id);

    if (accountDeleted?.affected > 0) return account;

    throw new ServiceUnavailableException(
      'Impossible to delete this account. Contact support',
    );
  }

  /********************************************************************
   * @description Makes a refund from an specific transaction
   * @param { string } accountNumber - the account that received the amount on the transaction
   * @param { string } transactionId
   * @OptionalParam { String } op - Is used to differentiate the operations
   * @returns { message } - A success message
   * @author Sebastião Paulo
   *******************************************************************/
  async refund(accountNumber: string, transactionId: string): Promise<any> {
    const transaction = await this.transactionService.findByTransactionId(
      transactionId,
    );

    //Only makes a refund if the transaction was a transfer and it isn't already refunded
    if (transaction.operation == 'transfer') {
      if (transaction.status != 'refunded') {
        const account = await this.findByAccountNumber(accountNumber);

        if (transaction.receiver != account.account_number)
          throw new BadRequestException(
            'This account is not the receiver for this transaction. The refund must be done from the receiver',
          );

        //Refund process: transfers back the amount from the previous receiver to the sender account
        const refund = await this.transfer(
          {
            amount: transaction.amount,
            account: transaction.receiver,
            receiver: transaction.account,
          },
          'refund',
        );

        //Updates transaction status to refunded
        await this.transactionService.update(transaction.transaction_id, {
          status: 'refunded',
        });

        return refund;
      }

      throw new BadRequestException('This transaction was already refunded');
    }

    throw new BadRequestException(
      'The refund process must be done only on transfers transactions',
    );
  }

  /********************************************************************
   * @description Throws exception if an account is not active
   * @author Sebastião Paulo
   *******************************************************************/
  async verifyAccount(account?: Account, accountNumber?: string) {
    let accountToVerify = account;
    if (accountNumber)
      accountToVerify = await this.findByAccountNumber(accountNumber);
    if (!accountToVerify?.is_active)
      throw new BadRequestException(
        `This account ${accountToVerify.account_number} is not active`,
      );
  }
}
