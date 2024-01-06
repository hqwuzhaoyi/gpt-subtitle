import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column({ length: 500, nullable: true })
  value: string;
}
