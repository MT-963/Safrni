using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.DTOs;
using safrni.Models;
using safrni.Services;
using AutoMapper;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly SafrniDbContext _context;
    private readonly IAuthService _authService;
    private readonly IMapper _mapper;

    public AuthController(SafrniDbContext context, IAuthService authService, IMapper mapper)
    {
        _context = context;
        _authService = authService;
        _mapper = mapper;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
        {
            return BadRequest(new { message = "Email and password are required" });
        }

        // Find seller by email
        var seller = await _context.Sellers
            .FirstOrDefaultAsync(s => s.Email == loginDto.Email);

        if (seller == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // Check if seller is active
        if (seller.IsActive != 1)
        {
            return Unauthorized(new { message = "Account is deactivated" });
        }

        // Verify password
        if (string.IsNullOrEmpty(seller.PasswordHash))
        {
            return Unauthorized(new { message = "Account not properly configured. Please contact administrator." });
        }

        if (!_authService.VerifyPassword(loginDto.Password, seller.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // Generate JWT token
        var sellerDto = _mapper.Map<SellerDto>(seller);
        var token = _authService.GenerateJwtToken(sellerDto);

        return Ok(new LoginResponseDto
        {
            SellerId = seller.SellerId,
            Name = seller.Name,
            Email = seller.Email ?? "",
            Role = seller.Role,
            Token = token
        });
    }

    [HttpPost("register")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SellerDto>> Register([FromBody] RegisterDto registerDto)
    {
        if (string.IsNullOrEmpty(registerDto.Email) || string.IsNullOrEmpty(registerDto.Password))
        {
            return BadRequest(new { message = "Email and password are required" });
        }

        // Check if email already exists
        var existingSeller = await _context.Sellers
            .FirstOrDefaultAsync(s => s.Email == registerDto.Email);

        if (existingSeller != null)
        {
            return BadRequest(new { message = "Email already exists" });
        }

        // Create new seller
        var seller = new Seller
        {
            Name = registerDto.Name,
            Email = registerDto.Email,
            PasswordHash = _authService.HashPassword(registerDto.Password),
            Role = registerDto.Role ?? "Employee",
            IsActive = 1,
            CreatedAt = DateTime.Now
        };

        _context.Sellers.Add(seller);
        await _context.SaveChangesAsync();

        var sellerDto = _mapper.Map<SellerDto>(seller);
        return CreatedAtAction(nameof(GetProfile), new { id = seller.SellerId }, sellerDto);
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var sellerId = int.Parse(userIdClaim.Value);
        var seller = await _context.Sellers.FindAsync(sellerId);

        if (seller == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Verify old password
        if (string.IsNullOrEmpty(seller.PasswordHash) || 
            !_authService.VerifyPassword(changePasswordDto.OldPassword, seller.PasswordHash))
        {
            return BadRequest(new { message = "Current password is incorrect" });
        }

        // Update password
        seller.PasswordHash = _authService.HashPassword(changePasswordDto.NewPassword);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Password changed successfully" });
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<ActionResult<SellerDto>> GetProfile()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var sellerId = int.Parse(userIdClaim.Value);
        var seller = await _context.Sellers.FindAsync(sellerId);

        if (seller == null)
        {
            return NotFound(new { message = "User not found" });
        }

        var sellerDto = _mapper.Map<SellerDto>(seller);
        return Ok(sellerDto);
    }

    [HttpPost("setup-admin")]
    public async Task<ActionResult<SellerDto>> SetupAdmin([FromBody] RegisterDto registerDto)
    {
        // Check if any admin exists
        var adminExists = await _context.Sellers.AnyAsync(s => s.Role == "Admin");
        
        if (adminExists)
        {
            return BadRequest(new { message = "Admin already exists. Use register endpoint with admin authentication." });
        }

        // Create first admin
        var admin = new Seller
        {
            Name = registerDto.Name,
            Email = registerDto.Email,
            PasswordHash = _authService.HashPassword(registerDto.Password),
            Role = "Admin",
            IsActive = 1,
            CreatedAt = DateTime.Now
        };

        _context.Sellers.Add(admin);
        await _context.SaveChangesAsync();

        var adminDto = _mapper.Map<SellerDto>(admin);
        return Ok(adminDto);
    }

    [HttpPost("reset-password/{sellerId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ResetPassword(int sellerId, [FromBody] ResetPasswordDto resetPasswordDto)
    {
        var seller = await _context.Sellers.FindAsync(sellerId);

        if (seller == null)
        {
            return NotFound(new { message = "Seller not found" });
        }

        // Update password
        seller.PasswordHash = _authService.HashPassword(resetPasswordDto.NewPassword);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Password reset successfully" });
    }
}

