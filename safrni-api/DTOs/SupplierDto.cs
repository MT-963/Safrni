namespace safrni.DTOs;

public class SupplierDto
{
    public int SupplierId { get; set; }
    public string Name { get; set; } = null!;
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Phone { get; set; }
    public string? ContactEmail { get; set; }
}

public class CreateSupplierDto
{
    public string Name { get; set; } = null!;
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Phone { get; set; }
    public string? ContactEmail { get; set; }
}

public class UpdateSupplierDto
{
    public string Name { get; set; } = null!;
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Phone { get; set; }
    public string? ContactEmail { get; set; }
}

