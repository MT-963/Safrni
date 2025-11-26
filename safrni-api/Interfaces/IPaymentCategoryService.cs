using safrni.DTOs;

namespace safrni.Interfaces;

public interface IPaymentCategoryService
{
    Task<IEnumerable<PaymentCategoryDto>> GetAllCategoriesAsync();
    Task<PaymentCategoryDto?> GetCategoryByIdAsync(int id);
    Task<PaymentCategoryDto> CreateCategoryAsync(CreatePaymentCategoryDto categoryDto);
    Task UpdateCategoryAsync(int id, UpdatePaymentCategoryDto categoryDto);
    Task DeleteCategoryAsync(int id);
}




