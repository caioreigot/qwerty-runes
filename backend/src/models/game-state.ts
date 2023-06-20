import { PublicState } from './public-state';

export class GameState<T extends PublicState> {
  
  public: T;

  constructor(publicState: T) {
    this.public = publicState;
  }
}
