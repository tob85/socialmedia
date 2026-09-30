using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using Backend.Models;
using Backend.Requests;

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
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new
            {
                message = "Email and password are required",
            });
        }

        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                message = "user not registered",
                errors = result.Errors.Select(error => error.Description),
            });
        }

        return Ok(new { message = "user registered" });
    }

    [HttpPost("login")]
    public IActionResult Login()
    {
        return Ok(new { message = "user logged in"});
    }
}
