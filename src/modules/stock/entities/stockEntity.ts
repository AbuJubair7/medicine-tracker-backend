import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Medicine } from "./medicineEntity";
import { User } from "../../user/entities/userEntity";

@Entity("stocks")
export class Stock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @ManyToOne(() => User, (user) => user.stocks, { onDelete: "CASCADE" })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Medicine, (medicine) => medicine.stock, { cascade: true })
  medicines!: Medicine[];
}
