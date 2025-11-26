using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Repositories;

public class HotelRepository : GenericRepository<Hotel>, IHotelRepository
{
    public HotelRepository(SafrniDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Hotel>> SearchHotelsByNameAsync(string name)
    {
        return await _dbSet
            .Where(h => h.Name != null && h.Name.Contains(name))
            .ToListAsync();
    }

    public async Task<IEnumerable<Hotel>> GetHotelsByCountryAsync(string country)
    {
        return await _dbSet
            .Where(h => h.Country == country)
            .ToListAsync();
    }

    public async Task<IEnumerable<Hotel>> GetHotelsByCityAsync(string city)
    {
        return await _dbSet
            .Where(h => h.City == city)
            .ToListAsync();
    }

    public async Task<IEnumerable<Hotel>> GetHotelsByStarRatingAsync(int starRating)
    {
        return await _dbSet
            .Where(h => h.StarRating == starRating)
            .ToListAsync();
    }
}

