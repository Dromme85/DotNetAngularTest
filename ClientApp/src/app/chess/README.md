# Chæsck

This chess game is made with Angular.

## Missing Features

- Castling (sv. Rockad) - Might take some thinking power to solve, because of all the special rules.
  - Short castling - A castle made on the kingside when the King moves to G and the Rook to F
  - Long castling - A castle made on the queenside when the King moves to C and the Rook to D
  - A castle can't be made if:
    - The King or Rook previously moved
    - There are no pieces between the King and the Rook
    - *skippable* - The King isn't in check
    - *skippable* - The King does not pass through or finish on a square that is under attack
- Check - Might also require some thinking power to solve.

## Known Bugs

- The King can check himself when attacking another piece. Probably just an order of execution.
