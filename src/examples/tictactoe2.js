"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.main = void 0;
var snarkyjs_1 = require("@o1labs/snarkyjs");
var Board = /** @class */ (function () {
    function Board(serialized_board) {
        var bits = serialized_board.toBits();
        var board = [];
        for (var i = 0; i < 3; i++) {
            var row = [];
            for (var j = 0; j < 3; j++) {
                var is_played = bits[i * 3 + j];
                var player = bits[i * 3 + j + 9];
                row.push(new snarkyjs_1.Optional(is_played, player));
            }
            board.push(row);
        }
        this.board = board;
    }
    Board.prototype.serialize = function () {
        var is_played = [];
        var player = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                is_played.push(this.board[i][j].isSome);
                player.push(this.board[i][j].value);
            }
        }
        return snarkyjs_1.Field.ofBits(is_played.concat(player));
    };
    Board.prototype.update = function (x, y, player_token) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                // is this the cell the player wants to play?
                var to_update = snarkyjs_1.Circuit["if"](x.equals(new snarkyjs_1.Field(i)).and(y.equals(new snarkyjs_1.Field(j))), new snarkyjs_1.Bool(true), new snarkyjs_1.Bool(false));
                // make sure we can play there
                snarkyjs_1.Circuit["if"](to_update, this.board[i][j].isSome, new snarkyjs_1.Bool(false)).assertEquals(false);
                // copy the board (or update if this is the cell the player wants to play)
                this.board[i][j] = snarkyjs_1.Circuit["if"](to_update, new snarkyjs_1.Optional(new snarkyjs_1.Bool(true), player_token), this.board[i][j]);
            }
        }
    };
    Board.prototype.print_state = function () {
        for (var i = 0; i < 3; i++) {
            var row = '| ';
            for (var j = 0; j < 3; j++) {
                var token = '_';
                if (this.board[i][j].isSome.toBoolean()) {
                    token = this.board[i][j].value.toBoolean() ? 'X' : 'O';
                }
                row += token + ' | ';
            }
            console.log(row);
        }
        console.log('---\n');
    };
    Board.prototype.check_winner = function () {
        var won = new snarkyjs_1.Bool(false);
        // check rows
        for (var i = 0; i < 3; i++) {
            var row = this.board[i][0].isSome;
            row = row.and(this.board[i][1].isSome);
            row = row.and(this.board[i][2].isSome);
            row = row.and(this.board[i][0].value.equals(this.board[i][1].value));
            row = row.and(this.board[i][1].value.equals(this.board[i][2].value));
            won = snarkyjs_1.Circuit["if"](row, new snarkyjs_1.Bool(true), won);
        }
        // check cols
        for (var i = 0; i < 3; i++) {
            var col = this.board[0][i].isSome;
            col = col.and(this.board[1][i].isSome);
            col = col.and(this.board[2][i].isSome);
            col = col.and(this.board[0][i].value.equals(this.board[1][i].value));
            col = col.and(this.board[1][i].value.equals(this.board[2][i].value));
            won = snarkyjs_1.Circuit["if"](col, new snarkyjs_1.Bool(true), won);
        }
        // check diagonals
        var diag1 = this.board[0][0].isSome;
        diag1 = diag1.and(this.board[1][1].isSome);
        diag1 = diag1.and(this.board[2][2].isSome);
        diag1 = diag1.and(this.board[0][0].value.equals(this.board[1][1].value));
        diag1 = diag1.and(this.board[1][1].value.equals(this.board[2][2].value));
        won = snarkyjs_1.Circuit["if"](diag1, new snarkyjs_1.Bool(true), won);
        var diag2 = this.board[0][2].isSome;
        diag2 = diag2.and(this.board[1][1].isSome);
        diag2 = diag2.and(this.board[0][2].isSome);
        diag2 = diag2.and(this.board[0][2].value.equals(this.board[1][1].value));
        diag2 = diag2.and(this.board[1][1].value.equals(this.board[2][0].value));
        won = snarkyjs_1.Circuit["if"](diag2, new snarkyjs_1.Bool(true), won);
        //
        return won;
    };
    return Board;
}());
var TicTacToe = /** @class */ (function (_super) {
    __extends(TicTacToe, _super);
    // initialization
    function TicTacToe(initialBalance, address, player1, player2) {
        var _this = _super.call(this, address) || this;
        _this.balance.addInPlace(initialBalance);
        _this.board = snarkyjs_1.State.init(snarkyjs_1.Field.zero);
        _this.nextPlayer = snarkyjs_1.State.init(new snarkyjs_1.Bool(false)); // player 1 starts
        _this.gameDone = snarkyjs_1.State.init(new snarkyjs_1.Bool(false));
        // set the public key of the players
        _this.player1 = snarkyjs_1.State.init(player1);
        _this.player2 = snarkyjs_1.State.init(player2);
        return _this;
    }
    // board:
    //  x  0  1  2
    // y +----------
    // 0 | x  x  x
    // 1 | x  x  x
    // 2 | x  x  x
    TicTacToe.prototype.play = function (pubkey, signature, x, y) {
        return __awaiter(this, void 0, void 0, function () {
            var finished, player1, player2, player, nextPlayer, board, _a, won;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.gameDone.get()];
                    case 1:
                        finished = _b.sent();
                        finished.assertEquals(false);
                        // 2. ensure that we know the private key associated to the public key
                        //    and that our public key is known to the snapp
                        // ensure player owns the associated private key
                        signature.verify(pubkey, [x, y]).assertEquals(true);
                        return [4 /*yield*/, this.player1.get()];
                    case 2:
                        player1 = _b.sent();
                        return [4 /*yield*/, this.player2.get()];
                    case 3:
                        player2 = _b.sent();
                        snarkyjs_1.Bool.or(pubkey.equals(player1), pubkey.equals(player2)).assertEquals(true);
                        player = snarkyjs_1.Circuit["if"](pubkey.equals(player1), new snarkyjs_1.Bool(false), new snarkyjs_1.Bool(true));
                        return [4 /*yield*/, this.nextPlayer.get()];
                    case 4:
                        nextPlayer = _b.sent();
                        nextPlayer.assertEquals(player);
                        // set the next player
                        this.nextPlayer.set(player.not());
                        _a = Board.bind;
                        return [4 /*yield*/, this.board.get()];
                    case 5:
                        board = new (_a.apply(Board, [void 0, _b.sent()]))();
                        // 5. update the board (and the state) with our move
                        board.update(x, y, player);
                        this.board.set(board.serialize());
                        won = board.check_winner();
                        this.gameDone.set(won);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, snarkyjs_1.state)(Board)
    ], TicTacToe.prototype, "board");
    __decorate([
        (0, snarkyjs_1.state)(snarkyjs_1.PublicKey)
    ], TicTacToe.prototype, "player1");
    __decorate([
        (0, snarkyjs_1.state)(snarkyjs_1.PublicKey)
    ], TicTacToe.prototype, "player2");
    __decorate([
        (0, snarkyjs_1.state)(snarkyjs_1.Bool)
    ], TicTacToe.prototype, "nextPlayer");
    __decorate([
        (0, snarkyjs_1.state)(snarkyjs_1.Bool)
    ], TicTacToe.prototype, "gameDone");
    __decorate([
        snarkyjs_1.method
    ], TicTacToe.prototype, "play");
    return TicTacToe;
}(snarkyjs_1.SmartContract));
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var Local, player1, player2, snappPrivkey, snappPubkey, snappInstance, b, i, two;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('main');
                    Local = snarkyjs_1.Mina.LocalBlockchain();
                    snarkyjs_1.Mina.setActiveInstance(Local);
                    player1 = Local.testAccounts[0].privateKey;
                    player2 = Local.testAccounts[1].privateKey;
                    console.log('got testing account');
                    snappPrivkey = snarkyjs_1.PrivateKey.random();
                    snappPubkey = snappPrivkey.toPublicKey();
                    // Create a new instance of the contract
                    console.log('\n\n====== DEPLOYING ======\n\n');
                    return [4 /*yield*/, snarkyjs_1.Mina.transaction(player1, function () { return __awaiter(_this, void 0, void 0, function () {
                            var amount, p;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        amount = snarkyjs_1.UInt64.fromNumber(1000000000);
                                        return [4 /*yield*/, snarkyjs_1.Party.createSigned(player2)];
                                    case 1:
                                        p = _a.sent();
                                        p.body.delta = snarkyjs_1.Int64.fromUnsigned(amount).neg();
                                        snappInstance = new TicTacToe(amount, snappPubkey, player1.toPublicKey(), player2.toPublicKey());
                                        return [2 /*return*/];
                                }
                            });
                        }); })
                            .send()
                            .wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, snarkyjs_1.Mina.getAccount(snappPubkey)];
                case 2:
                    b = _a.sent();
                    console.log('init state');
                    for (i in [0, 1, 2, 3, 4, 5, 6, 7]) {
                        console.log('state', i, ':', b.snapp.appState[i].toString());
                    }
                    new Board(b.snapp.appState[0]).print_state();
                    // play
                    console.log('\n\n====== FIRST MOVE ======\n\n');
                    return [4 /*yield*/, snarkyjs_1.Mina.transaction(player1, function () { return __awaiter(_this, void 0, void 0, function () {
                            var x, y, signature;
                            return __generator(this, function (_a) {
                                x = snarkyjs_1.Field.zero;
                                y = snarkyjs_1.Field.zero;
                                signature = snarkyjs_1.Signature.create(player1, [x, y]);
                                snappInstance.play(player1.toPublicKey(), signature, snarkyjs_1.Field.zero, snarkyjs_1.Field.zero);
                                return [2 /*return*/];
                            });
                        }); })
                            .send()
                            .wait()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, snarkyjs_1.Mina.getAccount(snappPubkey)];
                case 4:
                    // debug
                    b = _a.sent();
                    console.log('after first move');
                    new Board(b.snapp.appState[0]).print_state();
                    console.log('did someone win?', b.snapp.appState[6].toString());
                    // play
                    console.log('\n\n====== SECOND MOVE ======\n\n');
                    two = new snarkyjs_1.Field(2);
                    return [4 /*yield*/, snarkyjs_1.Mina.transaction(player1, function () { return __awaiter(_this, void 0, void 0, function () {
                            var x, y, signature;
                            return __generator(this, function (_a) {
                                x = snarkyjs_1.Field.one;
                                y = snarkyjs_1.Field.zero;
                                signature = snarkyjs_1.Signature.create(player2, [x, y]);
                                snappInstance
                                    .play(player2.toPublicKey(), signature, snarkyjs_1.Field.one, snarkyjs_1.Field.zero)["catch"](function (e) { return console.log(e); });
                                return [2 /*return*/];
                            });
                        }); })
                            .send()
                            .wait()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, snarkyjs_1.Mina.getAccount(snappPubkey)];
                case 6:
                    // debug
                    b = _a.sent();
                    console.log('after second move');
                    new Board(b.snapp.appState[0]).print_state();
                    console.log('did someone win?', b.snapp.appState[6].toString());
                    // play
                    console.log('\n\n====== THIRD MOVE ======\n\n');
                    return [4 /*yield*/, snarkyjs_1.Mina.transaction(player1, function () { return __awaiter(_this, void 0, void 0, function () {
                            var x, y, signature;
                            return __generator(this, function (_a) {
                                x = snarkyjs_1.Field.one;
                                y = snarkyjs_1.Field.one;
                                signature = snarkyjs_1.Signature.create(player1, [x, y]);
                                snappInstance
                                    .play(player1.toPublicKey(), signature, snarkyjs_1.Field.one, snarkyjs_1.Field.one)["catch"](function (e) { return console.log(e); });
                                return [2 /*return*/];
                            });
                        }); })
                            .send()
                            .wait()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, snarkyjs_1.Mina.getAccount(snappPubkey)];
                case 8:
                    // debug
                    b = _a.sent();
                    console.log('after third move');
                    new Board(b.snapp.appState[0]).print_state();
                    console.log('did someone win?', b.snapp.appState[6].toString());
                    // play
                    console.log('\n\n====== FOURTH MOVE ======\n\n');
                    return [4 /*yield*/, snarkyjs_1.Mina.transaction(player2, function () { return __awaiter(_this, void 0, void 0, function () {
                            var x, y, signature;
                            return __generator(this, function (_a) {
                                x = two;
                                y = snarkyjs_1.Field.one;
                                signature = snarkyjs_1.Signature.create(player2, [x, y]);
                                snappInstance
                                    .play(player2.toPublicKey(), signature, two, snarkyjs_1.Field.one)["catch"](function (e) { return console.log(e); });
                                return [2 /*return*/];
                            });
                        }); })
                            .send()
                            .wait()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, snarkyjs_1.Mina.getAccount(snappPubkey)];
                case 10:
                    // debug
                    b = _a.sent();
                    console.log('after fourth move');
                    new Board(b.snapp.appState[0]).print_state();
                    console.log('did someone win?', b.snapp.appState[6].toString());
                    // play
                    console.log('\n\n====== FIFTH MOVE ======\n\n');
                    return [4 /*yield*/, snarkyjs_1.Mina.transaction(player1, function () { return __awaiter(_this, void 0, void 0, function () {
                            var x, y, signature;
                            return __generator(this, function (_a) {
                                x = two;
                                y = two;
                                signature = snarkyjs_1.Signature.create(player1, [x, y]);
                                snappInstance
                                    .play(player1.toPublicKey(), signature, two, two)["catch"](function (e) { return console.log(e); });
                                return [2 /*return*/];
                            });
                        }); })
                            .send()
                            .wait()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, snarkyjs_1.Mina.getAccount(snappPubkey)];
                case 12:
                    // debug
                    b = _a.sent();
                    console.log('after fifth move');
                    new Board(b.snapp.appState[0]).print_state();
                    console.log('did someone win?', b.snapp.appState[6].toString());
                    //
                    (0, snarkyjs_1.shutdown)();
                    return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
main();
