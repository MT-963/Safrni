using AutoMapper;
using safrni.DTOs;
using safrni.Models;

namespace safrni.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Customer mappings
        CreateMap<Customer, CustomerDto>().ReverseMap();
        CreateMap<CreateCustomerDto, Customer>();
        CreateMap<UpdateCustomerDto, Customer>();

        // Booking mappings
        CreateMap<Booking, BookingDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.FullName : null))
            .ForMember(dest => dest.HotelName, opt => opt.MapFrom(src => src.Hotel != null ? src.Hotel.Name : null))
            .ForMember(dest => dest.SellerName, opt => opt.MapFrom(src => src.Seller != null ? src.Seller.Name : null))
            .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.Name : null))
            .ForMember(dest => dest.BrokerName, opt => opt.MapFrom(src => src.Broker != null ? src.Broker.Name : null))
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status != null ? src.Status.NameEn : null));
        
        CreateMap<CreateBookingDto, Booking>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.Now));
        
        CreateMap<UpdateBookingDto, Booking>()
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.Now));

        CreateMap<Booking, BookingDetailDto>()
            .ForMember(dest => dest.Customer, opt => opt.MapFrom(src => src.Customer))
            .ForMember(dest => dest.Hotel, opt => opt.MapFrom(src => src.Hotel))
            .ForMember(dest => dest.Seller, opt => opt.MapFrom(src => src.Seller))
            .ForMember(dest => dest.Supplier, opt => opt.MapFrom(src => src.Supplier))
            .ForMember(dest => dest.Broker, opt => opt.MapFrom(src => src.Broker))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
            .ForMember(dest => dest.Rooms, opt => opt.MapFrom(src => src.Bookingrooms))
            .ForMember(dest => dest.Payments, opt => opt.MapFrom(src => src.Payments))
            .ForMember(dest => dest.Commissions, opt => opt.MapFrom(src => src.Commissions))
            .ForMember(dest => dest.Extras, opt => opt.MapFrom(src => src.Extras));

        // Hotel mappings
        CreateMap<Hotel, HotelDto>().ReverseMap();
        CreateMap<CreateHotelDto, Hotel>();
        CreateMap<UpdateHotelDto, Hotel>();

        // Payment mappings
        CreateMap<Payment, PaymentDto>()
            .ForMember(dest => dest.CurrencyCode, opt => opt.MapFrom(src => src.Currency != null ? src.Currency.Code : null))
            .ForMember(dest => dest.PaymentMethodName, opt => opt.MapFrom(src => src.PaymentMethod != null ? src.PaymentMethod.Name : null));
        CreateMap<CreatePaymentDto, Payment>();
        CreateMap<UpdatePaymentDto, Payment>();

        // Seller mappings
        CreateMap<Seller, SellerDto>().ReverseMap();
        CreateMap<CreateSellerDto, Seller>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.Now));
        CreateMap<UpdateSellerDto, Seller>();

        // Broker mappings
        CreateMap<Broker, BrokerDto>().ReverseMap();
        CreateMap<CreateBrokerDto, Broker>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.Now));
        CreateMap<UpdateBrokerDto, Broker>();

        // Supplier mappings
        CreateMap<Supplier, SupplierDto>().ReverseMap();
        CreateMap<CreateSupplierDto, Supplier>();
        CreateMap<UpdateSupplierDto, Supplier>();

        // BookingStatus mappings
        CreateMap<Bookingstatus, BookingStatusDto>().ReverseMap();

        // Currency mappings
        CreateMap<Currency, CurrencyDto>().ReverseMap();

        // RoomType mappings
        CreateMap<Roomtype, RoomTypeDto>().ReverseMap();

        // ViewType mappings
        CreateMap<Viewtype, ViewTypeDto>().ReverseMap();

        // MealPlan mappings
        CreateMap<Mealplan, MealPlanDto>().ReverseMap();

        // PaymentMethod mappings
        CreateMap<Paymentmethod, PaymentMethodDto>().ReverseMap();

        // PaymentCategory mappings
        CreateMap<PaymentCategory, PaymentCategoryDto>().ReverseMap();
        CreateMap<CreatePaymentCategoryDto, PaymentCategory>();
        CreateMap<UpdatePaymentCategoryDto, PaymentCategory>();

        // BookingRoom mappings
        CreateMap<Bookingroom, BookingRoomDto>()
            .ForMember(dest => dest.RoomTypeName, opt => opt.MapFrom(src => src.RoomType != null ? src.RoomType.Name : null))
            .ForMember(dest => dest.ViewTypeName, opt => opt.MapFrom(src => src.ViewType != null ? src.ViewType.Name : null))
            .ForMember(dest => dest.MealPlanCode, opt => opt.MapFrom(src => src.MealPlan != null ? src.MealPlan.Code : null))
            .ForMember(dest => dest.CurrencyCode, opt => opt.MapFrom(src => src.Currency != null ? src.Currency.Code : null));

        // Commission mappings
        CreateMap<Commission, CommissionDto>()
            .ForMember(dest => dest.CurrencyCode, opt => opt.MapFrom(src => src.Currency != null ? src.Currency.Code : null));

        // Extra mappings
        CreateMap<Extra, ExtraDto>()
            .ForMember(dest => dest.CurrencyCode, opt => opt.MapFrom(src => src.Currency != null ? src.Currency.Code : null));
    }
}

