using Microsoft.EntityFrameworkCore;


namespace TestAppDotNetAngular {
	public class HeroDbContext : DbContext
	{
		public HeroDbContext(DbContextOptions<HeroDbContext> options)
			:base(options)
		{ }
		public DbSet<Hero> Hero { get; set; }
	}
}
