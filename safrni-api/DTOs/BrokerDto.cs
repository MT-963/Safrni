namespace safrni.DTOs;

public class BrokerDto
{
    public int BrokerId { get; set; }
    public string Name { get; set; } = null!;
    public string? ContactEmail { get; set; }
    public string? Phone { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class CreateBrokerDto
{
    public string Name { get; set; } = null!;
    public string? ContactEmail { get; set; }
    public string? Phone { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
}

public class UpdateBrokerDto
{
    public string Name { get; set; } = null!;
    public string? ContactEmail { get; set; }
    public string? Phone { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
}




