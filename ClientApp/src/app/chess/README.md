# Chæsck

This chess game is made with Angular.

## Missing Features

- [ ] **Check** - Might also require some thinking power to solve
  - [x] Detect when a move results in check
  - [ ] Make it only possible to protect the king or make the king flee when in check
  - [ ] *Discovered check*. ie. when a piece moves and King get checked by another piece
- [ ] **Check Mate** - It shouldn't be possible to make more moves after king is dead
  - [x] Game is over if King dies (lazy check mate)
  - [ ] Set mate when King can't move or be protected
- [ ] **En Passant** (*Optional*) - [*link*](https://en.wikipedia.org/wiki/En_passant)
  - A pawn can kill an enemy pawn that has moved two square by attacking the passed square

## Implemented Features

- [x] **Check Mate** - It shouldn't be possible to make more moves after king is dead
- [x] **Castling** (sv. Rockad) - Might take some thinking power to solve, because of all the special rules
  - Short castling - A castle made on the kingside when the King moves to G and the Rook to F
  - Long castling - A castle made on the queenside when the King moves to C and the Rook to D
  - A castle can be made if:
    - The King or Rook hasn't previously moved
    - There are no pieces between the King and the Rook
    - *skippable* - The King isn't in check
    - *skippable* - The King does not pass through or finish on a square that is under attack
- [x] **Promotion** - When a Pawn moves to the other side and gets promoted to a Queen
  - Underpromotion - *skippable* - The player can choose to "underpromote" to Rook, Bishop or Knight in addition to Queen
- [x] **(Figurine) Algebraic Notation** (*Optional*) - [*link*](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))
- [x] **Reset/Give Up** - Button to reset the board should be added
  - More or less done, "Reset Game" doesn't work, but "New Game" (same thing?) do work.
- [x] **Save State** - Game shouldn't be reset on page refresh
  - Save to database?
  - -> Save locally (session)
  - Save to/Load from file, [Portable Game Notation (PGN)](https://en.wikipedia.org/wiki/Portable_Game_Notation)
  - The standard method for recording and describing the moves in a game of chess

## Known Bugs and Problems

- The King can check himself when attacking another piece. Probably just an order of execution.
- Rolling back and playing from that state does not update the API version correct. Need to remove moves from API as well.
