using AutoMapper;
using safrni.DTOs;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Services;

public class BrokerService : IBrokerService
{
    private readonly IBrokerRepository _brokerRepository;
    private readonly IMapper _mapper;

    public BrokerService(IBrokerRepository brokerRepository, IMapper mapper)
    {
        _brokerRepository = brokerRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BrokerDto>> GetAllBrokersAsync()
    {
        var brokers = await _brokerRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<BrokerDto>>(brokers);
    }

    public async Task<BrokerDto?> GetBrokerByIdAsync(int id)
    {
        var broker = await _brokerRepository.GetByIdAsync(id);
        return broker == null ? null : _mapper.Map<BrokerDto>(broker);
    }

    public async Task<BrokerDto> CreateBrokerAsync(CreateBrokerDto brokerDto)
    {
        var broker = _mapper.Map<Broker>(brokerDto);
        broker.CreatedAt = DateTime.Now;
        var createdBroker = await _brokerRepository.AddAsync(broker);
        return _mapper.Map<BrokerDto>(createdBroker);
    }

    public async Task UpdateBrokerAsync(int id, UpdateBrokerDto brokerDto)
    {
        var broker = await _brokerRepository.GetByIdAsync(id);
        if (broker == null)
            throw new KeyNotFoundException($"Broker with ID {id} not found");

        _mapper.Map(brokerDto, broker);
        await _brokerRepository.UpdateAsync(broker);
    }

    public async Task DeleteBrokerAsync(int id)
    {
        await _brokerRepository.DeleteAsync(id);
    }
}




