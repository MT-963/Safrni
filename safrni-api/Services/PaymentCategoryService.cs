using AutoMapper;
using safrni.DTOs;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Services;

public class PaymentCategoryService : IPaymentCategoryService
{
    private readonly IPaymentCategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public PaymentCategoryService(IPaymentCategoryRepository categoryRepository, IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PaymentCategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<PaymentCategoryDto>>(categories);
    }

    public async Task<PaymentCategoryDto?> GetCategoryByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        return category == null ? null : _mapper.Map<PaymentCategoryDto>(category);
    }

    public async Task<PaymentCategoryDto> CreateCategoryAsync(CreatePaymentCategoryDto categoryDto)
    {
        var category = _mapper.Map<PaymentCategory>(categoryDto);
        var createdCategory = await _categoryRepository.AddAsync(category);
        return _mapper.Map<PaymentCategoryDto>(createdCategory);
    }

    public async Task UpdateCategoryAsync(int id, UpdatePaymentCategoryDto categoryDto)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null)
            throw new KeyNotFoundException($"Payment Category with ID {id} not found");

        _mapper.Map(categoryDto, category);
        await _categoryRepository.UpdateAsync(category);
    }

    public async Task DeleteCategoryAsync(int id)
    {
        await _categoryRepository.DeleteAsync(id);
    }
}




