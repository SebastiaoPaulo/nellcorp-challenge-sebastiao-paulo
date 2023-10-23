export class CreateTransactionDto {
  amount: number;
  account: string;
  receiver?: string;
  operation: string;
  status?: string;
}
