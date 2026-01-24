import {
  Column,
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

  @ManyToOne(() => User, (user) => user.stocks)
  user!: User;

  @OneToMany(() => Medicine, (medicine) => medicine.stock)
  medicines!: Medicine[];
}
