using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Seller
{
    public int SellerId { get; set; }

    public string Name { get; set; } = null!;

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public string Role { get; set; } = "Employee";

    public DateTime? CreatedAt { get; set; }

    public sbyte IsActive { get; set; } = 1;

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    
    public virtual ICollection<Booking> BookingsCreated { get; set; } = new List<Booking>();
    
    public virtual ICollection<Booking> BookingsUpdated { get; set; } = new List<Booking>();
    
    public virtual ICollection<BookingInternalNote> InternalNotes { get; set; } = new List<BookingInternalNote>();
    
    public virtual ICollection<BookingDocument> Documents { get; set; } = new List<BookingDocument>();
    
    public virtual ICollection<BookingstatusHistory> StatusHistories { get; set; } = new List<BookingstatusHistory>();
}
