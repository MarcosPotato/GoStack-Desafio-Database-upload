import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request: Request, response: Response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository)
  const transactions = await transactionsRepository.find()
  const balance = await transactionsRepository.getBalance()

  return response.status(200).json({ transactions, balance })
});

transactionsRouter.post('/', async (request: Request, response: Response) => {
  const { title, value, type, category } = request.body

  const createTransactionService = new CreateTransactionService()

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category
  })

  return response.status(200).json(transaction)
});

transactionsRouter.delete('/:id', async (request: Request, response: Response) => {
  const { id } = request.params

  const deleteTransactionService = new DeleteTransactionService()

  await deleteTransactionService.execute(id)
  return response.status(204).json()
});

transactionsRouter.post('/import', async (request: Request, response: Response) => {
  // TODO
});

export default transactionsRouter;
