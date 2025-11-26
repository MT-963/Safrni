using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Bookingstatus
{
    public int StatusId { get; set; }

    public string NameAr { get; set; } = null!;

    public string NameEn { get; set; } = null!;

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
