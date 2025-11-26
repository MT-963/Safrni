using AutoMapper;
using safrni.DTOs;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Services;

public class SellerService : ISellerService
{
    private readonly ISellerRepository _sellerRepository;
    private readonly IMapper _mapper;

    public SellerService(ISellerRepository sellerRepository, IMapper mapper)
    {
        _sellerRepository = sellerRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SellerDto>> GetAllSellersAsync()
    {
        var sellers = await _sellerRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<SellerDto>>(sellers);
    }

    public async Task<SellerDto?> GetSellerByIdAsync(int id)
    {
        var seller = await _sellerRepository.GetByIdAsync(id);
        return seller == null ? null : _mapper.Map<SellerDto>(seller);
    }

    public async Task<SellerDto> CreateSellerAsync(CreateSellerDto sellerDto)
    {
        var seller = _mapper.Map<Seller>(sellerDto);
        seller.CreatedAt = DateTime.Now;
        var createdSeller = await _sellerRepository.AddAsync(seller);
        return _mapper.Map<SellerDto>(createdSeller);
    }

    public async Task UpdateSellerAsync(int id, UpdateSellerDto sellerDto)
    {
        var seller = await _sellerRepository.GetByIdAsync(id);
        if (seller == null)
            throw new KeyNotFoundException($"Seller with ID {id} not found");

        _mapper.Map(sellerDto, seller);
        await _sellerRepository.UpdateAsync(seller);
    }

    public async Task DeleteSellerAsync(int id)
    {
        await _sellerRepository.DeleteAsync(id);
    }
}




