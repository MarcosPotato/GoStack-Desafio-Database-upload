import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository)

    const existTransaction = await transactionsRepository.findOne(id)

    if(!existTransaction){
      throw new AppError("This transaction not exists")
    }

    await transactionsRepository.remove(existTransaction)
  }
}

export default DeleteTransactionService;
