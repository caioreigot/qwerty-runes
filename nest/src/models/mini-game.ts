export enum MiniGameType {
  GENERAL_KNOWLEDGE = 'general-knowledge',
}

export class MiniGameRoom {
  code: string;
  miniGameType: MiniGameType;
}
