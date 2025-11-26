using safrni.Models;

namespace safrni.Interfaces;

public interface IHotelRepository : IGenericRepository<Hotel>
{
    Task<IEnumerable<Hotel>> SearchHotelsByNameAsync(string name);
    Task<IEnumerable<Hotel>> GetHotelsByCountryAsync(string country);
    Task<IEnumerable<Hotel>> GetHotelsByCityAsync(string city);
    Task<IEnumerable<Hotel>> GetHotelsByStarRatingAsync(int starRating);
}

