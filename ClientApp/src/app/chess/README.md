# Chæsck

This chess game is made with Angular.

## Missing Features

- **Castling** (sv. Rockad) - Might take some thinking power to solve, because of all the special rules
  - Short castling - A castle made on the kingside when the King moves to G and the Rook to F
  - Long castling - A castle made on the queenside when the King moves to C and the Rook to D
  - A castle can be made if:
    - The King or Rook hasn't previously moved
    - There are no pieces between the King and the Rook
    - *skippable* - The King isn't in check
    - *skippable* - The King does not pass through or finish on a square that is under attack
- **Check** - Might also require some thinking power to solve
- **Check Mate** - It shouldn't be possible to make more moves after check mate
- **Reset/Give Up** - Button to reset the board should be added
- **Save State** - Game shouldn't be reset on page refresh
  - Save to database?
  - Save locally (session)?
  - Save in cookies?
  - Other alternatives? Look how the treegrid is done.

## Known Bugs

- The King can check himself when attacking another piece. Probably just an order of execution.
