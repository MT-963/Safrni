using safrni.Data;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Repositories;

public class BrokerRepository : GenericRepository<Broker>, IBrokerRepository
{
    public BrokerRepository(SafrniDbContext context) : base(context)
    {
    }
}




