import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { RegularUser } from "./users.entity"; // Assume you already have a User entity

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  token: string;

  @ManyToOne(() => RegularUser)
  @JoinColumn({ name: "user_id" })
  user: RegularUser;
}
