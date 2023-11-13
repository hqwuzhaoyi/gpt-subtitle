// user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
  ChildEntity,
} from "typeorm";

@TableInheritance({ column: { type: "varchar", name: "userType" } })
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  userType: "RegularUser" | "OAuthUser";
}

@ChildEntity()
export class RegularUser extends User {
  @Column()
  password: string;
}

@ChildEntity()
export class OAuthUser extends User {
  @Column()
  provider: string;

  @Column()
  providerId: string;
}
