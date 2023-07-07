import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  fileName: string;

  @Column({ length: 500 })
  baseName: string;
  @Column({ length: 500 })
  extName: string;

  @Column("text")
  filePath: string;

  @Column()
  status: string;
}
