using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using Microsoft.IdentityModel.Tokens;
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json.Nodes;

namespace TestAppDotNetAngular.Controllers;

[ApiController]
[Route("[controller]")]
public class ChessAPIController : ControllerBase
{
	private readonly string[] testNotation = {
		"1. Nf3 Nf6", "2. c4 g6", "3. Nc3 Bg7", "4. d4 O-O", "5. Bf4 d5",
		"6. Qb3 dxc4", "7. Qxc4 c6", "8. e4 Nbd7", "9. Rd1 Nb6", "10. Qc5 Bg4",
		"11. Bg5 Na4", "12. Qa3 Nxc3", "13. bxc3 Nxe4", "14. Bxe7 Qb6", "15. Bc4 Nxc3",
		"16. Bc5 Rfe8+", "17. Kf1 Be6", "18. Bxb6 Bxc4+", "19. Kg1 Ne2+", "20. Kf1 Nxd4+",
		"21. Kg1 Ne2+", "22. Kf1 Nc3+", "23. Kg1 axb6", "24. Qb4 Ra4", "25. Qxb6 Nxd1",
		"26. h3 Rxa2", "27. Kh2 Nxf2", "28. Re1 Rxe1", "29. Qd8+ Bf8", "30. Nxe1 Bd5",
		"31. Nf3 Ne4", "32. Qb8 b5", "33. h4 h5", "34. Ne5 Kg7", "35. Kg1 Bc5+",
		"36. Kf1 Ng3+", "37. Ke1 Bb4+", "38. Kd1 Bb3+", "39. Kc1 Ne2+", "40. Kb1 Nc3+",
		//"41. Kc1 Rc2# 0-1",
	};

	private static List<Notation> Notations { get; set; }
	private static int CurrentIndex { get; set; }

	public ChessAPIController()
	{
		if (Notations.IsNullOrEmpty())
		{
			Notations = new List<Notation>
			{
				new Notation { Id = 0, Moves = testNotation }
			};
		}
	}

	[HttpGet]
	[Route("getnotation")]
	public string[] Get()
	{
		var res = Notations.ElementAt(CurrentIndex);
		if (res == null)
			return Notations.First().Moves;

		return res.Moves;
	}

	[HttpPost]
	[Route("addnotation")]
	public string[] Add([FromBody] JsonObject value)
	{
		string s = value.First().Value.ToString();
		var res = Notations[CurrentIndex];

		var tl = res.Moves.ToList();
		tl.Add(s);
		res.Moves = tl.ToArray();

		return res.Moves.Reverse().ToArray();
	}

	[HttpDelete]
	[Route("removenotation/{value}")]
	public void Delete(int value)
	{
		var res = Notations[CurrentIndex];

		var tl = res.Moves.ToList();
		tl.RemoveRange(tl.Count - value, value);
		res.Moves = tl.ToArray();

		//return res.Moves.Reverse().ToArray();
	}

	[HttpGet]
	[Route("newnotation")]
	public int New()
	{
		CurrentIndex++;
		Notations.Add(new Notation { Id = CurrentIndex, Moves = Array.Empty<String>() });

		return CurrentIndex;
	}

	[HttpPost]
	[Route("resetnotation/{index}")]
	public string[] ResetNotation(int index)
	{
		if (Notations.Any(x => x.Id == index))
			Notations.RemoveAt(index);

		if (CurrentIndex == index)
			CurrentIndex = 0;

		return Notations[CurrentIndex].Moves.Reverse().ToArray();
	}
}
