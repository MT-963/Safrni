namespace safrni.DTOs;

public class SellerDto
{
    public int SellerId { get; set; }
    public string Name { get; set; } = null!;
    public string? Email { get; set; }
    public string Role { get; set; } = "Employee";
    public DateTime? CreatedAt { get; set; }
    public sbyte IsActive { get; set; }
}

public class CreateSellerDto
{
    public string Name { get; set; } = null!;
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string Role { get; set; } = "Employee";
    public sbyte IsActive { get; set; } = 1;
}

public class UpdateSellerDto
{
    public string Name { get; set; } = null!;
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? Role { get; set; }
    public sbyte? IsActive { get; set; }
}

public class LoginDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class LoginResponseDto
{
    public int SellerId { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string Token { get; set; } = null!;
}

public class RegisterDto
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? Role { get; set; }
}

public class ChangePasswordDto
{
    public string OldPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}

public class ResetPasswordDto
{
    public string NewPassword { get; set; } = null!;
}




