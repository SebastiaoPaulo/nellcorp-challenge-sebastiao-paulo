import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as uuid from 'uuid';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  /********************************************************************
   * @description Creates a transaction
   * @param { CreateTransactionDto } createTransactionDto
   * @returns created transaction
   * @author Sebastião Paulo
   *******************************************************************/
  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  /********************************************************************
   * @description Find all transactions on the records
   * @returns Transaction[]
   * @author Sebastião Paulo
   *******************************************************************/
  async findAll() {
    return await this.transactionRepository.find();
  }

  /********************************************************************
   * @description Finds an transaction by accountNumber
   * @param { uuid } AccountNumber
   * @returns The found transaction
   * @author Sebastião Paulo
   *******************************************************************/
  async findByTransactionId(transactionId: string) {
    const isValidUuid = uuid.validate(transactionId);

    //Must have this validation because of uuid validation exceptions on TypeOrm
    if (isValidUuid) {
      return await this.transactionRepository.findOneBy({
        transaction_id: transactionId,
      });
    }

    throw new NotFoundException(
      `There is not a transaction with this id: ${transactionId}`,
    );
  }

  /********************************************************************
   * @description Finds an transactions by accountNumber
   * @param { uuid } AccountNumber
   * @returns All transactions that the account passed is involved in
   * @author Sebastião Paulo
   *******************************************************************/
  async findByAccount(accountNumber: string) {
    return await this.transactionRepository.find({
      where: [{ account: accountNumber }, { receiver: accountNumber }],
    });
  }

  /********************************************************************
   * @description Updates an Transaction
   * @param { uuid } transactionId
   * @param { UpdateTransactionDto } updateTransactionDto
   * @returns The updated Transaction
   * @author Sebastião Paulo
   *******************************************************************/
  async update(
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const isValidUuid = uuid.validate(transactionId);

    //Must have this validation because of uuid validation exceptions on TypeOrm
    if (isValidUuid) {
      const transactionUpdated = await this.transactionRepository.update(
        { transaction_id: transactionId },
        updateTransactionDto,
      );

      if (transactionUpdated.affected > 0)
        return await this.transactionRepository.findOneBy({
          transaction_id: transactionId,
        });
    }
    throw new NotFoundException(
      `There is not a transaction with this id: ${transactionId}`,
    );
  }
}
