namespace safrni.DTOs;

public class CustomerDto
{
    public int CustomerId { get; set; }
    public string FullName { get; set; } = null!;
    public string? Nationality { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
}

public class CreateCustomerDto
{
    public string FullName { get; set; } = null!;
    public string? Nationality { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
}

public class UpdateCustomerDto
{
    public string FullName { get; set; } = null!;
    public string? Nationality { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
}

