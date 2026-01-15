using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;
using safrni.Models;

namespace safrni.Data;

public partial class SafrniDbContext : DbContext
{
    public SafrniDbContext()
    {
    }

    public SafrniDbContext(DbContextOptions<SafrniDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Booking> Bookings { get; set; }

    public virtual DbSet<Bookingroom> Bookingrooms { get; set; }

    public virtual DbSet<Bookingstatus> Bookingstatuses { get; set; }

    public virtual DbSet<BookingstatusHistory> BookingstatusHistories { get; set; }

    public virtual DbSet<BookingInternalNote> BookingInternalNotes { get; set; }

    public virtual DbSet<BookingDocument> BookingDocuments { get; set; }

    public virtual DbSet<Broker> Brokers { get; set; }

    public virtual DbSet<Commission> Commissions { get; set; }

    public virtual DbSet<Currency> Currencies { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Extra> Extras { get; set; }

    public virtual DbSet<Hotel> Hotels { get; set; }

    public virtual DbSet<Mealplan> Mealplans { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<PaymentCategory> PaymentCategories { get; set; }

    public virtual DbSet<Paymentmethod> Paymentmethods { get; set; }

    public virtual DbSet<Roomtype> Roomtypes { get; set; }

    public virtual DbSet<Seller> Sellers { get; set; }

    public virtual DbSet<Supplier> Suppliers { get; set; }

    public virtual DbSet<Viewtype> Viewtypes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=safrni;user=root;password=root;treattinyasboolean=false", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.44-mysql"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_unicode_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId).HasName("PRIMARY");

            entity.ToTable("bookings");

            entity.HasIndex(e => e.CustomerId, "CustomerID");

            entity.HasIndex(e => e.HotelId, "HotelID");

            entity.HasIndex(e => e.StatusId, "StatusID");

            entity.HasIndex(e => e.SupplierId, "SupplierID");

            entity.HasIndex(e => e.BrokerId, "fk_bookings_brokers");

            entity.HasIndex(e => e.SellerId, "fk_bookings_sellers");

            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.BookingCode).HasMaxLength(100);
            entity.Property(e => e.BrokerId).HasColumnName("BrokerID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy).HasColumnName("CreatedBy");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.HotelConfirmationCode).HasMaxLength(100);
            entity.Property(e => e.HotelId).HasColumnName("HotelID");
            entity.Property(e => e.Notes).HasColumnType("text");
            entity.Property(e => e.SellerId).HasColumnName("SellerID");
            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.SupplierId).HasColumnName("SupplierID");
            entity.Property(e => e.TotalPrice)
                .HasPrecision(10, 2)
                .HasDefaultValueSql("'0.00'");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedBy).HasColumnName("UpdatedBy");

            entity.HasOne(d => d.Broker).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.BrokerId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_bookings_brokers");

            entity.HasOne(d => d.Customer).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("bookings_ibfk_3");

            entity.HasOne(d => d.Hotel).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.HotelId)
                .HasConstraintName("bookings_ibfk_4");

            entity.HasOne(d => d.Seller).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.SellerId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_bookings_sellers");

            entity.HasOne(d => d.CreatedBySeller).WithMany(p => p.BookingsCreated)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_booking_created_by");

            entity.HasOne(d => d.UpdatedBySeller).WithMany(p => p.BookingsUpdated)
                .HasForeignKey(d => d.UpdatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_booking_updated_by");

            entity.HasOne(d => d.Status).WithMany(p => p.Bookings)
                .HasForeignKey(d => d.StatusId)
                .HasConstraintName("bookings_ibfk_5");

            entity.HasOne(d => d.Supplier).WithMany()
                .HasForeignKey(d => d.SupplierId)
                .HasConstraintName("bookings_ibfk_2");
        });

        modelBuilder.Entity<Bookingroom>(entity =>
        {
            entity.HasKey(e => e.RoomId).HasName("PRIMARY");

            entity.ToTable("bookingrooms");

            entity.HasIndex(e => e.BookingId, "BookingID");

            entity.HasIndex(e => e.CurrencyId, "CurrencyID");

            entity.HasIndex(e => e.MealPlanId, "MealPlanID");

            entity.HasIndex(e => e.RoomTypeId, "RoomTypeID");

            entity.HasIndex(e => e.ViewTypeId, "ViewTypeID");

            entity.Property(e => e.RoomId).HasColumnName("RoomID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.CurrencyId).HasColumnName("CurrencyID");
            entity.Property(e => e.MealPlanId).HasColumnName("MealPlanID");
            entity.Property(e => e.PricePerNight).HasPrecision(10, 2);
            entity.Property(e => e.RoomCount).HasDefaultValueSql("'1'");
            entity.Property(e => e.RoomTypeId).HasColumnName("RoomTypeID");
            entity.Property(e => e.ViewTypeId).HasColumnName("ViewTypeID");

            entity.HasOne(d => d.Booking).WithMany(p => p.Bookingrooms)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("bookingrooms_ibfk_1");

            entity.HasOne(d => d.Currency).WithMany(p => p.Bookingrooms)
                .HasForeignKey(d => d.CurrencyId)
                .HasConstraintName("bookingrooms_ibfk_5");

            entity.HasOne(d => d.MealPlan).WithMany(p => p.Bookingrooms)
                .HasForeignKey(d => d.MealPlanId)
                .HasConstraintName("bookingrooms_ibfk_4");

            entity.HasOne(d => d.RoomType).WithMany(p => p.Bookingrooms)
                .HasForeignKey(d => d.RoomTypeId)
                .HasConstraintName("bookingrooms_ibfk_2");

            entity.HasOne(d => d.ViewType).WithMany(p => p.Bookingrooms)
                .HasForeignKey(d => d.ViewTypeId)
                .HasConstraintName("bookingrooms_ibfk_3");
        });

        modelBuilder.Entity<Bookingstatus>(entity =>
        {
            entity.HasKey(e => e.StatusId).HasName("PRIMARY");

            entity.ToTable("bookingstatus");

            entity.Property(e => e.StatusId).HasColumnName("StatusID");
            entity.Property(e => e.NameAr).HasMaxLength(100);
            entity.Property(e => e.NameEn).HasMaxLength(100);
        });

        modelBuilder.Entity<Broker>(entity =>
        {
            entity.HasKey(e => e.BrokerId).HasName("PRIMARY");

            entity.ToTable("brokers");

            entity.Property(e => e.BrokerId).HasColumnName("BrokerID");
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.ContactEmail).HasMaxLength(150);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Phone).HasMaxLength(50);
        });

        modelBuilder.Entity<Commission>(entity =>
        {
            entity.HasKey(e => e.CommissionId).HasName("PRIMARY");

            entity.ToTable("commissions");

            entity.HasIndex(e => e.BookingId, "BookingID");

            entity.HasIndex(e => e.CurrencyId, "CurrencyID");

            entity.Property(e => e.CommissionId).HasColumnName("CommissionID");
            entity.Property(e => e.Amount).HasPrecision(10, 2);
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.CurrencyId).HasColumnName("CurrencyID");
            entity.Property(e => e.Percent).HasPrecision(5, 2);
            entity.Property(e => e.Source).HasColumnType("enum('Hotel','Agent','Internal','Supplier','Broker')");

            entity.HasOne(d => d.Booking).WithMany(p => p.Commissions)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("commissions_ibfk_1");

            entity.HasOne(d => d.Currency).WithMany(p => p.Commissions)
                .HasForeignKey(d => d.CurrencyId)
                .HasConstraintName("commissions_ibfk_2");
        });

        modelBuilder.Entity<Currency>(entity =>
        {
            entity.HasKey(e => e.CurrencyId).HasName("PRIMARY");

            entity.ToTable("currencies");

            entity.Property(e => e.CurrencyId).HasColumnName("CurrencyID");
            entity.Property(e => e.Code).HasMaxLength(10);
            entity.Property(e => e.RateToEur)
                .HasPrecision(10, 4)
                .HasDefaultValueSql("'1.0000'")
                .HasColumnName("RateToEUR");
            entity.Property(e => e.Symbol).HasMaxLength(5);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PRIMARY");

            entity.ToTable("customers");

            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.FullName).HasMaxLength(150);
            entity.Property(e => e.Nationality).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(50);
        });

        modelBuilder.Entity<Extra>(entity =>
        {
            entity.HasKey(e => e.ExtraId).HasName("PRIMARY");

            entity.ToTable("extras");

            entity.HasIndex(e => e.BookingId, "BookingID");

            entity.HasIndex(e => e.CurrencyId, "CurrencyID");

            entity.Property(e => e.ExtraId).HasColumnName("ExtraID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.CurrencyId).HasColumnName("CurrencyID");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.IsGift)
                .HasDefaultValueSql("'0'")
                .HasColumnType("tinyint(1)");
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasColumnType("datetime");

            entity.HasOne(d => d.Booking).WithMany(p => p.Extras)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("extras_ibfk_1");

            entity.HasOne(d => d.Currency).WithMany(p => p.Extras)
                .HasForeignKey(d => d.CurrencyId)
                .HasConstraintName("extras_ibfk_2");

            entity.HasOne(d => d.CreatedBySeller).WithMany()
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_extra_created_by");

            entity.HasOne(d => d.UpdatedBySeller).WithMany()
                .HasForeignKey(d => d.UpdatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_extra_updated_by");
        });

        modelBuilder.Entity<Hotel>(entity =>
        {
            entity.HasKey(e => e.HotelId).HasName("PRIMARY");

            entity.ToTable("hotels");

            entity.Property(e => e.HotelId).HasColumnName("HotelID");
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.StarRating).HasDefaultValueSql("'0'");
        });

        modelBuilder.Entity<Mealplan>(entity =>
        {
            entity.HasKey(e => e.MealPlanId).HasName("PRIMARY");

            entity.ToTable("mealplans");

            entity.Property(e => e.MealPlanId).HasColumnName("MealPlanID");
            entity.Property(e => e.Code).HasMaxLength(10);
            entity.Property(e => e.Description).HasMaxLength(100);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PRIMARY");

            entity.ToTable("payments");

            entity.HasIndex(e => e.BookingId, "BookingID");

            entity.HasIndex(e => e.CurrencyId, "CurrencyID");

            entity.HasIndex(e => e.PaymentMethodId, "PaymentMethodID");

            entity.Property(e => e.PaymentId).HasColumnName("PaymentID");
            entity.Property(e => e.Amount).HasPrecision(10, 2);
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.CurrencyId).HasColumnName("CurrencyID");
            entity.Property(e => e.Notes).HasMaxLength(255);
            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentMethodId).HasColumnName("PaymentMethodID");
            entity.Property(e => e.PaymentType).HasColumnType("enum('Deposit','Remaining','TransferCost','Commission')");
            entity.Property(e => e.RateUsed).HasPrecision(10, 4);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt)
                .ValueGeneratedOnAddOrUpdate()
                .HasColumnType("datetime");

            entity.HasOne(d => d.Booking).WithMany(p => p.Payments)
                .HasForeignKey(d => d.BookingId)
                .HasConstraintName("payments_ibfk_1");

            entity.HasOne(d => d.Currency).WithMany(p => p.Payments)
                .HasForeignKey(d => d.CurrencyId)
                .HasConstraintName("payments_ibfk_2");

            entity.HasOne(d => d.PaymentMethod).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PaymentMethodId)
                .HasConstraintName("payments_ibfk_3");

            entity.HasOne(d => d.CreatedBySeller).WithMany()
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_payment_created_by");

            entity.HasOne(d => d.UpdatedBySeller).WithMany()
                .HasForeignKey(d => d.UpdatedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_payment_updated_by");
        });

        modelBuilder.Entity<PaymentCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PRIMARY");

            entity.ToTable("payment_categories");

            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Paymentmethod>(entity =>
        {
            entity.HasKey(e => e.PaymentMethodId).HasName("PRIMARY");

            entity.ToTable("paymentmethods");

            entity.HasIndex(e => e.CategoryId, "fk_method_category");

            entity.Property(e => e.PaymentMethodId).HasColumnName("PaymentMethodID");
            entity.Property(e => e.AccountDetails).HasColumnType("json");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.Category).WithMany(p => p.Paymentmethods)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("fk_method_category");
        });

        modelBuilder.Entity<Roomtype>(entity =>
        {
            entity.HasKey(e => e.RoomTypeId).HasName("PRIMARY");

            entity.ToTable("roomtypes");

            entity.Property(e => e.RoomTypeId).HasColumnName("RoomTypeID");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Seller>(entity =>
        {
            entity.HasKey(e => e.SellerId).HasName("PRIMARY");

            entity.ToTable("sellers");

            entity.HasIndex(e => e.Email, "unique_email").IsUnique();

            entity.Property(e => e.SellerId).HasColumnName("SellerID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Role)
                .HasColumnType("enum('Admin','Employee')")
                .HasDefaultValueSql("'Employee'");
            entity.Property(e => e.IsActive)
                .HasDefaultValueSql("'1'")
                .HasColumnType("tinyint(1)");
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<BookingstatusHistory>(entity =>
        {
            entity.HasKey(e => e.HistoryId).HasName("PRIMARY");

            entity.ToTable("bookingstatus_history");

            entity.HasIndex(e => e.BookingId, "BookingID");
            entity.HasIndex(e => e.OldStatusId, "OldStatusID");
            entity.HasIndex(e => e.NewStatusId, "NewStatusID");
            entity.HasIndex(e => e.ChangedBy, "ChangedBy");

            entity.Property(e => e.HistoryId).HasColumnName("HistoryID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.OldStatusId).HasColumnName("OldStatusID");
            entity.Property(e => e.NewStatusId).HasColumnName("NewStatusID");
            entity.Property(e => e.ChangedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Reason).HasMaxLength(255);

            entity.HasOne(d => d.Booking).WithMany(p => p.StatusHistories)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_status_history_booking");

            entity.HasOne(d => d.OldStatus).WithMany()
                .HasForeignKey(d => d.OldStatusId)
                .HasConstraintName("fk_status_history_old");

            entity.HasOne(d => d.NewStatus).WithMany()
                .HasForeignKey(d => d.NewStatusId)
                .HasConstraintName("fk_status_history_new");

            entity.HasOne(d => d.ChangedBySeller).WithMany(p => p.StatusHistories)
                .HasForeignKey(d => d.ChangedBy)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_status_history_seller");
        });

        modelBuilder.Entity<BookingInternalNote>(entity =>
        {
            entity.HasKey(e => e.NoteId).HasName("PRIMARY");

            entity.ToTable("booking_internal_notes");

            entity.HasIndex(e => e.BookingId, "BookingID");
            entity.HasIndex(e => e.SellerId, "SellerID");

            entity.Property(e => e.NoteId).HasColumnName("NoteID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.SellerId).HasColumnName("SellerID");
            entity.Property(e => e.NoteText).HasColumnType("text");
            entity.Property(e => e.IsAdminOnly)
                .HasDefaultValueSql("'1'")
                .HasColumnType("tinyint(1)");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Booking).WithMany(p => p.InternalNotes)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_note_booking");

            entity.HasOne(d => d.Seller).WithMany(p => p.InternalNotes)
                .HasForeignKey(d => d.SellerId)
                .HasConstraintName("fk_note_seller");
        });

        modelBuilder.Entity<BookingDocument>(entity =>
        {
            entity.HasKey(e => e.DocumentId).HasName("PRIMARY");

            entity.ToTable("booking_documents");

            entity.HasIndex(e => e.BookingId, "BookingID");
            entity.HasIndex(e => e.UploadedBy, "UploadedBy");

            entity.Property(e => e.DocumentId).HasColumnName("DocumentID");
            entity.Property(e => e.BookingId).HasColumnName("BookingID");
            entity.Property(e => e.FileUrl).HasMaxLength(255);
            entity.Property(e => e.FileType).HasMaxLength(50);
            entity.Property(e => e.UploadedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Booking).WithMany(p => p.Documents)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("fk_document_booking");

            entity.HasOne(d => d.UploadedBySeller).WithMany(p => p.Documents)
                .HasForeignKey(d => d.UploadedBy)
                .HasConstraintName("fk_document_seller");
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.SupplierId).HasName("PRIMARY");

            entity.ToTable("suppliers");

            entity.Property(e => e.SupplierId).HasColumnName("SupplierID");
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.ContactEmail).HasMaxLength(150);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Phone).HasMaxLength(50);
        });

        modelBuilder.Entity<Viewtype>(entity =>
        {
            entity.HasKey(e => e.ViewTypeId).HasName("PRIMARY");

            entity.ToTable("viewtypes");

            entity.Property(e => e.ViewTypeId).HasColumnName("ViewTypeID");
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
