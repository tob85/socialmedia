using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> userManager;

    public AuthController(UserManager<User> userManager)
    {
        this.userManager = userManager;
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { message = "api is working"});
    }

    [HttpPost("register")]
    public IActionResult Register()
    {
        return Ok(new { message = "user registered"});
    }

    [HttpPost("login")]
    public IActionResult Login()
    {
        return Ok(new { message = "user logged in"});
    }
}
