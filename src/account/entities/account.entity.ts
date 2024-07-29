import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real' })
  balance: number;

  @Column()
  @Generated('uuid')
  account_number: string;

  @Column({ default: true })
  is_active: boolean;

  transactions: Transaction[];

  @CreateDateColumn()
  created_at: Date;
}
