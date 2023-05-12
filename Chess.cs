using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace TestAppDotNetAngular
{
	public class Notation
	{
		[Key]
		public int Id { get; set; }

		public string[] Moves { get; set; }
	}
}
