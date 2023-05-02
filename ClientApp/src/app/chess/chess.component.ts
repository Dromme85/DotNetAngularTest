import { Component, OnInit } from '@angular/core';

import {
  ChessBoard, ChessPiece, ChessMove, PieceType,
  PiecePawn, PieceRook, PieceBishop, PieceKnight, PieceQueen, PieceKing
} from './chess.objects'

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css']
})
export class ChessComponent implements OnInit {

  public chess: ChessBoard = new ChessBoard;
  public oldSelected: ChessPiece = new ChessPiece;

  constructor() {
    this.resetBoard();
  }

  ngOnInit(): void {
  }

  cellClick(x: number, y: number) {
    var p = this.chess.getPieceAtXY(x, y);

    if (this.oldSelected) {
      if (this.chess.board[x][y]) {
        this.oldSelected.makeMove(x, y);
        if (p.alive && p.color !== this.oldSelected.color) {
          p.alive = false;
          p.pos = [];
        }
        this.chess.nextTurn();
      }

      if (p.alive && p.color === this.chess.turn) {
        this.selectPiece(p);
      }
      else {
        this.clearMoves();
        this.oldSelected.selected = false;
      }
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

    if (p.selected) {
      var pam = p.availableMoves();
      var enemyFound: boolean[] = [false, false, false, false, false, false, false, false];

      for (var i = 0; i < pam.length; i++) {
        var pos = pam[i].newPos;
        var pamp = this.chess.getPieceAtPos(pos);

        if (p.piece === PieceType.pawn) {
          // Pawn kill move
          if (p.pos[0] > pos[0] || p.pos[0] < pos[0]) {
            if (pamp.alive && pamp.color === !this.chess.turn) {
              this.chess.board[pos[0]][pos[1]] = true;
            }
          }
          else if (!pamp.alive) {
            this.chess.board[pos[0]][pos[1]] = true;
          }
        }

        else if (p.piece === PieceType.rook) {
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


          if (isFreeToMove) this.chess.board[pos[0]][pos[1]] = true;
        }

        else if (p.piece === PieceType.bishop) {
          var isFreeToMove = true;

          // North west
          if (p.pos[1] > pos[1] && p.pos[0] > pos[0]) {
            var offset = p.pos[1] - p.pos[0];
            for (var j = p.pos[1] - 1; j >= pos[1]; j--) {
              var checkp = this.chess.getPieceAtXY(j - offset, j);
              if (checkp.alive && checkp.color !== p.color && !enemyFound[0])
                enemyFound[0] = true;
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
              if (checkp.alive && checkp.color !== p.color && !enemyFound[1])
                enemyFound[1] = true;
              else if (checkp.alive)
                isFreeToMove = false;
            }
          }
          // South east
          else if (p.pos[1] < pos[1] && p.pos[0] < pos[0]) {
            var offset = p.pos[1] - p.pos[0];
            for (var j = p.pos[1] + 1; j <= pos[1]; j++) {
              var checkp = this.chess.getPieceAtXY(j - offset, j);
              if (checkp.alive && checkp.color !== p.color && !enemyFound[2])
                enemyFound[2] = true;
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
              if (checkp.alive && checkp.color !== p.color && !enemyFound[3])
                enemyFound[3] = true;
              else if (checkp.alive)
                isFreeToMove = false;
            }
          }

          if (isFreeToMove) this.chess.board[pos[0]][pos[1]] = true;
        }

        else if (p.piece === PieceType.knight) {
          var isFreeToMove = true;

          if (pamp.alive && pamp.color === p.color)
            isFreeToMove = false;

          if (isFreeToMove) this.chess.board[pos[0]][pos[1]] = true;
        }

        else if (p.piece === PieceType.queen) {
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

          if (isFreeToMove) this.chess.board[pos[0]][pos[1]] = true;
        }

        else if (p.piece === PieceType.king) {
          let isFreeToMove = true;

          if (pamp.alive && pamp.color === p.color)
            isFreeToMove = false;
          // TODO: check so the king cant check mate himself!
          else if (!pamp.alive) {
            // Pawn
            let e1 = this.chess.getPieceAtXY(pos[0] + 1, p.color ? pos[1] - 1 : pos[1] + 1);
            let e2 = this.chess.getPieceAtXY(pos[0] - 1, p.color ? pos[1] - 1 : pos[1] + 1);
            if (e1.piece === PieceType.pawn && e1.color !== p.color
              || e2.piece === PieceType.pawn && e2.color !== p.color) {
              isFreeToMove = false;
            }

            // Rook (and half queen)
            let contact: boolean[] = [false, false, false, false];
            for (let j = 1; j < 8; j++) {
              let e = this.chess.getPieceAtXY(pos[0], pos[1] + j);
              if (e.piece === PieceType.rook && e.color !== p.color && !contact[0]
                || e.piece === PieceType.queen && e.color !== p.color && !contact[0]) {
                isFreeToMove = false;
                contact[0] = true;
              }
              else if (e.alive && e.color === p.color && !contact[0]) contact[0] = true;

              e = this.chess.getPieceAtXY(pos[0], pos[1] - j);
              if (e.piece === PieceType.rook && e.color !== p.color && !contact[1]
                || e.piece === PieceType.queen && e.color !== p.color && !contact[1]) {
                isFreeToMove = false;
                contact[1] = true;
              }
              else if (e.alive && e.color === p.color && !contact[1]) contact[1] = true;

              e = this.chess.getPieceAtXY(pos[0] + j, pos[1]);
              if (e.piece === PieceType.rook && e.color !== p.color && !contact[2]
                || e.piece === PieceType.queen && e.color !== p.color && !contact[2]) {
                isFreeToMove = false;
                contact[2] = true;
              }
              else if (e.alive && e.color === p.color && !contact[2]) contact[2] = true;

              e = this.chess.getPieceAtXY(pos[0] - j, pos[1]);
              if (e.piece === PieceType.rook && e.color !== p.color && !contact[3]
                || e.piece === PieceType.queen && e.color !== p.color && !contact[3]) {
                isFreeToMove = false;
                contact[3] = true;
              }
              else if (e.alive && e.color === p.color && !contact[3]) contact[3] = true;
            }

            // Bishop (and half queen)


            // Knight

            // King
          }


          if (isFreeToMove) this.chess.board[pos[0]][pos[1]] = true;
        }
        // end piece checking
      }
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
    // width, height, piece size (rem)
    this.chess.size = [8, 8, 2.5];

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
    p = new PieceRook({ alive: true, piece: PieceType.rook, color: false, pos: [0, 0] })
    this.chess.pieces.push(p);
    p = new PieceRook({ alive: true, piece: PieceType.rook, color: false, pos: [7, 0] })
    this.chess.pieces.push(p);
    p = new PieceRook({ alive: true, piece: PieceType.rook, color: true, pos: [0, 7] })
    this.chess.pieces.push(p);
    p = new PieceRook({ alive: true, piece: PieceType.rook, color: true, pos: [7, 7] })
    this.chess.pieces.push(p);

    // Knights
    p = new PieceKnight({ alive: true, piece: PieceType.knight, color: false, pos: [1, 0] })
    this.chess.pieces.push(p);
    p = new PieceKnight({ alive: true, piece: PieceType.knight, color: false, pos: [6, 0] })
    this.chess.pieces.push(p);
    p = new PieceKnight({ alive: true, piece: PieceType.knight, color: true, pos: [1, 7] })
    this.chess.pieces.push(p);
    p = new PieceKnight({ alive: true, piece: PieceType.knight, color: true, pos: [6, 7] })
    this.chess.pieces.push(p);

    // Bishops
    p = new PieceBishop({ alive: true, piece: PieceType.bishop, color: false, pos: [2, 0] })
    this.chess.pieces.push(p);
    p = new PieceBishop({ alive: true, piece: PieceType.bishop, color: false, pos: [5, 0] })
    this.chess.pieces.push(p);
    p = new PieceBishop({ alive: true, piece: PieceType.bishop, color: true, pos: [2, 7] })
    this.chess.pieces.push(p);
    p = new PieceBishop({ alive: true, piece: PieceType.bishop, color: true, pos: [5, 7] })
    this.chess.pieces.push(p);

    // Queens
    p = new PieceQueen({ alive: true, piece: PieceType.queen, color: false, pos: [3, 0] })
    this.chess.pieces.push(p);
    p = new PieceQueen({ alive: true, piece: PieceType.queen, color: true, pos: [3, 7] })
    this.chess.pieces.push(p);

    // Kings
    p = new PieceKing({ alive: true, piece: PieceType.king, color: false, pos: [4, 0] })
    this.chess.pieces.push(p);
    p = new PieceKing({ alive: true, piece: PieceType.king, color: true, pos: [4, 7] })
    this.chess.pieces.push(p);

    // Pawns
    for (var i = 0; i < 8; i++) {
      p = new PiecePawn({ alive: true, piece: PieceType.pawn, color: false, pos: [i, 1] });
      this.chess.pieces.push(p);
      p = new PiecePawn({ alive: true, piece: PieceType.pawn, color: true, pos: [i, 6] });
      this.chess.pieces.push(p);
    }

    // Test Pieces
    p = new PieceQueen({ alive: true, piece: PieceType.queen, color: true, pos: [3, 3] })
    this.chess.pieces.push(p);
    p = new PieceBishop({ alive: true, piece: PieceType.bishop, color: false, pos: [5, 5] })
    this.chess.pieces.push(p);
    p = new PiecePawn({ alive: true, piece: PieceType.pawn, color: false, pos: [3, 5] })
    this.chess.pieces.push(p);
  }

}
