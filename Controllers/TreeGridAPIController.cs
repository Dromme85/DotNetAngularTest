using Microsoft.AspNetCore.Mvc;

namespace TestAppDotNetAngular.Controllers;

[ApiController]
[Route("[controller]")]
public class TreeGridAPIController : ControllerBase
{
	private static GridHandler? GH;

	public TreeGridAPIController()
	{
		if (GH == null)
			GenerateGrid();
	}

	[HttpGet]
	public IEnumerable<TreeGrid> Get()
	{
		//GH.CalculateVisibleTrees();
		//GH.CalculateScenicScores();

		var res = GH.Grid.ToEnumerable().ToArray();

		var returnVal = res.Append(new TreeGrid()
		{
			Data = GH.rowLength,
			Visible = true,
			ScenicScore = -1337,
			Scores = new int[4] { 1, 3, 3, 7 },
			Direction = Array.Empty<bool>()
		});

		return returnVal;
	}
	[HttpGet]
	[Route("gengrid")]
	public IEnumerable<TreeGrid> GenerateGrid()
	{
		return GenerateGrid("");
	}

	[HttpGet]
	[Route("gengrid/{fileName}")]
	public IEnumerable<TreeGrid> GenerateGrid(string fileName)
	{
		GH = null;
		GH = new(fileName);

		GH.CalculateVisibleTrees();
		GH.CalculateScenicScores();

		var res = GH.Grid.ToEnumerable().ToArray();

		var returnVal = res.Append(new TreeGrid()
		{
			Data = GH.rowLength,
			Visible = true,
			ScenicScore = -1337,
			Scores = new int[4] { 1, 3, 3, 7 },
			Direction = Array.Empty<bool>()
		});

		return returnVal;
	}

	// Maybe add method to get grid from source
}

public static class TreeGridHelper {

	public static IEnumerable<T> ToEnumerable<T>(this T[,] target)
	{
		foreach (var item in target)
			yield return item;
	}

	public static TreeGrid[] ToSimpleArray(TreeGrid[,] tg)
	{
		TreeGrid[] tgResult = new TreeGrid[tg.Length];
		int index = 0;
		foreach (var item in tg)
		{
			tgResult[index] = item;
			index++;
		}
		
		return tgResult;
	}
}