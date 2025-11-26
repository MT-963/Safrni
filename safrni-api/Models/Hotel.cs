using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Hotel
{
    public int HotelId { get; set; }

    public string Name { get; set; } = null!;

    public string? City { get; set; }

    public string? Country { get; set; }

    public int? StarRating { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
