using safrni.Models;

namespace safrni.Interfaces;

public interface ICustomerRepository : IGenericRepository<Customer>
{
    Task<Customer?> GetCustomerWithBookingsAsync(int id);
    Task<IEnumerable<Customer>> SearchCustomersByNameAsync(string name);
    Task<Customer?> GetCustomerByEmailAsync(string email);
}

