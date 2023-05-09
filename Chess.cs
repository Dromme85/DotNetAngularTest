using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace TestAppDotNetAngular
{
	public class Chess
	{
		[Key]
		public int Id { get; set; }

		public string[] Moves { get; set; }

		//public ChessBoard Game { get; set; }
/*
  public chess: ChessBoard = new ChessBoard;
  public oldSelected: ChessPiece = new ChessPiece;
  public moves: string[] = [];
  public deadLightPieces: ChessPiece[] = [];
  public deadDarkPieces: ChessPiece[] = [];
  public state: StateType = StateType.none;
  public check: boolean = false;
  public notationString: string = '';
  public notationIndex: number = 1;
  public notation: ChessNotation = new ChessNotation;

*/
	}

	/*public class ChessBoard
	{
		public int[] Size { get; set; }
		public bool[,] Board { get; set; }
		public ChessPiece[] Pieces { get; set; }
		public ChessMove[] Moves { get; set; }
		public bool Turn { get; set; }
	}

	public class ChessPiece
	{
		public
	}

	public class ChessMove
	{
		public int[] OldPos { get; set; }
		public int[] NewPos { get; set; }
		public bool Color { get; set; }
		public int PieceId { get; set; }
	}*/

	//public class HeroDbContext : DbContext
	//{
	//	public HeroDbContext(DbContextOptions<HeroDbContext> options) { }
	//	public DbSet<Hero> Hero { get; set; }
	//}

}
