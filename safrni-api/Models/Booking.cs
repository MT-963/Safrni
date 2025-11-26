using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Booking
{
    public int BookingId { get; set; }

    public int? SellerId { get; set; }

    public int? SupplierId { get; set; }

    public int? BrokerId { get; set; }

    public int? CustomerId { get; set; }

    public int? HotelId { get; set; }

    public string? BookingCode { get; set; }

    public string? HotelConfirmationCode { get; set; }

    public int? PeopleCount { get; set; }

    public DateOnly? CheckIn { get; set; }

    public DateOnly? CheckOut { get; set; }

    public int? StatusId { get; set; }

    public decimal? TotalPrice { get; set; }

    public string? Notes { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? UpdatedBy { get; set; }

    public virtual ICollection<Bookingroom> Bookingrooms { get; set; } = new List<Bookingroom>();

    public virtual Broker? Broker { get; set; }

    public virtual ICollection<Commission> Commissions { get; set; } = new List<Commission>();

    public virtual Customer? Customer { get; set; }

    public virtual ICollection<Extra> Extras { get; set; } = new List<Extra>();

    public virtual Hotel? Hotel { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual Seller? Seller { get; set; }

    public virtual Bookingstatus? Status { get; set; }

    public virtual Supplier? Supplier { get; set; }
}
