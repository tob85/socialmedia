using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using Backend.Models;

namespace Backend.Data;

public class Db : IdentityDbContext<User>
{
    public Db(DbContextOptions<Db> options) : base(options)
    {
    }

    public DbSet<AutoEmail> AutoEmails => Set<AutoEmail>();
}
