using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Mealplan
{
    public int MealPlanId { get; set; }

    public string Code { get; set; } = null!;

    public string? Description { get; set; }

    public virtual ICollection<Bookingroom> Bookingrooms { get; set; } = new List<Bookingroom>();
}
