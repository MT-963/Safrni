using safrni.DTOs;

namespace safrni.Interfaces;

public interface IHotelService
{
    Task<IEnumerable<HotelDto>> GetAllHotelsAsync();
    Task<HotelDto?> GetHotelByIdAsync(int id);
    Task<IEnumerable<HotelDto>> SearchHotelsByNameAsync(string name);
    Task<IEnumerable<HotelDto>> GetHotelsByCountryAsync(string country);
    Task<IEnumerable<HotelDto>> GetHotelsByCityAsync(string city);
    Task<IEnumerable<HotelDto>> GetHotelsByStarRatingAsync(int starRating);
    Task<HotelDto> CreateHotelAsync(CreateHotelDto hotelDto);
    Task<bool> UpdateHotelAsync(int id, UpdateHotelDto hotelDto);
    Task<bool> DeleteHotelAsync(int id);
}

