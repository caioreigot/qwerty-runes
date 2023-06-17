import { PublicState } from './public-state';
export declare class GameState<T extends PublicState> {
    public: T;
    constructor(publicState: T);
}
