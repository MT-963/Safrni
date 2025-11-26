using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Viewtype
{
    public int ViewTypeId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Bookingroom> Bookingrooms { get; set; } = new List<Bookingroom>();
}
