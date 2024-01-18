import { type } from "os";

type FileItem = {
  id: number;
  fileName: string;
  baseName: string;
  extName: string;
  filePath: string;
  path: string;
  status: string;
};

type AudioFileItem = FileItem & {
  subtitleFiles: FileItem[];
};

type VideoFileItem = FileItem & {
  audio: FileItem;
  subtitle: FileItem[];
  isProcessing: boolean;
  processingJobId?: string;
} & MediaInfo;

type AudioListItem = FileItem & {
  subtitle: FileItem[];
  isProcessing: boolean;
  processingJobId?: string;
};

export type FileList = VideoFileItem[];

export type FileListResult = {
  list: FileList;
  page: number;
  limit: number;
  totalCount: number;
};
export type AudioListResult = AudioListItem[];

export type CreateWhisperJobItem = {
  id: string;
  file?: string;
  language: string;
  model: string;
};

export type TranslateResult = {
  url: string;
  filename: string;
  path: string;
};

export enum LanguageEnum {
  Auto = "auto",
  English = "en",
  Chinese = "zh",
  German = "de",
  Spanish = "es",
  Russian = "ru",
  Korean = "ko",
  French = "fr",
  Japanese = "ja",
  Portuguese = "pt",
  Turkish = "tr",
  Polish = "pl",
  Catalan = "ca",
  Dutch = "nl",
  Arabic = "ar",
  Swedish = "sv",
  Italian = "it",
  Indonesian = "id",
  Hindi = "hi",
  Finnish = "fi",
  Vietnamese = "vi",
  Hebrew = "iw",
  Ukrainian = "uk",
  Greek = "el",
  Malay = "ms",
  Czech = "cs",
  Romanian = "ro",
  Danish = "da",
  Hungarian = "hu",
  Tamil = "ta",
  Norwegian = "no",
  Thai = "th",
  Urdu = "ur",
  Croatian = "hr",
  Bulgarian = "bg",
  Lithuanian = "lt",
  Latin = "la",
  Maori = "mi",
  Malayalam = "ml",
  Welsh = "cy",
  Slovak = "sk",
  Telugu = "te",
  Persian = "fa",
  Latvian = "lv",
  Bengali = "bn",
  Serbian = "sr",
  Azerbaijani = "az",
  Slovenian = "sl",
  Kannada = "kn",
  Estonian = "et",
  Macedonian = "mk",
  Breton = "br",
  Basque = "eu",
  Icelandic = "is",
  Armenian = "hy",
  Nepali = "ne",
  Mongolian = "mn",
  Bosnian = "bs",
  Kazakh = "kk",
  Albanian = "sq",
  Swahili = "sw",
  Galician = "gl",
  Marathi = "mr",
  Punjabi = "pa",
  Sinhala = "si",
  Khmer = "km",
  Shona = "sn",
  Yoruba = "yo",
  Somali = "so",
  Afrikaans = "af",
  Occitan = "oc",
  Georgian = "ka",
  Belarusian = "be",
  Tajik = "tg",
  Sindhi = "sd",
  Gujarati = "gu",
  Amharic = "am",
  Yiddish = "yi",
  Lao = "lo",
  Uzbek = "uz",
  Faroese = "fo",
  HaitianCreole = "ht",
  Pashto = "ps",
  Turkmen = "tk",
  Nynorsk = "nn",
  Maltese = "mt",
  Sanskrit = "sa",
  Luxembourgish = "lb",
  Myanmar = "my",
  Tibetan = "bo",
  Tagalog = "tl",
  Malagasy = "mg",
  Assamese = "as",
  Tatar = "tt",
  Hawaiian = "haw",
  Lingala = "ln",
  Hausa = "ha",
  Bashkir = "ba",
  Javanese = "jw",
  Sundanese = "su",
}

export enum TranslateType {
  GOOGLE = "google",
  GPT3 = "gpt3",
}

export enum TranslateLanguage {
  SimplifiedChinese = "zh-CN",
  TraditionalChinese = "zh-TW",
  English = "en",
  Japanese = "ja",
  Korean = "ko",
  French = "fr",
  Spanish = "es",
  Portuguese = "pt",
  Italian = "it",
  German = "de",
  Russian = "ru",
  Arabic = "ar",
  Indonesian = "id",
}

export interface MediaInfo {
  title?: string;
  originaltitle?: string;
  plot?: string;
  poster?: string;
  fanart?: string;
  actors?: {
    name?: string;
    role?: string;
    thumb?: string;
    type?: string;
  }[];
  dateadded?: string;
}

export type FileType = "video" | "audio" | "subtitle";

export * from "./api.response";
export * from "./whisper";
