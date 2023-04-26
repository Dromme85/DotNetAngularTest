namespace TestAppDotNetAngular;

public class WeatherForecast
{
	private static readonly string[] Summaries = new[]
	{
		"Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
	};

	public DateOnly Date { get; set; }

    public int TemperatureC { get; set; }

    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

	public string? Summary => CalcSummary(TemperatureC);

	private static string CalcSummary(int temperature)
	{
		return temperature switch
		{
			-20 => Summaries[0],
			int i when i > -20 && i <= -15 => Summaries[1],
			int i when i > -15 && i <= -10 => Summaries[2],
			int i when i > -10 && i <= 0 => Summaries[3],
			int i when i > 0 && i <= 5 => Summaries[4],
			int i when i > 5 && i <= 10 => Summaries[5],
			int i when i > 10 && i <= 20 => Summaries[6],
			int i when i > 20 && i <= 30 => Summaries[7],
			int i when i > 30 && i <= 40 => Summaries[8],
			int i when i > 40 && i <= 55 => Summaries[9],
			_ => "No Weather!",
		};
	}
}

