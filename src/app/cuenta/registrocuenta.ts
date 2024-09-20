export class Transaction {
    fecha_creacion: Date;
    tipo: string;
    valor: number;
}

export class BalanceResponse {
    balance: number;
    transactions: Transaction[];
}
  