using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Roomtype
{
    public int RoomTypeId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Bookingroom> Bookingrooms { get; set; } = new List<Bookingroom>();
}
