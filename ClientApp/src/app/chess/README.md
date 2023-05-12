# Chæsck

This chess game is made with Angular.

## Missing Features

- [x] **Castling** (sv. Rockad) - Might take some thinking power to solve, because of all the special rules
  - Short castling - A castle made on the kingside when the King moves to G and the Rook to F
  - Long castling - A castle made on the queenside when the King moves to C and the Rook to D
  - A castle can be made if:
    - The King or Rook hasn't previously moved
    - There are no pieces between the King and the Rook
    - *skippable* - The King isn't in check
    - *skippable* - The King does not pass through or finish on a square that is under attack
- [ ] **Check** - Might also require some thinking power to solve
  - [x] - Detect when a move results in check
  - [ ] - Make it only possible to protect the king or make the king flee when in check
- [x] **Check Mate** - It shouldn't be possible to make more moves after king is dead
- [x] **Promotion** - When a Pawn moves to the other side and gets promoted to a Queen
  - Underpromotion - *skippable* - The player can choose to "underpromote" to Rook, Bishop or Knight in addition to Queen
- [ ] **En Passant** (*Optional*) - [*link*](https://en.wikipedia.org/wiki/En_passant)
  - A pawn can kill an enemy pawn that has moved two square by attacking the passed square
- [x] **(Figurine) Algebraic Notation** (*Optional*) - [*link*](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))
  - The standard method for recording and describing the moves in a game of chess
- [x] **Reset/Give Up** - Button to reset the board should be added
  - More or less done, "Reset Game" doesn't work, but "New Game" (same thing?) do work.
- [x] **Save State** - Game shouldn't be reset on page refresh
  - Save to database?
  - -> Save locally (session)
  - Save to/Load from file, [Portable Game Notation (PGN)](https://en.wikipedia.org/wiki/Portable_Game_Notation)

## Known Bugs

- The King can check himself when attacking another piece. Probably just an order of execution.
