using safrni.DTOs;

namespace safrni.Interfaces;

public interface IBrokerService
{
    Task<IEnumerable<BrokerDto>> GetAllBrokersAsync();
    Task<BrokerDto?> GetBrokerByIdAsync(int id);
    Task<BrokerDto> CreateBrokerAsync(CreateBrokerDto brokerDto);
    Task UpdateBrokerAsync(int id, UpdateBrokerDto brokerDto);
    Task DeleteBrokerAsync(int id);
}




