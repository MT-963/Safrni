using safrni.Data;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Repositories;

public class PaymentCategoryRepository : GenericRepository<PaymentCategory>, IPaymentCategoryRepository
{
    public PaymentCategoryRepository(SafrniDbContext context) : base(context)
    {
    }
}




