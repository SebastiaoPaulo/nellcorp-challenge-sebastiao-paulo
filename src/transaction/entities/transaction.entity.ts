import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  transaction_id: string;

  @Column({ type: 'real' })
  amount: number;

  @Column()
  account: string;

  @Column({ nullable: true })
  receiver: string;

  @Column()
  operation: string;

  @Column({ default: 'completed', nullable: true })
  status: string;

  @CreateDateColumn()
  created_at: Date;
}
