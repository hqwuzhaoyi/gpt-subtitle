import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  @Entity()
  export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    fileName: string;

    @Column('text')
    filePath: string;

    @Column()
    status: string;
  }
