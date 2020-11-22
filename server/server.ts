import { Game } from "./game";
import { PlayerSocket } from "./playerSocket";
import * as tf from '@tensorflow/tfjs';
import { TypedArray } from "@tensorflow/tfjs-node";

export class Server {
    games: Array<Game>
    players: Array<PlayerSocket>
    models: Array<tf.Sequential>
    constructor() {
        this.games = new Array();
        this.players = new Array();
        this.models = new Array();
        this.initTraining();
    }

    // MODEL TRAINING

    createModel () {
        const model = tf.sequential()
        model.add(tf.layers.dense({
            inputShape: [null, 3],
            units: 3,
            useBias: true,
        }));
        model.add(tf.layers.batchNormalization());
        model.add(tf.layers.dense({units: 100, activation: 'relu'}));
        model.add(tf.layers.dropout({rate: 0.25}));
        model.add(tf.layers.dense({
            units: 6,
        }));
        model.compile({
            optimizer: tf.train.adam(),
            loss: tf.losses.meanSquaredError
        });
        return model;
    }

    async initTraining() {
        let i = 0;
        let model1 = this.createModel();
        let model2 = this.createModel();
        let player1 = this.initPlayer();
        let player2 = this.initPlayer();
        let game = this.createGame(player1);
        this.joinPlayerToGame(game, player2);
        while (i < 1) {
            let prediction1 = this.makePrediction(model1, player1, game);
            let prediction2 = this.makePrediction(model2, player2, game);
            game.playerCommand(player1, this.getMoveFromPrediction(prediction1));
            game.playerCommand(player2, this.getMoveFromPrediction(prediction2));
            game.gameTick();
            let afterPredictionInput1 = this.convertGameIntoTensor(player1, game);
            let afterPredictionInput2 = this.convertGameIntoTensor(player2, game);
            await model1.trainOnBatch(afterPredictionInput1, tf.tensor1d([player1.score + 1]));
            i++;
        }
    }

    convertGameIntoTensor(player: PlayerSocket, game: Game) {
        let map = [game.elements.map(el => {
            let valueDimension: number;
            if (el.type === 'player') {
                if (el === player.gamePlayer) {
                    valueDimension = 0;
                } else {
                    valueDimension = 1;
                }
            } else {
                valueDimension = 2;
            }
            return [el.x, el.y, valueDimension];
        })];
        let tensor = tf.tensor3d(map);
        return tensor;
    }

    makePrediction(model: tf.Sequential, player: PlayerSocket, game: Game) {
        let input = this.convertGameIntoTensor(player, game);
        let prediction = (model.predict(input) as tf.Tensor ).max(1).min(0);
        let output = tf.mean(tf.square((prediction as tf.Tensor)));
        return output;
    }

    // GAME LOGIC

    getMoveFromPrediction(prediction: tf.Tensor) {
        let value = (prediction.dataSync() as TypedArray);
        if (value[0]) {
            return 'up';
        } else if (value[1]) {
            return 'down';
        } else if (value[2]) {
            return 'right';
        } else if (value[3]) {
            return 'left';
        } else if (value[4]) {
            return 'fire_field';
        } else if (value[5]) {
            return 'fire_wave';
        } else {
            return '';
        }
    }
    initPlayer() {
        let player = new PlayerSocket();
        this.players.push(player);
        return player;
    }
    createGame(player: PlayerSocket) {
        let game = new Game();
        this.games.push(game);
        this.joinPlayerToGame(game, player);
        return game;
    }
    joinPlayerToGame(game: Game, player: PlayerSocket) {
        game.addPlayer(player);
    }
}