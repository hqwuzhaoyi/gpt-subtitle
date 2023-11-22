import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  TableInheritance,
  ChildEntity,
  OneToOne,
} from "typeorm";

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, nullable: true })
  fileName: string;

  @Column({ length: 500, nullable: true })
  baseName: string;
  @Column({ length: 500, nullable: true })
  extName: string;

  @Column({ length: 500 })
  filePath: string;

  @Column({ nullable: true })
  status: string;
}

@Entity()
export class VideoFileEntity extends FileEntity {
  @OneToOne(
    "AudioFileEntity",
    (audioFile: AudioFileEntity) => audioFile.videoFile
  )
  audioFile: Promise<AudioFileEntity>;

  @OneToMany(() => SubtitleFileEntity, (subtitleFile) => subtitleFile.audioFile)
  subtitleFiles: SubtitleFileEntity[];

  @OneToOne("NfoFileEntity", (nfoFile: NfoFileEntity) => nfoFile.videoFile)
  nfoFile: Promise<NfoFileEntity>;
}

@Entity()
export class AudioFileEntity extends FileEntity {
  @OneToOne(() => VideoFileEntity)
  @JoinColumn()
  videoFile: VideoFileEntity;

  @OneToMany(() => SubtitleFileEntity, (subtitleFile) => subtitleFile.audioFile)
  subtitleFiles: SubtitleFileEntity[];
}

@Entity()
export class SubtitleFileEntity extends FileEntity {
  @ManyToOne(() => AudioFileEntity, (audioFile) => audioFile.subtitleFiles)
  audioFile: AudioFileEntity;

  @ManyToOne(() => VideoFileEntity, (videoFile) => videoFile.subtitleFiles)
  videoFile: VideoFileEntity;
}

@Entity()
export class NfoFileEntity extends FileEntity {
  @Column({ length: 500, nullable: true })
  title: string;

  @Column({ length: 500, nullable: true })
  originaltitle: string;

  @Column("text", { nullable: true })
  plot: string;

  @Column({ length: 500, nullable: true })
  poster: string;

  @Column({ length: 500, nullable: true })
  fanart: string;

  @Column("json", { nullable: true })
  actors: {
    name?: string;
    role?: string;
    thumb?: string;
  }[];

  @Column({nullable: true})
  dateadded: string;

  @OneToOne(() => VideoFileEntity)
  @JoinColumn()
  videoFile: VideoFileEntity;
}
