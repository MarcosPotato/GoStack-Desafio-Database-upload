import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm'

import Category from './Category';

@Entity("transactions")
class Transaction {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column()
  value: number;

  @ManyToOne(() => Category) //Qual Entidade Vou referenciar
  @JoinColumn({ name: "category_id"}) //coluna de relacionamento
  category: Category;//elemento referenciado

  @Column()
  category_id: string; //id referenciado

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
