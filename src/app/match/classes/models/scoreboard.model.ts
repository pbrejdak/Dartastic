import { ScoreboardItem } from './scoreboard-item.model';

export interface IScoreboard {
    getPlayer(): ScoreboardItem;
    addThrows
}

export class Scoreboard {
    player1: ScoreboardItem;
    player2: ScoreboardItem;

    constructor(player1: ScoreboardItem, player2: ScoreboardItem) {
        this.player1 = player1;
        this.player2 = player2;
    }
}