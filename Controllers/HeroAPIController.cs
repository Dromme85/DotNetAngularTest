using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using System.Web;
using System.Xml.Linq;

namespace TestAppDotNetAngular.Controllers;

[ApiController]
[Route("[controller]")]
public class HeroAPIController : ControllerBase
{
	private readonly HeroDbContext _heroDb;
	private readonly ILogger<HeroAPIController> _logger;

	private readonly Hero[] Heroes = new Hero[]
	{
		new Hero { /*Id = 12,*/ Name = "Doktor Dönick", Power = "Annoys people", AlterEgo = "Doktor DumDum, Dumskalle, Idiot" },
		new Hero { /*Id = 13,*/ Name = "Göteborgarn", Power = "The best at dad jokes", AlterEgo = "" },
		new Hero { /*Id = 14,*/ Name = "Smartsören", Power = "Super smart", AlterEgo = "Kalla mig Sören", },
		new Hero { /*Id = 15,*/ Name = "Snörmannen", Power = "Can control any kind of string", AlterEgo = "" },
		new Hero { /*Id = 16,*/ Name = "Klösarn", Power = "Long nails that can scratch", AlterEgo = "" },
		new Hero { /*Id = 17,*/ Name = "Kondoman", Power = "Made of rubber", AlterEgo = "" },
		new Hero { /*Id = 18,*/ Name = "Rövelden", Power = "Shoots flames out of his arse", AlterEgo = "" },
		new Hero { /*Id = 19,*/ Name = "Läderlappen", Power = "Some freak in a bat costume", AlterEgo = "Fatman, Dork Knight", },
		new Hero { /*Id = 20,*/ Name = "Tysken", Power = "Extremely german", AlterEgo = "" },
	};

	public HeroAPIController(ILogger<HeroAPIController> logger, HeroDbContext heroDb)
	{
		_logger = logger;
		_heroDb = heroDb;

		// If for some reason the hero table is empty. Populate it with the Heroes array.
		if (!_heroDb.Hero.Any())
		{
			foreach (var hero in Heroes)
			{
				_heroDb.Hero.Add(hero);
			}
			_heroDb.SaveChanges();
		}
	}

	[HttpGet]
	public IEnumerable<Hero> Get()
	{
		return _heroDb.Hero;
	}

	[HttpGet]
	[Route("getheroes")]
	public IEnumerable<Hero> GetHeroes()
	{
		return _heroDb.Hero;
	}

	[HttpGet]
	[Route("gethero/{id}")]
	public Hero GetHero(int id)
	{
		var heroes = _heroDb.Hero;

		if (heroes.Any(h => h.Id == id))
			return heroes.First(h => h.Id == id);

		return heroes.First();
	}

	[HttpGet]
	[Route("search/{name}")]
	public IEnumerable<Hero> SearchHeroes(string? name)
	{
		var heroes = _heroDb.Hero;

		if (name != null)
			return heroes.Where(h => h.Name.ToLower().Contains(name.ToLower())).ToArray();

		return heroes;
	}

	[HttpPost]
	[Route("addhero")]
	public Hero AddHero([FromBody] Hero hero)
	{
		var heroes = _heroDb.Hero;

		_heroDb.Hero.Add(hero);
		_heroDb.SaveChanges();

		return heroes.First(h => h.Id == hero.Id);
	}

	[HttpPost]
	[Route("edithero")]
	public IEnumerable<Hero> EditHero([FromBody] Hero hero)
	{
		if (_heroDb.Hero.Any(h => h.Id == hero.Id))
		{
			_heroDb.Update(hero);
			_heroDb.SaveChanges();
		}

		return _heroDb.Hero;
	}

	[HttpDelete]
	[Route("deletehero/{id}")]
	public IEnumerable<Hero> DeleteHero(int id)
	{
		if (_heroDb.Hero.Any(h => h.Id == id))
		{
			_heroDb.Hero.Remove(_heroDb.Hero.First(h => h.Id == id));
			_heroDb.SaveChanges();
		}

		return _heroDb.Hero;
	}
}
