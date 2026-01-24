import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stock } from "./stockEntity";

@Entity("medicines")
export class Medicine {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: "varchar", length: 100 })
  name!: string;
  @Column({type: "float"})
  dose!: number;
  @Column({ type: "int" })
  quantity!: number;
  @Column({type: "boolean", default: true})
  takeMorning!: boolean;
  @Column({type: "boolean", default: true})
  takeAfternoon!: boolean;
  @Column({type: "boolean", default: true})
  takeEvening!: boolean;
  @ManyToOne(() => Stock, (stock) => stock.medicines)
  stock!: Stock;
}