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

@Entity()
export class VideoFileEntity extends FileEntity {
  @OneToOne(
    "AudioFileEntity",
    (audioFile: AudioFileEntity) => audioFile.videoFile
  )
  audioFile: Promise<AudioFileEntity>;

  @Column({ length: 500 })
  fanart: string;
  @Column({ length: 500 })
  poster: string;
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
}
