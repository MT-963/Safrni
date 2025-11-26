using safrni.DTOs;

namespace safrni.Interfaces;

public interface ISellerService
{
    Task<IEnumerable<SellerDto>> GetAllSellersAsync();
    Task<SellerDto?> GetSellerByIdAsync(int id);
    Task<SellerDto> CreateSellerAsync(CreateSellerDto sellerDto);
    Task UpdateSellerAsync(int id, UpdateSellerDto sellerDto);
    Task DeleteSellerAsync(int id);
}




