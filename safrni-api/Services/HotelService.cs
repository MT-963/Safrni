using AutoMapper;
using safrni.DTOs;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Services;

public class HotelService : IHotelService
{
    private readonly IHotelRepository _hotelRepository;
    private readonly IMapper _mapper;

    public HotelService(IHotelRepository hotelRepository, IMapper mapper)
    {
        _hotelRepository = hotelRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<HotelDto>> GetAllHotelsAsync()
    {
        var hotels = await _hotelRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<HotelDto>>(hotels);
    }

    public async Task<HotelDto?> GetHotelByIdAsync(int id)
    {
        var hotel = await _hotelRepository.GetByIdAsync(id);
        return hotel == null ? null : _mapper.Map<HotelDto>(hotel);
    }

    public async Task<IEnumerable<HotelDto>> SearchHotelsByNameAsync(string name)
    {
        var hotels = await _hotelRepository.SearchHotelsByNameAsync(name);
        return _mapper.Map<IEnumerable<HotelDto>>(hotels);
    }

    public async Task<IEnumerable<HotelDto>> GetHotelsByCountryAsync(string country)
    {
        var hotels = await _hotelRepository.GetHotelsByCountryAsync(country);
        return _mapper.Map<IEnumerable<HotelDto>>(hotels);
    }

    public async Task<IEnumerable<HotelDto>> GetHotelsByCityAsync(string city)
    {
        var hotels = await _hotelRepository.GetHotelsByCityAsync(city);
        return _mapper.Map<IEnumerable<HotelDto>>(hotels);
    }

    public async Task<IEnumerable<HotelDto>> GetHotelsByStarRatingAsync(int starRating)
    {
        var hotels = await _hotelRepository.GetHotelsByStarRatingAsync(starRating);
        return _mapper.Map<IEnumerable<HotelDto>>(hotels);
    }

    public async Task<HotelDto> CreateHotelAsync(CreateHotelDto hotelDto)
    {
        var hotel = _mapper.Map<Hotel>(hotelDto);
        var createdHotel = await _hotelRepository.AddAsync(hotel);
        return _mapper.Map<HotelDto>(createdHotel);
    }

    public async Task<bool> UpdateHotelAsync(int id, UpdateHotelDto hotelDto)
    {
        var existingHotel = await _hotelRepository.GetByIdAsync(id);
        if (existingHotel == null)
            return false;

        _mapper.Map(hotelDto, existingHotel);
        await _hotelRepository.UpdateAsync(existingHotel);
        return true;
    }

    public async Task<bool> DeleteHotelAsync(int id)
    {
        var exists = await _hotelRepository.ExistsAsync(id);
        if (!exists)
            return false;

        await _hotelRepository.DeleteAsync(id);
        return true;
    }
}

