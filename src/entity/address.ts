import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  cep: string;

  @Column({ type: 'text' })
  street: string;

  @Column({ type: 'text' })
  streetNumber: number;

  @Column({ type: 'text' })
  complement?: string;

  @Column({ type: 'text' })
  neighborhood: string;

  @Column({ type: 'text' })
  city: string;

  @Column({ type: 'text' })
  state: string;

  @ManyToOne(() => User, (user) => user.address, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  user: User;
}
