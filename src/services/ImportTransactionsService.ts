import csvParse from 'csv-parse'
import fs from 'fs'

import { getRepository, getCustomRepository, In } from 'typeorm'

import Transaction from '../models/Transaction'
import Category from '../models/Category'

import TransactionsRepository from '../repositories/TransactionsRepository'

interface CSVTransaction{
  title: string
  type: "income" | "outcome"
  value: number
  category: string
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contactsReadString = fs.createReadStream(filePath)

    const parsers = csvParse({
      from_line: 2
    })

    const parseCSV = contactsReadString.pipe(parsers)

    const transactions: CSVTransaction[] = []
    const categories: string[] = []

    parseCSV.on("data", async line => {
      const [title, type, value, category] = line.map((cell: string) => (
        cell.trim()
      ))

      if (!title || !type || !value) return

      categories.push(category)
      transactions.push({
        title, 
        type, 
        value, 
        category
      })
    })

    await new Promise(resolve => parseCSV.on("end", resolve))

    const categoriesRepository = await getRepository(Category)

    const existentCategories = (await categoriesRepository.find({
      where: {
        title: In(categories)
      }
    }))
    
    const existentCategoriesTitles = existentCategories.map(category => (
      category.title
    ))

    const addCategoryTitles = categories
      .filter(category => (!existentCategoriesTitles.includes(category)))
      .filter((value, index, self) => self.indexOf(value) === index)

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({ title }))
    )

    await categoriesRepository.save(newCategories)

    const finalCategories = [...newCategories, ...existentCategories]

    const transactionsRepository = getCustomRepository(TransactionsRepository)

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(category => category.title === transaction.category)
      }))
    )

    await transactionsRepository.save(createdTransactions)

    await fs.promises.unlink(filePath)

    return createdTransactions
  }
}

export default ImportTransactionsService
