import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Stock } from "./stockEntity";

@Entity("medicines")
export class Medicine {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "float" })
  dose!: number;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "boolean", default: true })
  takeMorning!: boolean;

  @Column({ type: "int", default: 9 })
  morningTime!: number;

  @Column({ type: "boolean", default: true })
  takeAfternoon!: boolean;

  @Column({ type: "int", default: 14 })
  afternoonTime!: number;

  @Column({ type: "boolean", default: true })
  takeEvening!: boolean;

  @Column({ type: "int", default: 21 })
  eveningTime!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastDeductedAt!: Date;

  @ManyToOne(() => Stock, (stock) => stock.medicines, { onDelete: "CASCADE" })
  @Index("stock_idx")
  stock!: Stock;
}
