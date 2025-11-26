namespace safrni.DTOs;

public class PaymentCategoryDto
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = null!;
}

public class CreatePaymentCategoryDto
{
    public string Name { get; set; } = null!;
}

public class UpdatePaymentCategoryDto
{
    public string Name { get; set; } = null!;
}




