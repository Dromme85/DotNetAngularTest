import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs'
import {
  ChessBoard, ChessPiece, ChessMove, PieceType, StateType, ChessNotation,
  PiecePawn, PieceRook, PieceBishop, PieceKnight, PieceQueen, PieceKing,
} from './chess.objects';
import { ChessService } from './chess.service';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css']
})

export class ChessComponent implements OnInit {

  public debug: boolean = false;

  public chess: ChessBoard = new ChessBoard;
  public oldSelected: ChessPiece = new ChessPiece;
  public moves: string[] = [];
  public newMoves: string[] = [];
  public deadLightPieces: ChessPiece[] = [];
  public deadDarkPieces: ChessPiece[] = [];
  public state: StateType = StateType.none;
  public check: boolean = false;
  public notationString: string = '';
  public notationIndex: number = 1;
  public notation: ChessNotation = new ChessNotation;
  public notationOffset: number = 0;
  public chessIndex?: number = 0;

  constructor(
    private chessService: ChessService,
  ) {
    this.loadBoard();
  }

  ngOnInit(): void {
  }

  getStateText(): string {
    return StateType[this.state];
  }

  forfeit() {
    this.state = StateType.forfeit;
  }

  async loadNotation() {
    this.resetBoard();
    await this.chessService.getNotation().then(data => this.newMoves = data);
  }

  saveNotation(n: string) {
    console.log('Trying to save moves.');
    this.chessService.addNotation(n)
      .subscribe(data => this.moves = data);
  }

  notationTop() {
    if (this.notationOffset > 0) this.notationOffset = 0;
    this.loadBoard(this.chessIndex, true);
  }

  notationUp() {
    if (this.notationOffset > 0) this.notationOffset--;
    this.loadBoard(this.chessIndex, true);
  }

  notationDown() {
    if (this.notationOffset < this.newMoves.length - 1) this.notationOffset++;
    this.loadBoard(this.chessIndex, true);
  }

  notationBottom() {
    if (this.notationOffset < this.newMoves.length - 1) this.notationOffset = this.newMoves.length - 1;
    this.loadBoard(this.chessIndex, true);
  }

  cellClick(x: number, y: number) {

    let p = this.chess.getPieceAtXY(x, y);

    if (this.state === StateType.mate) {
      if (this.debug) {
        if (p.alive)
          this.selectPiece(p);
        else
          this.oldSelected.selected = false;
      }

      return;
    }

    if (this.chess.board[x][y] && this.oldSelected !== p) {
      let oldPos: number[] = this.oldSelected.pos;

      this.oldSelected.makeMove(x, y);
      // Castling
      if (this.state === StateType.castle && this.oldSelected.piece === PieceType.king) {
        // Kingside
        if (this.oldSelected.pos[0] === 6) {
          let c = this.chess.getPieceAtPos([7, this.oldSelected.pos[1]]);
          c.makeMove(5, this.oldSelected.pos[1]);
          this.notation.add(StateType.castle, 'O-O');
        }
        // Queenside
        else if (this.oldSelected.pos[0] === 2) {
          let c = this.chess.getPieceAtPos([0, this.oldSelected.pos[1]]);
          c.makeMove(3, this.oldSelected.pos[1]);
          this.notation.add(StateType.castle, 'O-O-O');
        }
      }
      if (this.oldSelected.piece === PieceType.rook || this.oldSelected.piece === PieceType.knight)
        this.notation.add(StateType.piece, `${this.getPieceLetter(this.oldSelected.piece)}${this.getXLetter(oldPos[0]).toLowerCase()}`);
      else
        this.notation.add(StateType.piece, `${this.getPieceLetter(this.oldSelected.piece)}`);

      if (this.testCheckMove(this.oldSelected)) {
        this.check = true;
        this.state = StateType.check;
      }
      else this.check = false;

      if (this.state !== StateType.check) this.state = StateType.move;

      if (p.alive && p.color !== this.oldSelected.color) {
        // TODO: This is temporary, check mate should be set because the king can't flee or be protected, not killed
        this.state = p.piece === PieceType.king ? StateType.mate : StateType.kill;
        if (this.state === StateType.kill)
          this.notation.add(this.state);

        if (this.oldSelected.piece === PieceType.pawn)
          this.notation.add(StateType.piece, this.getXLetter(oldPos[0]).toLowerCase());

        p.alive = false;
        p.pos = [];
      }
      this.notation.add(StateType.move, `${this.getXLetter(this.oldSelected.pos[0]).toLowerCase() }${this.getYLetter(this.oldSelected.pos[1], true)}`);

      if (this.oldSelected.piece === PieceType.pawn) {
        if (this.oldSelected.pos[1] === 0 || this.oldSelected.pos[1] === 7) {
          let i = this.chess.pieces.findIndex(op => op.id === this.oldSelected.id);
          this.chess.pieces[i] = new PieceQueen({ alive: true, piece: PieceType.queen, color: this.oldSelected.color, pos: this.oldSelected.pos });
          this.notation.add(StateType.promotion);
        }
      }

      if (this.check && this.state !== StateType.mate) {
        this.state = StateType.check;
        this.notation.add(this.state);
      }

      if (this.state === StateType.mate) {
        this.notation.add(this.state, `# ${this.chess.turn ? '1-0' : '0-1'}`);
      }

      if (this.notationOffset > 0) {
        for (var i = 0; i < this.notationOffset; i++) {
          //this.moves.shift();
          this.newMoves.pop();
        }
        console.log(`removenotation/${this.notationOffset}`);
        this.chessService.removeNotation(this.notationOffset);
        this.notationOffset = 0;
      }

      if (this.chess.turn) {
        this.moves.unshift(`${this.notationIndex++}. ${this.notation.getText()}`);
        this.newMoves.push(this.moves[0]);
      }
      else {
        this.moves[0] += ' ' + this.notation.getText();
        this.newMoves[this.newMoves.length - 1] = this.moves[0];
        this.saveNotation(this.moves[0]);
      }
      this.notation.reset();

      this.chess.nextTurn();
      this.deadLightPieces = this.chess.pieces.filter(p => !p.alive && p.color && p.id !== 0);
      this.deadDarkPieces = this.chess.pieces.filter(p => !p.alive && !p.color && p.id !== 0);
    }

    if (p.alive && p.color === this.chess.turn) {
      this.selectPiece(p);
    }
    else {
      this.clearMoves();
      this.oldSelected.selected = false;
    }

  }

  test() {
    console.log(this.chess.pieces);
    //console.log(this.chess.board);
  }

  selectPiece(p?: ChessPiece) {
    if (!p) return;

    if (p !== this.oldSelected) {
      this.oldSelected.selected = false;
    }

    if (p.selected) {
      p.selected = false;
    }
    else {
      p.selected = true;
    }
    this.oldSelected = p;

    this.clearMoves();

    if (p.selected && this.state !== StateType.mate
      || p.selected && (this.state !== StateType.mate && this.debug)) {
      var pam = p.availableMoves();
      var enemyFound: boolean[] = [false, false, false, false, false, false, false, false];

      for (var i = 0; i < pam.length; i++) {
        var pos = pam[i].newPos;
        var pamp = this.chess.getPieceAtPos(pos);

        switch (p.piece) {
          case PieceType.pawn:
            this.chess.board[pos[0]][pos[1]] = this.testPawnMove(p, pamp, pos);
            break;
          case PieceType.rook:
            this.chess.board[pos[0]][pos[1]] = this.testRookMove(p, pos, enemyFound);
            if (this.chess.board[pos[0]][pos[1]]) {
              this.chess.board[pos[0]][pos[1]] = !this.willKingBeCheck(pam[i].newPos);
            }
            break;
          case PieceType.bishop:
            this.chess.board[pos[0]][pos[1]] = this.testBishopMove(p, pos, enemyFound);
            if (this.chess.board[pos[0]][pos[1]]) {
              this.chess.board[pos[0]][pos[1]] = !this.willKingBeCheck(pam[i].oldPos);
            }
            break;
          case PieceType.knight:
            this.chess.board[pos[0]][pos[1]] = this.testKnightMove(p, pamp, pos);
            break;
          case PieceType.queen:
            this.chess.board[pos[0]][pos[1]] = this.testQueenMove(p, pos, enemyFound);
            break;
          case PieceType.king:
            this.chess.board[pos[0]][pos[1]] = this.testKingMove(p as PieceKing, pamp, pos);
            break;
          default: break;
        }

      }
    }
  }

  testPawnMove(p: ChessPiece, pamp: ChessPiece, pos: number[]): boolean {

    let isFreeToMove: boolean = false;

    // Pawn kill move
    if (p.pos[0] > pos[0] || p.pos[0] < pos[0]) {
      if (pamp.alive && pamp.color === !this.chess.turn) {
        isFreeToMove = true;
      }
    }
    else if (!pamp.alive) {
      // if position above piece is not the same as checked position ...
      if (p.pos[1] - 1 !== pos[1]) {
        // ... check if the position above has a piece and if it's alive
        if (!this.chess.anyPieceAtXY(p.pos[0], p.pos[1] - 1)) {
          isFreeToMove = true;
        }
      }
      else if (p.pos[1] - 1 === pos[1]) {
        isFreeToMove = true;
      }

      if (p.pos[1] + 1 !== pos[1]) {
        if (!this.chess.anyPieceAtXY(p.pos[0], p.pos[1] + 1)) {
          isFreeToMove = true;
        }
      }
      else if (p.pos[1] + 1 === pos[1]) {
        isFreeToMove = true;
      }
    }

    return isFreeToMove;
  }

  testRookMove(p: ChessPiece, pos: number[], enemyFound: boolean[], ip: number[] = [10, 0]): boolean {

    let isFreeToMove = true;
    let wip = ip[0] === 10 ? false : true;

    // North
    if (p.pos[1] > pos[1] && p.pos[0] === pos[0]) {
      for (var j = p.pos[1] - 1; j >= pos[1]; j--) {
        var checkp = this.chess.getPieceAtXY(p.pos[0], j);
        if (ip[1] === j && wip)
          isFreeToMove = true;
        else if (checkp.alive && checkp.color !== p.color && !enemyFound[0])
          enemyFound[0] = true;
        else if (checkp.alive)
          isFreeToMove = false;
      }
    }
    // East
    else if (p.pos[0] < pos[0] && p.pos[1] === pos[1]) {
      for (var j = p.pos[0] + 1; j <= pos[0]; j++) {
        var checkp = this.chess.getPieceAtXY(j, p.pos[1]);
        if (ip[0] === j && wip)
          isFreeToMove = true;
        else if (checkp.alive && checkp.color !== p.color && !enemyFound[1])
          enemyFound[1] = true;
        else if (checkp.alive)
          isFreeToMove = false;
      }
    }
    // South
    else if (p.pos[1] < pos[1] && p.pos[0] === pos[0]) {
      for (var j = p.pos[1] + 1; j <= pos[1]; j++) {
        var checkp = this.chess.getPieceAtXY(p.pos[0], j);
        if (ip[1] === j && wip)
          isFreeToMove = true;
        else if (checkp.alive && checkp.color !== p.color && !enemyFound[2])
          enemyFound[2] = true;
        else if (checkp.alive)
          isFreeToMove = false;
      }
    }
    // West
    else if (p.pos[0] > pos[0] && p.pos[1] === pos[1]) {
      for (var j = p.pos[0] - 1; j >= pos[0]; j--) {
        var checkp = this.chess.getPieceAtXY(j, p.pos[1]);
        if (ip[0] === j && wip)
          isFreeToMove = true;
        else if (checkp.alive && checkp.color !== p.color && !enemyFound[3])
          enemyFound[3] = true;
        else if (checkp.alive)
          isFreeToMove = false;
      }
    }

    return isFreeToMove;
  }

  testBishopMove(p: ChessPiece, pos: number[], enemyFound: boolean[], ip: number[] = [10, 0]): boolean {

    let isFreeToMove = true;
    let wip = ip[0] === 10 ? false : true;

    // North west
    if (p.pos[1] > pos[1] && p.pos[0] > pos[0]) {
      var offset = p.pos[1] - p.pos[0];
      for (var j = p.pos[1] - 1; j >= pos[1]; j--) {
        var checkp = this.chess.getPieceAtXY(j - offset, j);
        if (checkp.alive && checkp.color !== p.color && !enemyFound[0])
          enemyFound[0] = true;
        else if (checkp.alive) {
          isFreeToMove = false;
        console.log('nw checkp', checkp);
        }
        if (this.posIsEqual(ip, checkp.pos) && wip && checkp.alive)
          isFreeToMove = true;

        if (this.posIsEqual(checkp.pos, [2, 4]))
          console.log('why is me false?')
      }
    }
    // North east
    else if (p.pos[0] < pos[0] && p.pos[1] > pos[1]) {
      var offset = p.pos[0] - p.pos[1];
      var k = p.pos[0];
      for (var j = p.pos[1] - 1; j >= pos[1]; j--) {
        k++;
        var checkp = this.chess.getPieceAtXY(k, j);
        if (checkp.alive && checkp.color !== p.color && !enemyFound[1])
          enemyFound[1] = true;
        else if (checkp.alive) {
          isFreeToMove = false;
        console.log('ne checkp', checkp);
        }
        if (this.posIsEqual(ip, checkp.pos) && wip && checkp.alive)
            isFreeToMove = true;
      }
    }
    // South east
    else if (p.pos[1] < pos[1] && p.pos[0] < pos[0]) {
      var offset = p.pos[1] - p.pos[0];
      for (var j = p.pos[1] + 1; j <= pos[1]; j++) {
        var checkp = this.chess.getPieceAtXY(j - offset, j);
        if (checkp.alive && checkp.color !== p.color && !enemyFound[2])
          enemyFound[2] = true;
        else if (checkp.alive) {
          isFreeToMove = false;
        console.log('se checkp', checkp);
        }
        if (this.posIsEqual(ip, checkp.pos) && wip && checkp.alive)
          isFreeToMove = true;
      }
    }
    // South west
    else if (p.pos[0] > pos[0] && p.pos[1] < pos[1]) {
      var offset = p.pos[0] - p.pos[1];
      var k = p.pos[0];
      for (var j = p.pos[1] + 1; j <= pos[1]; j++) {
        k--;
        var checkp = this.chess.getPieceAtXY(k, j);
        if (checkp.alive && checkp.color !== p.color && !enemyFound[3])
          enemyFound[3] = true;
        else if (checkp.alive) {
          isFreeToMove = false;
        console.log('sw checkp', checkp);
        }
        if (this.posIsEqual(ip, checkp.pos) && wip && checkp.alive)
            isFreeToMove = true;
      }
    }

    return isFreeToMove;
  }

  testKnightMove(p: ChessPiece, pamp: ChessPiece, pos: number[]): boolean {

    var isFreeToMove = true;

    if (pamp.alive && pamp.color === p.color)
      isFreeToMove = false;

    if (isFreeToMove) this.chess.board[pos[0]][pos[1]] = true;

    return isFreeToMove;
  }

  testQueenMove(p: ChessPiece, pos: number[], enemyFound: boolean[]): boolean {
    var isFreeToMove = true;

    // North
    if (p.pos[1] > pos[1] && p.pos[0] === pos[0]) {
      for (var j = p.pos[1] - 1; j >= pos[1]; j--) {
        var checkp = this.chess.getPieceAtXY(p.pos[0], j);
        if (checkp.alive && checkp.color !== p.color && !enemyFound[0])
          enemyFound[0] = true;
        else if (checkp.alive)
          isFreeToMove = false;
      }
    }
    // East
    else if (p.pos[0] < pos[0] && p.pos[1] === pos[1]) {
      for (var j = p.pos[0] + 1; j <= pos[0]; j++) {
        var checkp = this.chess.getPieceAtXY(j, p.pos[1]);
        if (checkp.alive && checkp.color !== p.color && !enemyFound[1])
          enemyFound[1] = true;
        else if (checkp.alive)
          isFreeToMove = false;
      }
    }
    // South
    else if (p.pos[1] < pos[1] && p.pos[0] === pos[0]) {
      for (var j = p.pos[1] + 1; j <= pos[1]; j++) {
        var checkp = this.chess.getPieceAtXY(p.pos[0], j);
        if (checkp.alive && checkp.color !== p.color && !enemyFound[2])
          enemyFound[2] = true;
        else if (checkp.alive)
          isFreeToMove = false;
      }
    }
    // West
    else if (p.pos[0] > pos[0] && p.pos[1] === pos[1]) {
      for (var j = p.pos[0] - 1; j >= pos[0]; j--) {
        var checkp = this.chess.getPieceAtXY(j, p.pos[1]);
        if (checkp.alive && checkp.color !== p.color && !enemyFound[3])
          enemyFound[3] = true;
        else if (checkp.alive)
          isFreeToMove = false;
      }
    }

    // North west
    else if (p.pos[1] > pos[1] && p.pos[0] > pos[0]) {
      var offset = p.pos[1] - p.pos[0];
      for (var j = p.pos[1] - 1; j >= pos[1]; j--) {
        var checkp = this.chess.getPieceAtXY(j - offset, j);
        if (checkp.alive && checkp.color !== p.color && !enemyFound[4])
          enemyFound[4] = true;
        else if (checkp.alive)
          isFreeToMove = false;
      }
    }
    // North east
    else if (p.pos[0] < pos[0] && p.pos[1] > pos[1]) {
      var offset = p.pos[0] - p.pos[1];
      var k = p.pos[0];
      for (var j = p.pos[1] - 1; j >= pos[1]; j--) {
        k++;
        var checkp = this.chess.getPieceAtXY(k, j);
        if (checkp.alive && checkp.color !== p.color && !enemyFound[5])
          enemyFound[5] = true;
        else if (checkp.alive)
          isFreeToMove = false;
      }
    }
    // South east
    else if (p.pos[1] < pos[1] && p.pos[0] < pos[0]) {
      var offset = p.pos[1] - p.pos[0];
      for (var j = p.pos[1] + 1; j <= pos[1]; j++) {
        var checkp = this.chess.getPieceAtXY(j - offset, j);
        if (checkp.alive && checkp.color !== p.color && !enemyFound[6])
          enemyFound[6] = true;
        else if (checkp.alive)
          isFreeToMove = false;
      }
    }
    // South west
    else if (p.pos[0] > pos[0] && p.pos[1] < pos[1]) {
      var offset = p.pos[0] - p.pos[1];
      var k = p.pos[0];
      for (var j = p.pos[1] + 1; j <= pos[1]; j++) {
        k--;
        var checkp = this.chess.getPieceAtXY(k, j);
        if (checkp.alive && checkp.color !== p.color && !enemyFound[7])
          enemyFound[7] = true;
        else if (checkp.alive)
          isFreeToMove = false;
      }
    }

    return isFreeToMove;
  }

  testKingMove(p: PieceKing, pamp: ChessPiece, pos: number[]): boolean {
    let isFreeToMove = true;

    if (pamp.alive && pamp.color === p.color) {
      isFreeToMove = false;
    }

    // Make sure the king cant check mate himself!
    else if (!pamp.alive) {
      // Castling
      if (!p.hasMoved) {
        let rr = this.chess.getPieceAtPos([7, p.pos[1]]) as PieceRook;
        let lr = this.chess.getPieceAtPos([0, p.pos[1]]) as PieceRook;
        if (rr.piece === PieceType.rook && !rr.hasMoved && pos[0] === 6) {
          if (!this.chess.anyPieceAtPos([5, p.pos[1]])) {
            this.state = StateType.castle;
          }
          else {
            isFreeToMove = false;
          }
        }
        else if (lr.piece === PieceType.rook && !lr.hasMoved && pos[0] === 2) {
          if (!this.chess.anyPieceAtPos([3, p.pos[1]])
            && !this.chess.anyPieceAtPos([1, p.pos[1]])) {
            this.state = StateType.castle;
          }
          else {
            isFreeToMove = false;
          }
        }
      }

      // Pawn
      let e1 = this.chess.getPieceAtXY(pos[0] + 1, p.color ? pos[1] - 1 : pos[1] + 1);
      let e2 = this.chess.getPieceAtXY(pos[0] - 1, p.color ? pos[1] - 1 : pos[1] + 1);
      if (e1.piece === PieceType.pawn && e1.color !== p.color
        || e2.piece === PieceType.pawn && e2.color !== p.color) {
        isFreeToMove = false;
      }

      // Rook (and half queen)
      let contact: boolean[] = [false, false, false, false, false, false, false, false];
      for (let j = 1; j < 8; j++) {
        let e = this.chess.getPieceAtXY(pos[0], pos[1] + j);
        if (e.piece === PieceType.rook && e.color !== p.color && !contact[0]
          || e.piece === PieceType.queen && e.color !== p.color && !contact[0]) {
          isFreeToMove = false;
          contact[0] = true;
        }
        else if (e.alive && !contact[0]) contact[0] = true;

        e = this.chess.getPieceAtXY(pos[0], pos[1] - j);
        if (e.piece === PieceType.rook && e.color !== p.color && !contact[1]
          || e.piece === PieceType.queen && e.color !== p.color && !contact[1]) {
          isFreeToMove = false;
          contact[1] = true;
        }
        else if (e.alive && !contact[1]) contact[1] = true;

        e = this.chess.getPieceAtXY(pos[0] + j, pos[1]);
        if (e.piece === PieceType.rook && e.color !== p.color && !contact[2]
          || e.piece === PieceType.queen && e.color !== p.color && !contact[2]) {
          isFreeToMove = false;
          contact[2] = true;
        }
        else if (e.alive && !contact[2]) contact[2] = true;

        e = this.chess.getPieceAtXY(pos[0] - j, pos[1]);
        if (e.piece === PieceType.rook && e.color !== p.color && !contact[3]
          || e.piece === PieceType.queen && e.color !== p.color && !contact[3]) {
          isFreeToMove = false;
          contact[3] = true;
        }
        else if (e.alive && !contact[3]) contact[3] = true;

        // Bishop (and other half queen)
        e = this.chess.getPieceAtXY(pos[0] - j, pos[1] - j);
        if (e.piece === PieceType.bishop && e.color !== p.color && !contact[4]
          || e.piece === PieceType.queen && e.color !== p.color && !contact[4]) {
          isFreeToMove = false;
          contact[4] = true;
        }
        else if (e.alive && !contact[4]) contact[4] = true;

        e = this.chess.getPieceAtXY(pos[0] + j, pos[1] - j);
        if (e.piece === PieceType.bishop && e.color !== p.color && !contact[5]
          || e.piece === PieceType.queen && e.color !== p.color && !contact[5]) {
          isFreeToMove = false;
          contact[5] = true;
        }
        else if (e.alive && !contact[5]) contact[5] = true;

        e = this.chess.getPieceAtXY(pos[0] - j, pos[1] + j);
        if (e.piece === PieceType.bishop && e.color !== p.color && !contact[6]
          || e.piece === PieceType.queen && e.color !== p.color && !contact[6]) {
          isFreeToMove = false;
          contact[6] = true;
        }
        else if (e.alive && !contact[6]) contact[6] = true;

        e = this.chess.getPieceAtXY(pos[0] + j, pos[1] + j);
        if (e.piece === PieceType.bishop && e.color !== p.color && !contact[7]
          || e.piece === PieceType.queen && e.color !== p.color && !contact[7]) {
          isFreeToMove = false;
          contact[7] = true;
        }
        else if (e.alive && !contact[7]) contact[7] = true;
      }

      // Knight
      let e: ChessPiece[] = [
        this.chess.getPieceAtXY(pos[0] + 1, pos[1] + 2),
        this.chess.getPieceAtXY(pos[0] + 1, pos[1] - 2),
        this.chess.getPieceAtXY(pos[0] - 1, pos[1] + 2),
        this.chess.getPieceAtXY(pos[0] - 1, pos[1] - 2),
        this.chess.getPieceAtXY(pos[0] + 2, pos[1] + 1),
        this.chess.getPieceAtXY(pos[0] + 2, pos[1] - 1),
        this.chess.getPieceAtXY(pos[0] - 2, pos[1] + 1),
        this.chess.getPieceAtXY(pos[0] - 2, pos[1] - 1),
      ];
      for (var j = 0; j < e.length; j++) {
        if (e[j].piece === PieceType.knight && e[j].color !== p.color) {
          isFreeToMove = false;
        }
      }

      // King
      e = [
        this.chess.getPieceAtXY(pos[0], pos[1] - 1),
        this.chess.getPieceAtXY(pos[0] + 1, pos[1] - 1),
        this.chess.getPieceAtXY(pos[0] + 1, pos[1]),
        this.chess.getPieceAtXY(pos[0] + 1, pos[1] + 1),
        this.chess.getPieceAtXY(pos[0], pos[1] + 1),
        this.chess.getPieceAtXY(pos[0] - 1, pos[1] + 1),
        this.chess.getPieceAtXY(pos[0] - 1, pos[1]),
        this.chess.getPieceAtXY(pos[0] - 1, pos[1] - 1),
      ];
      for (var j = 0; j < e.length; j++) {
        if (e[j].piece === PieceType.king && e[j].color !== p.color) {
          isFreeToMove = false;
        }
      }
    }
    return isFreeToMove;
  }

  testCheckMove(p: ChessPiece, ignorePos: number[] = [10, 10]): boolean {

    // TODO: check if 'p' can kill the king
    let pam = p.availableMoves();

    for (var i = 0; i < pam.length; i++) {
      let pamp = this.chess.getPieceAtPos(pam[i].newPos);
      //console.log(`sp = ${ignorePos} vs ${pamp.pos}`);
      if (pamp.piece === PieceType.king && pamp.color !== p.color) {
        // test the position
        switch (p.piece) {
          case PieceType.pawn: return this.testPawnMove(p, pamp, pamp.pos);
          case PieceType.rook:
            if (ignorePos[0] !== 10)
              this.testRookMove(p, pamp.pos, [false, false, false, false], ignorePos);
            return this.testRookMove(p, pamp.pos, [false, false, false, false]);
          case PieceType.bishop:
            if (ignorePos[0] !== 10)
              this.testRookMove(p, pamp.pos, [false, false, false, false], ignorePos);
            return this.testBishopMove(p, pamp.pos, [false, false, false, false]);
          case PieceType.knight: return this.testKnightMove(p, pamp, pamp.pos);
          case PieceType.queen: return this.testQueenMove(p, pamp.pos, [false, false, false, false, false, false, false, false]);
          case PieceType.king: return this.testKingMove(p as PieceKing, pamp, pamp.pos);
        }
      }
    }

    return false;
  }

  willKingBeCheck(pos: number[]): boolean {

    const ps = this.chess.pieces;
    for (var i = 0; i < ps.length; i++) {
      if (this.testCheckMove(ps[i], pos)) {
        return true;
      }
    }

    return false;
  }

  clearMoves() {
    for (var i = 0; i < this.chess.board.length; i++) {
      for (var j = 0; j < this.chess.board[i].length; j++) {
        this.chess.board[i][j] = false;
      }
    }
  }

  async newGame() {
    this.notationOffset = 0;
    const nn$ = this.chessService.newNotation();
    this.chessIndex = await lastValueFrom(nn$);
    console.log('Creating a new game', this.chessIndex);

    this.loadBoard(this.chessIndex);
  }

  resetBoard() {
    // width, height, piece size (rem)
    this.chess.size = [8, 8, 2.5];
    this.chess.turn = true;
    this.moves = [];
    this.deadLightPieces = [];
    this.deadDarkPieces = [];
    this.state = StateType.none;
    this.check = false;
    this.notationIndex = 1;

    this.chessService.resetNotation();

    for (var i = 0; i < this.chess.size[0]; i++) {
      this.chess.board[i] = [];
      for (var j = 0; j < this.chess.size[1]; j++) {
        this.chess.board[i][j] = false;
      }
    }

    // Add Pieces
    this.chess.pieces = [];
    var p: ChessPiece;

    // Null piece
    p = new PieceRook({ alive: false, piece: PieceType.none, color: false, pos: [] });
    this.chess.pieces.push(p);

    // Pawns
    for (var i = 0; i < 8; i++) {
      p = new PiecePawn({ alive: true, piece: PieceType.pawn, color: false, pos: [i, 1] });
      this.chess.pieces.push(p);
      p = new PiecePawn({ alive: true, piece: PieceType.pawn, color: true, pos: [i, 6] });
      this.chess.pieces.push(p);
    }

    // Rooks
    p = new PieceRook({ alive: true, piece: PieceType.rook, color: false, pos: [0, 0] });
    this.chess.pieces.push(p);
    p = new PieceRook({ alive: true, piece: PieceType.rook, color: false, pos: [7, 0] });
    this.chess.pieces.push(p);
    p = new PieceRook({ alive: true, piece: PieceType.rook, color: true, pos: [0, 7] });
    this.chess.pieces.push(p);
    p = new PieceRook({ alive: true, piece: PieceType.rook, color: true, pos: [7, 7] });
    this.chess.pieces.push(p);

    // Knights
    p = new PieceKnight({ alive: true, piece: PieceType.knight, color: false, pos: [1, 0] });
    this.chess.pieces.push(p);
    p = new PieceKnight({ alive: true, piece: PieceType.knight, color: false, pos: [6, 0] });
    this.chess.pieces.push(p);
    p = new PieceKnight({ alive: true, piece: PieceType.knight, color: true, pos: [1, 7] });
    this.chess.pieces.push(p);
    p = new PieceKnight({ alive: true, piece: PieceType.knight, color: true, pos: [6, 7] });
    this.chess.pieces.push(p);

    // Bishops
    p = new PieceBishop({ alive: true, piece: PieceType.bishop, color: false, pos: [2, 0] });
    this.chess.pieces.push(p);
    p = new PieceBishop({ alive: true, piece: PieceType.bishop, color: false, pos: [5, 0] });
    this.chess.pieces.push(p);
    p = new PieceBishop({ alive: true, piece: PieceType.bishop, color: true, pos: [2, 7] });
    this.chess.pieces.push(p);
    p = new PieceBishop({ alive: true, piece: PieceType.bishop, color: true, pos: [5, 7] });
    this.chess.pieces.push(p);

    // Queens
    p = new PieceQueen({ alive: true, piece: PieceType.queen, color: false, pos: [3, 0] });
    this.chess.pieces.push(p);
    p = new PieceQueen({ alive: true, piece: PieceType.queen, color: true, pos: [3, 7] });
    this.chess.pieces.push(p);

    // Kings
    p = new PieceKing({ alive: true, piece: PieceType.king, color: false, pos: [4, 0] });
    this.chess.pieces.push(p);
    p = new PieceKing({ alive: true, piece: PieceType.king, color: true, pos: [4, 7] });
    this.chess.pieces.push(p);

    // Test Pieces
    if (this.debug) {
      //p = new PiecePawn({ alive: true, piece: PieceType.pawn, color: true, pos: [4, 4] });
      //this.chess.pieces.push(p);
      //p = new PieceKnight({ alive: true, piece: PieceType.knight, color: true, pos: [3, 2] });
      //this.chess.pieces.push(p);
      //p = new PieceRook({ alive: true, piece: PieceType.rook, color: true, pos: [5, 5] });
      //this.chess.pieces.push(p);
    }
  }

  loadBoard(index: number = -1, reload: boolean = false): boolean {

    if (index === -1 && this.chessIndex) index = this.chessIndex;
    this.state = StateType.none;

    (async () => {

      if (!reload)
        await this.loadNotation();
      else
        this.resetBoard();

      //console.log('Current Moves:', this.newMoves);
      //console.log('LoadBoard() started!');
      for (var i = 0; i < this.newMoves.length - this.notationOffset; i++) {

        this.moves.unshift(this.newMoves[i]);
        //console.log('Iterating Moves:', this.moves);

        let n = this.newMoves[i].split(' ');
        for (var j = 0; j < n.length; j++) {
          let pt: PieceType = PieceType.pawn;
          let pos: number[] = [];
          let sl: string = '';
          if (this.state === StateType.none) {
            //console.warn('Working on', n[j]);
            this.notationIndex = +n[0].trimEnd() + 1;
            let c = n[j][0];
            if (c.match(/[RNBQK]/)) {
              //console.log(`Piece found: ${PieceType[this.getPieceType(c)]}`);
              pt = this.getPieceType(c);
              if (n[j][1] === 'x') {
                this.state = StateType.kill;
                pos = [this.getXPos(n[j][2]), this.getYPos(n[j][3])];
                //console.log(`${PieceType[this.getPieceType(c)]} kill`, pos);
              }
              else if (n[j][1].match(/[a-h]/)) {
                if (n[j][2] === 'x') {
                  this.state = StateType.kill;
                  pos = [this.getXPos(n[j][3]), this.getYPos(n[j][4])];
                  //console.log(`${PieceType[this.getPieceType(c)]} kill`, pos);
                }
                else if (n[j][2].match(/[a-h]/)) {
                  this.state = StateType.move;
                  pos = [this.getXPos(n[j][2]), this.getYPos(n[j][3])];
                  sl = n[j][1];
                  //console.log(`Pos found: ${sl}(${this.getXPos(sl)})${n[j][2]}${n[j][3]}`);
                }
                else {
                  this.state = StateType.move;
                  pos = [this.getXPos(n[j][1]), this.getYPos(n[j][2])];
                  //console.log(`Pos found: ${n[j][1]}${n[j][2]}`);
                }

              }
            }
            else if (c.match(/[a-h]/)) {
              if (n[j][1] === 'x') {
                this.state = StateType.kill;
                pos = [this.getXPos(n[j][2]), this.getYPos(n[j][3])];
                //console.log('Pawn kill', pos);
              }
              else if (n[j][1].match(/[1-8]/)) {
                this.state = StateType.move;
                pos = [this.getXPos(c), this.getYPos(n[j][1])];
                //console.log(`Pawn Pos found: ${c}${n[j][1]}`);
              }
            }
            else if (n[j] === 'O-O' || n[j] === 'O-O-O') {
              this.state = StateType.castle;
              //console.log('Castling found', n[j]);
            }
            else {

            }
          }

          let pid = -1;
          //console.log('Current State:', StateType[this.state]);

          if (pos[0] !== undefined) {

            let pieces = this.chess.pieces.filter(a => a.piece === pt && a.color === this.chess.turn);

            for (var l = 0; l < pieces.length; l++) {
              let pams = pieces[l].availableMoves();
              for (var m = 0; m < pams.length; m++) {
                let pam = pams[m];
                if (pt === PieceType.pawn) {
                  if (this.state === StateType.kill
                    && (pos[0] === pam.oldPos[0] + 1 || pos[0] === pam.oldPos[0] - 1)
                    && pam.newPos[0] === pos[0] && pam.newPos[1] === pos[1]) {
                    pid = pam.pieceId;
                    m = pams.length;
                    l = pieces.length;
                    //console.log('Pawn kill id:', pid);
                  }
                  else if (this.state === StateType.move && pam.oldPos[0] === pam.newPos[0]
                    && pam.newPos[0] === pos[0] && pam.newPos[1] === pos[1]) {
                    pid = pam.pieceId;
                    m = pams.length;
                    l = pieces.length;
                  }
                }
                else {
                  if (this.state === StateType.move && sl !== '') {
                    if (this.getXPos(sl) === pam.oldPos[0]
                      && pam.newPos[0] === pos[0] && pam.newPos[1] === pos[1]) {
                      pid = pam.pieceId;
                      m = pams.length;
                      l = pieces.length;
                    }
                  }
                  else if (pam.newPos[0] === pos[0] && pam.newPos[1] === pos[1]) {
                    pid = pam.pieceId;
                    m = pams.length;
                    l = pieces.length;
                  }
                }

              }
            }

          }

          if (pid >= 0) {
            //console.log(`${PieceType[pt]} moves to [${pos[0]}, ${pos[1]}](${n[j]})`);
            let pToDie: ChessPiece;
            if (this.state === StateType.kill) {
              pToDie = this.chess.getPieceAtPos(pos);
              pToDie.alive = false;
              pToDie.pos = [];
              this.deadLightPieces = this.chess.pieces.filter(p => !p.alive && p.color && p.id !== 0);
              this.deadDarkPieces = this.chess.pieces.filter(p => !p.alive && !p.color && p.id !== 0);
            }
            pid = this.chess.pieces.findIndex(id => id.id === pid);
            this.chess.pieces[pid].makeMove(pos[0], pos[1]);
            this.chess.nextTurn();
            this.state = StateType.none;
          }
          else if (this.state === StateType.castle) {
            if (n[j].length === 3) { // Kingside castling moves (O-O)
              if (this.chess.turn) {
                let k = this.chess.getPieceAtPos([4, 7]);
                let r = this.chess.getPieceAtPos([7, 7]);
                let kid = this.chess.pieces.findIndex(id => id.id === k.id);
                let rid = this.chess.pieces.findIndex(id => id.id === r.id);

                this.chess.pieces[kid].makeMove(6, 7);
                this.chess.pieces[rid].makeMove(5, 7);
              }
              else {
                let k = this.chess.getPieceAtPos([4, 0]);
                let r = this.chess.getPieceAtPos([7, 0]);
                let kid = this.chess.pieces.findIndex(id => id.id === k.id);
                let rid = this.chess.pieces.findIndex(id => id.id === r.id);

                this.chess.pieces[kid].makeMove(6, 0);
                this.chess.pieces[rid].makeMove(5, 0);
              }
            }
            else if (n[j].length === 5) { // Queenside castling moves (O-O-O)
              if (this.chess.turn) {
                let k = this.chess.getPieceAtPos([4, 7]);
                let r = this.chess.getPieceAtPos([0, 7]);
                let kid = this.chess.pieces.findIndex(id => id.id === k.id);
                let rid = this.chess.pieces.findIndex(id => id.id === r.id);

                this.chess.pieces[kid].makeMove(2, 7);
                this.chess.pieces[rid].makeMove(3, 7);
              }
              else {
                let k = this.chess.getPieceAtPos([4, 0]);
                let r = this.chess.getPieceAtPos([0, 0]);
                let kid = this.chess.pieces.findIndex(id => id.id === k.id);
                let rid = this.chess.pieces.findIndex(id => id.id === r.id);

                this.chess.pieces[kid].makeMove(2, 0);
                this.chess.pieces[rid].makeMove(3, 0);
              }
            }

            this.chess.nextTurn();
            this.state = StateType.none;
          }

        }
      }

    })();

    return false;
  }

  posIsEqual(p1: number[], p2: number[]): boolean {
    let res = p1[0] === p2[0] && p1[1] === p2[1] ? true : false;
    return res;
  }

  getXLetter(y: number, reverse: boolean = false): string {
    switch (y) {
      case 0: return reverse ? 'H' : 'A';
      case 1: return reverse ? 'G' : 'B';
      case 2: return reverse ? 'F' : 'C';
      case 3: return reverse ? 'E' : 'D';
      case 4: return reverse ? 'D' : 'E';
      case 5: return reverse ? 'C' : 'F';
      case 6: return reverse ? 'B' : 'G';
      case 7: return reverse ? 'A' : 'H';
      default: return '';
    }
  }

  getYLetter(y: number, reverse: boolean = false): string {
    switch (y) {
      case 0: return reverse ? '8' : '1';
      case 1: return reverse ? '7' : '2';
      case 2: return reverse ? '6' : '3';
      case 3: return reverse ? '5' : '4';
      case 4: return reverse ? '4' : '5';
      case 5: return reverse ? '3' : '6';
      case 6: return reverse ? '2' : '7';
      case 7: return reverse ? '1' : '8';
      default: return '';
    }
  }

  getPieceLetter(p: PieceType): string {
    switch (p) {
      case PieceType.pawn: return '';
      case PieceType.rook: return 'R';
      case PieceType.knight: return 'N';
      case PieceType.bishop: return 'B';
      case PieceType.queen: return 'Q';
      case PieceType.king: return 'K';
      case PieceType.none: return '';
      default: return '';
    }
  }

  getPieceType(p: string): PieceType {
    switch (p) {
      case 'R': return PieceType.rook;
      case 'N': return PieceType.knight;
      case 'B': return PieceType.bishop;
      case 'Q': return PieceType.queen;
      case 'K': return PieceType.king;
      default: return PieceType.none;
    }
  }

  getXPos(x: string): number {
    switch (x) {
      case 'a': return 0;
      case 'b': return 1;
      case 'c': return 2;
      case 'd': return 3;
      case 'e': return 4;
      case 'f': return 5;
      case 'g': return 6;
      case 'h': return 7;
      default: return -1;
    }
  }

  getYPos(y: string): number {
    switch (y) {
      case '8': return 0;
      case '7': return 1;
      case '6': return 2;
      case '5': return 3;
      case '4': return 4;
      case '3': return 5;
      case '2': return 6;
      case '1': return 7;
      default: return -1;
    }
  }

}
