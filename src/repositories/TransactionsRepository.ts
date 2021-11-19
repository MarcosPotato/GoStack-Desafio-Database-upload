import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find()

    const { income, outcome } = transactions.reduce((currentValue, transaction) => {
      switch(transaction.type){
        case "income":
          currentValue.income += Number(transaction.value)
          break
        case "outcome":
          currentValue.outcome += Number(transaction.value)
          break
        default:
          break
      }

      return currentValue
    },{
      income: 0,
      outcome: 0,
      total: 0
    })

    const balance = {
      income,
      outcome,
      total: income - outcome
    }

    return balance
  }
}

export default TransactionsRepository;
