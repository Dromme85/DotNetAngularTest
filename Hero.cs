using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace TestAppDotNetAngular
{
	public class Hero
	{
		[Key]
		public int Id { get; set; }

		[Required]
		public string Name { get; set; }
		public string Power { get; set; }
		public string AlterEgo { get; set; }
	}

	//public class HeroDbContext : DbContext
	//{
	//	public HeroDbContext(DbContextOptions<HeroDbContext> options) { }
	//	public DbSet<Hero> Hero { get; set; }
	//}

}

/*
	export interface Hero {
	  id: number;
	  name: string;
	  power: string;
	  alterEgo?: string;
	}

 */