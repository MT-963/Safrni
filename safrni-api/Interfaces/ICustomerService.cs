using safrni.DTOs;

namespace safrni.Interfaces;

public interface ICustomerService
{
    Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();
    Task<CustomerDto?> GetCustomerByIdAsync(int id);
    Task<CustomerDto?> GetCustomerWithBookingsAsync(int id);
    Task<IEnumerable<CustomerDto>> SearchCustomersByNameAsync(string name);
    Task<CustomerDto?> GetCustomerByEmailAsync(string email);
    Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto customerDto);
    Task<bool> UpdateCustomerAsync(int id, UpdateCustomerDto customerDto);
    Task<bool> DeleteCustomerAsync(int id);
}

