using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Bookingroom
{
    public int RoomId { get; set; }

    public int BookingId { get; set; }

    public int? RoomTypeId { get; set; }

    public int? ViewTypeId { get; set; }

    public int? MealPlanId { get; set; }

    public int? RoomCount { get; set; }

    public decimal? PricePerNight { get; set; }

    public int? CurrencyId { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Currency? Currency { get; set; }

    public virtual Mealplan? MealPlan { get; set; }

    public virtual Roomtype? RoomType { get; set; }

    public virtual Viewtype? ViewType { get; set; }
}
