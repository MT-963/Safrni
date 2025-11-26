using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Repositories;

public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
{
    public CustomerRepository(SafrniDbContext context) : base(context)
    {
    }

    public async Task<Customer?> GetCustomerWithBookingsAsync(int id)
    {
        return await _dbSet
            .Include(c => c.Bookings)
                .ThenInclude(b => b.Hotel)
            .Include(c => c.Bookings)
                .ThenInclude(b => b.Status)
            .FirstOrDefaultAsync(c => c.CustomerId == id);
    }

    public async Task<IEnumerable<Customer>> SearchCustomersByNameAsync(string name)
    {
        return await _dbSet
            .Where(c => c.FullName.Contains(name))
            .ToListAsync();
    }

    public async Task<Customer?> GetCustomerByEmailAsync(string email)
    {
        return await _dbSet
            .FirstOrDefaultAsync(c => c.Email == email);
    }
}

