using safrni.Data;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Repositories;

public class SellerRepository : GenericRepository<Seller>, ISellerRepository
{
    public SellerRepository(SafrniDbContext context) : base(context)
    {
    }
}




