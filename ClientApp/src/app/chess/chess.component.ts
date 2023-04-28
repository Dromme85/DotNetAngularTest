import { Component, OnInit } from '@angular/core';

import { ChessBoard, ChessPiece, ChessMove, PieceType, PiecePawn } from './chess.objects'

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css']
})
export class ChessComponent implements OnInit {

  public chess: ChessBoard = new ChessBoard;
  public oldSelected?: ChessPiece = new ChessPiece;

  constructor() {
    this.resetBoard();
  }

  ngOnInit(): void {
  }

  cellClick(x: number, y: number) {
    var p = this.chess.getPieceAtXY(x, y);

    if (!this.oldSelected) return;
    // TODO: Move piece logic here
    if (this.chess.board[x][y]) {
      this.oldSelected.makeMove(x, y);
    }

    if (p)
      this.selectPiece(p);
    else {
      this.clearMoves();
      this.oldSelected.selected = false;
    }
  }

  selectPiece(p?: ChessPiece) {
    if (!p) return;

    if (p === this.oldSelected) {
      this.oldSelected = undefined;
    }

    if (this.oldSelected)
      this.oldSelected.selected = false;

    p.selected = true;
    this.oldSelected = p;

    this.clearMoves();

    for (var i = 0; i < p.availableMoves().length; i++) {
      var pos = p.availableMoves()[i].newPos;
      //if (this.chess.getPieceAtPos(pos))
      this.chess.board[pos[0]][pos[1]] = true;
    }
  }

  clearMoves() {
    for (var i = 0; i < this.chess.board.length; i++) {
      for (var j = 0; j < this.chess.board[i].length; j++) {
        this.chess.board[i][j] = false;
      }
    }
  }

  resetBoard() {
    this.chess.size = [8, 8, 2.5];
    //this.chess.board = Array(this.chess.size[0] * this.chess.size[1]);

    for (var i = 0; i < this.chess.size[0]; i++) {
      this.chess.board[i] = [];
      for (var j = 0; j < this.chess.size[1]; j++) {
        this.chess.board[i][j] = false;
      }
    }

    // Add Pieces
    this.chess.pieces = [];
    var p: ChessPiece;

    // Rooks
    p = new ChessPiece({ alive: true, piece: PieceType.rook, color: false, pos: [0, 0] })
    this.chess.pieces.push(p);
    p = new ChessPiece({ alive: true, piece: PieceType.rook, color: false, pos: [7, 0] })
    this.chess.pieces.push(p);
    p = new ChessPiece({ alive: true, piece: PieceType.rook, color: true, pos: [0, 7] })
    this.chess.pieces.push(p);
    p = new ChessPiece({ alive: true, piece: PieceType.rook, color: true, pos: [7, 7] })
    this.chess.pieces.push(p);

    // Knights
    p = new ChessPiece({ alive: true, piece: PieceType.knight, color: false, pos: [1, 0] })
    this.chess.pieces.push(p);
    p = new ChessPiece({ alive: true, piece: PieceType.knight, color: false, pos: [6, 0] })
    this.chess.pieces.push(p);
    p = new ChessPiece({ alive: true, piece: PieceType.knight, color: true, pos: [1, 7] })
    this.chess.pieces.push(p);
    p = new ChessPiece({ alive: true, piece: PieceType.knight, color: true, pos: [6, 7] })
    this.chess.pieces.push(p);

    // Bishops
    p = new ChessPiece({ alive: true, piece: PieceType.bishop, color: false, pos: [2, 0] })
    this.chess.pieces.push(p);
    p = new ChessPiece({ alive: true, piece: PieceType.bishop, color: false, pos: [5, 0] })
    this.chess.pieces.push(p);
    p = new ChessPiece({ alive: true, piece: PieceType.bishop, color: true, pos: [2, 7] })
    this.chess.pieces.push(p);
    p = new ChessPiece({ alive: true, piece: PieceType.bishop, color: true, pos: [5, 7] })
    this.chess.pieces.push(p);

    // Queens
    p = new ChessPiece({ alive: true, piece: PieceType.queen, color: false, pos: [3, 0] })
    this.chess.pieces.push(p);
    p = new ChessPiece({ alive: true, piece: PieceType.queen, color: true, pos: [3, 7] })
    this.chess.pieces.push(p);

    // Kings
    p = new ChessPiece({ alive: true, piece: PieceType.king, color: false, pos: [4, 0] })
    this.chess.pieces.push(p);
    p = new ChessPiece({ alive: true, piece: PieceType.king, color: true, pos: [4, 7] })
    this.chess.pieces.push(p);

    // Pawns
    for (var i = 0; i < 8; i++) {
      p = new PiecePawn({ alive: true, piece: PieceType.pawn, color: false, pos: [i, 1] });
      this.chess.pieces.push(p);
      p = new PiecePawn({ alive: true, piece: PieceType.pawn, color: true, pos: [i, 6] });
      this.chess.pieces.push(p);
    }
  }

}
