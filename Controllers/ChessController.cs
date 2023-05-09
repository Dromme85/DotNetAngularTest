using Microsoft.AspNetCore.Mvc;

namespace TestAppDotNetAngular.Controllers;

[ApiController]
[Route("[controller]")]
public class ChessController : ControllerBase
{
	private readonly string[] testNotation = { "1. Nf3 Nf6", "2. c4 g6", "3. Nc3 Bg7" };
	private readonly string[] Notation;

	ChessController() 
	{
		Notation = testNotation;
	}

	public string[] Get()
	{
		return Notation.ToArray();
	}

	public string[] Add(string value)
	{
		return Notation.Append(value).ToArray();
	}
}
