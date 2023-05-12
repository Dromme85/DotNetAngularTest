
export class ChessBoard {
  size: number[] = [];
  board: boolean[][] = [];
  pieces: ChessPiece[] = [];
  moves: ChessMove[] = [];
  turn: boolean = true;

  nextTurn() {
    this.turn = !this.turn;
  }

  getTurnText(reverse: boolean = false): string {
    if (reverse) return this.turn ? "Silver" : "Gold";
    return this.turn ? "Gold" : "Silver";
  }

  getPieceAtPos(pos: number[]): ChessPiece {
    return this.getPieceAtXY(pos[0], pos[1]);
  }

  getPieceAtXY(x: number, y: number): ChessPiece {
    const i = this.pieces.findIndex(p => p.pos[0] === x && p.pos[1] === y);

    if (i === -1)
      return this.pieces[0];

    return this.pieces[i];
  }

  anyPieceAtPos(pos: number[]): boolean {
    return this.anyPieceAtXY(pos[0], pos[1]);
  }

  anyPieceAtXY(x: number, y: number): boolean {
    const i = this.pieces.findIndex(p => p.pos[0] === x && p.pos[1] === y);

    if (i === -1)
      return false;

    return true;
  }

  getPieceName(p: PieceType): string {
    return PieceType[p];
  }
}

export class ChessMove {
  oldPos: number[] = [];
  newPos: number[] = [];
  color: boolean = false;
  pieceId: number = -1;
  //type: MoveType = -1;
  //pastMoves: ChessMove[] = [];

  constructor(init?: Partial<ChessMove>) {
    Object.assign(this, init);
  }
}

export enum StateType {
  piece, kill, move, promotion, castle, check, mate, draw, stale, forfeit, none = -1
}

export enum PieceType {
  pawn, rook, knight, bishop, queen, king, none = -1
}


export class ChessPiece {
  static inc: number = -1;
  id: number = -1;
  piece: PieceType = -1;
  color: boolean = false;
  pos: number[] = [];
  alive: boolean = false;
  selected: boolean = false;
  hasMoved: boolean = false;

  availableMoves(): ChessMove[] { return [] }

  makeMove(x: number, y: number) { console.log('Wrong makeMove()'); }

  constructor(init?: Partial<ChessPiece>) {
    Object.assign(this, init);
    this.id = ChessPiece.inc++;
  }

  getType(): string {
    return PieceType[this.piece];
  }

  getColor(): string {
    return this.color ? "Gold" : "Silver";
  }
}

export class PieceRook extends ChessPiece {

  availableMoves(): ChessMove[] {
    var m: ChessMove[] = [];
    var cm: ChessMove = new ChessMove({ oldPos: this.pos, newPos: [], color: this.color, pieceId: this.id });
    var mp: number[] = [];

    // Up
    if (this.pos[1] > 0) {
      for (var i = 1; i <= this.pos[1]; i++) {
        mp = [this.pos[0], this.pos[1] - i];
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Down
    if (this.pos[1] < 8) {
      for (var i = 1; i < 8 - this.pos[1]; i++) {
        mp = [this.pos[0], this.pos[1] + i];
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Right
    if (this.pos[0] > 0) {
      for (var i = 1; i <= this.pos[0]; i++) {
        mp = [this.pos[0] - i, this.pos[1]];
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Left
    if (this.pos[0] < 8) {
      for (var i = 1; i < 8 - this.pos[0]; i++) {
        mp = [this.pos[0] + i, this.pos[1]];
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    return m;
  }

  makeMove(x: number, y: number) {
    if (!this.hasMoved) this.hasMoved = true;
    var pos: number[] = [x, y];
    var m = this.availableMoves();
    for (var i = 0; i < m.length; i++) {
      if (m[i].newPos[0] === pos[0] && m[i].newPos[1] === pos[1]) {
        this.pos = pos;
      }
    }
  }
}

export class PieceBishop extends ChessPiece {

  availableMoves(): ChessMove[] {
    var m: ChessMove[] = [];
    var cm: ChessMove = new ChessMove({ oldPos: this.pos, newPos: [], color: this.color, pieceId: this.id });
    var mp: number[] = [];

    // Up Left
    for (var i = 1; i < 8; i++) {
      mp = [this.pos[0] - i, this.pos[1] - i];
      if (mp[0] >= 0 && mp[1] >= 0) {
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Up Right
    for (var i = 1; i < 8; i++) {
      mp = [this.pos[0] + i, this.pos[1] - i];
      if (mp[0] < 8 && mp[1] >= 0) {
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Down Left
    for (var i = 1; i < 8; i++) {
      mp = [this.pos[0] - i, this.pos[1] + i];
      if (mp[0] >= 0 && mp[1] < 8) {
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Down Right
    for (var i = 1; i < 8 - this.pos[1]; i++) {
      mp = [this.pos[0] + i, this.pos[1] + i];
      if (mp[0] < 8 && mp[1] < 8) {
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    return m;
  }

  makeMove(x: number, y: number) {
    var pos: number[] = [x, y];
    var m = this.availableMoves();
    for (var i = 0; i < m.length; i++) {
      if (m[i].newPos[0] === pos[0] && m[i].newPos[1] === pos[1]) {
        this.pos = pos;
      }
    }
  }
}

export class PieceKnight extends ChessPiece {

  availableMoves(): ChessMove[] {
    var m: ChessMove[] = [];
    var cm: ChessMove = new ChessMove({ oldPos: this.pos, newPos: [], color: this.color, pieceId: this.id });
    var mp: number[] = [];

    // Up
    mp = [this.pos[0] + 1, this.pos[1] - 2];
    if (mp[0] < 8 && mp[1] >= 0) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    mp = [this.pos[0] - 1, this.pos[1] - 2];
    if (mp[0] >= 0 && mp[1] >= 0) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    // Down
    mp = [this.pos[0] + 1, this.pos[1] + 2];
    if (mp[0] < 8 && mp[1] < 8) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    mp = [this.pos[0] - 1, this.pos[1] + 2];
    if (mp[0] >= 0 && mp[1] < 8) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    // Right
    mp = [this.pos[0] + 2, this.pos[1] + 1];
    if (mp[0] < 8 && mp[1] < 8) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    mp = [this.pos[0] + 2, this.pos[1] - 1];
    if (mp[0] < 8 && mp[1] >= 0) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    // Left
    mp = [this.pos[0] - 2, this.pos[1] + 1];
    if (mp[0] >= 0 && mp[1] < 8) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    mp = [this.pos[0] - 2, this.pos[1] - 1];
    if (mp[0] >= 0 && mp[1] >= 0) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    return m;
  }

  makeMove(x: number, y: number) {
    var pos: number[] = [x, y];
    var m = this.availableMoves();
    for (var i = 0; i < m.length; i++) {
      if (m[i].newPos[0] === pos[0] && m[i].newPos[1] === pos[1]) {
        this.pos = pos;
      }
    }
  }
}

export class PieceQueen extends ChessPiece {

  availableMoves(): ChessMove[] {
    var m: ChessMove[] = [];
    var cm: ChessMove = new ChessMove({ oldPos: this.pos, newPos: [], color: this.color, pieceId: this.id });
    var mp: number[] = [];

    // Up
    if (this.pos[1] > 0) {
      for (var i = 1; i <= this.pos[1]; i++) {
        mp = [this.pos[0], this.pos[1] - i];
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Down
    if (this.pos[1] < 8) {
      for (var i = 1; i < 8 - this.pos[1]; i++) {
        mp = [this.pos[0], this.pos[1] + i];
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Right
    if (this.pos[0] > 0) {
      for (var i = 1; i <= this.pos[0]; i++) {
        mp = [this.pos[0] - i, this.pos[1]];
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Left
    if (this.pos[0] < 8) {
      for (var i = 1; i < 8 - this.pos[0]; i++) {
        mp = [this.pos[0] + i, this.pos[1]];
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Up Left
    for (var i = 1; i < 8; i++) {
      mp = [this.pos[0] - i, this.pos[1] - i];
      if (mp[0] >= 0 && mp[1] >= 0) {
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Up Right
    for (var i = 1; i < 8; i++) {
      mp = [this.pos[0] + i, this.pos[1] - i];
      if (mp[0] < 8 && mp[1] >= 0) {
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Down Left
    for (var i = 1; i < 8; i++) {
      mp = [this.pos[0] - i, this.pos[1] + i];
      if (mp[0] >= 0 && mp[1] < 8) {
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    // Down Right
    for (var i = 1; i < 8 - this.pos[1]; i++) {
      mp = [this.pos[0] + i, this.pos[1] + i];
      if (mp[0] < 8 && mp[1] < 8) {
        cm.newPos = mp;
        m.push(new ChessMove(cm));
      }
    }

    return m;
  }

  makeMove(x: number, y: number) {
    var pos: number[] = [x, y];
    var m = this.availableMoves();
    for (var i = 0; i < m.length; i++) {
      if (m[i].newPos[0] === pos[0] && m[i].newPos[1] === pos[1]) {
        this.pos = pos;
      }
    }
  }
}

export class PieceKing extends ChessPiece {

  availableMoves(): ChessMove[] {
    var m: ChessMove[] = [];
    var cm: ChessMove = new ChessMove({ oldPos: this.pos, newPos: [], color: this.color, pieceId: this.id });
    var mp: number[] = [];

    mp = [this.pos[0] + 1, this.pos[1] + 1];
    if (mp[0] < 8 && mp[1] < 8) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    mp = [this.pos[0] + 1, this.pos[1] - 1];
    if (mp[0] < 8 && mp[1] >= 0) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    mp = [this.pos[0] + 1, this.pos[1]];
    if (mp[0] < 8) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    mp = [this.pos[0] - 1, this.pos[1] + 1];
    if (mp[0] >= 0 && mp[1] < 8) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    mp = [this.pos[0] - 1, this.pos[1] - 1];
    if (mp[0] >= 0 && mp[1] >= 0) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    mp = [this.pos[0] - 1, this.pos[1]];
    if (mp[0] >= 0) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    mp = [this.pos[0], this.pos[1] + 1];
    if (mp[1] < 8) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    mp = [this.pos[0], this.pos[1] - 1];
    if (mp[1] >= 0) {
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    // Castling move (this only checks if the King has moved before)
    if (!this.hasMoved) {
      mp = [this.pos[0] - 2, this.pos[1]];
      cm.newPos = mp;
      m.push(new ChessMove(cm));

      mp = [this.pos[0] + 2, this.pos[1]];
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    return m;
  }

  makeMove(x: number, y: number) {
    var pos: number[] = [x, y];
    var m = this.availableMoves();
    for (var i = 0; i < m.length; i++) {
      if (m[i].newPos[0] === pos[0] && m[i].newPos[1] === pos[1]) {
        this.pos = pos;
      }
    }
    if (!this.hasMoved) {
      this.hasMoved = true;
    }
  }
}

export class PiecePawn extends ChessPiece {
  firstMove: boolean = true;

  availableMoves(): ChessMove[] {
    if (this.pos[1] === 0 || this.pos[1] === 7) return [];

    var m: ChessMove[] = [];
    var cm: ChessMove = new ChessMove({ oldPos: this.pos, newPos: [], color: this.color, pieceId: this.id });
    var mp: number[] = [];

    mp = [this.pos[0], this.color ? this.pos[1] - 1 : this.pos[1] + 1];
    cm.newPos = mp;
    m.push(new ChessMove(cm));

    if (this.pos[0] < 7) {
      mp = [this.pos[0] + 1, this.color ? this.pos[1] - 1 : this.pos[1] + 1];
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    if (this.pos[0] > 0) {
      mp = [this.pos[0] - 1, this.color ? this.pos[1] - 1 : this.pos[1] + 1];
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    if (this.firstMove) {
      mp = [this.pos[0], this.color ? this.pos[1] - 2 : this.pos[1] + 2];
      cm.newPos = mp;
      m.push(new ChessMove(cm));
    }

    //console.log('Available Moves: ', m)

    return m;
  }

  makeMove(x: number, y: number) {
    var pos: number[] = [x, y];
    var m = this.availableMoves();
    //console.log(`makeMove(${pos[0]}, ${pos[1]})`, m);
    for (var i = 0; i < m.length; i++) {
      //console.log('inside loop');
      if (m[i].newPos[0] === pos[0] && m[i].newPos[1] === pos[1]) {
        //console.log('moving to -> ', pos);
        this.pos = pos;
        this.firstMove = false;
      }
    }
  }
}

export class ChessNotation {
  notations: [StateType, string][] = []

  add(n: StateType, s: string = '') {
    this.notations.push([n, s]);
  }

  getText(): string {
    let result = '';
    this.notations.sort((a, b) => a[0] as number - b[0] as number)
    for (var i = 0; i < this.notations.length; i++) {
      switch (this.notations[i][0]) {
        case StateType.move: // a1
          result += this.notations[i][1];
          break;
        case StateType.piece: // P
          result += this.notations[i][1];
          break;
        case StateType.castle: // O-O or O-O-O
          return this.notations[i][1];
        case StateType.kill: // x
          result += 'x';
          break;
        case StateType.promotion: // x
          result += 'Q';
          break;
        case StateType.check: // +
          result += '+';
          break;
        case StateType.mate: // # 1-0 or 0-1
          result += this.notations[i][1];
          break;
        case StateType.draw: // ½-½
          result += ' ½-½';
          break;
        case StateType.stale:
          result += ' 0-0';
          break;
        default: break;
      }
    }
    return result;
  }

  reset() {
    this.notations = [];
  }
}
