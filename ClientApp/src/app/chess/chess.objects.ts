
export class ChessBoard {
  size: number[] = [];
  board: boolean[][] = [];
  pieces: ChessPiece[] = [];
  moves: ChessMove[] = [];

  getPieceAtPos(pos: number[]): ChessPiece {
    return this.getPieceAtXY(pos[0], pos[1]);
  }

  getPieceAtXY(x: number, y: number): ChessPiece {
    const i = this.pieces.findIndex(p => p.pos[0] === x && p.pos[1] === y);

    return this.pieces[i];
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
  type: MoveType = -1;
  //pastMoves: ChessMove[] = [];

  constructor(init?: Partial<ChessMove>) {
    Object.assign(this, init);
  }
}

export enum MoveType {
  move, collision, kill, chess, mate, none = -1
}

export enum PieceType {
  pawn, bishop, knight, rook, queen, king, none = -1
}

export class ChessPiece {
  id: number = -1;
  piece: PieceType = -1;
  color: boolean = false;
  pos: number[] = [];
  alive: boolean = false;
  selected: boolean = false;

  availableMoves(): ChessMove[] { return [] }

  makeMove(x: number, y: number) { console.log('Wrong makeMove()'); }

  constructor(init?: Partial<ChessPiece>) {
    Object.assign(this, init);
  }
}

export class PiecePawn extends ChessPiece {
  firstMove: boolean = true;

  availableMoves(): ChessMove[] {
    var m: ChessMove[] = [];
    var cm: ChessMove = new ChessMove({ oldPos: this.pos, newPos: [], color: this.color, pieceId: this.id });
    var mp: number[] = [];

    mp = [this.pos[0], this.color ? this.pos[1] - 1 : this.pos[1] + 1];
    cm.newPos = mp;
    m.push(cm);

    if (this.firstMove) {
      mp = [this.pos[0], this.color ? this.pos[1] - 2 : this.pos[1] + 2];
      cm.newPos = mp;
      m.push(cm);
    }

    return m;
  }

  makeMove(x: number, y: number) {
    var pos: number[] = [x, y];
    var m = this.availableMoves();
    console.log(`makeMove(${pos[0]}, ${pos[1]})`, m);
    for (var i = 0; i < m.length; i++) {
      console.log('inside loop');
      if (m[i].newPos[0] === pos[0] && m[i].newPos[1] === pos[1]) {
        console.log('moving to -> ', pos);
        this.pos = pos;
        this.firstMove = false;
      }
    }
  }
}
