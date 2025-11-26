using AutoMapper;
using safrni.DTOs;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IMapper _mapper;

    public PaymentService(IPaymentRepository paymentRepository, IMapper mapper)
    {
        _paymentRepository = paymentRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PaymentDto>> GetAllPaymentsAsync()
    {
        var payments = await _paymentRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<PaymentDto>>(payments);
    }

    public async Task<PaymentDto?> GetPaymentByIdAsync(int id)
    {
        var payment = await _paymentRepository.GetByIdAsync(id);
        return payment == null ? null : _mapper.Map<PaymentDto>(payment);
    }

    public async Task<IEnumerable<PaymentDto>> GetPaymentsByBookingIdAsync(int bookingId)
    {
        var payments = await _paymentRepository.GetPaymentsByBookingIdAsync(bookingId);
        return _mapper.Map<IEnumerable<PaymentDto>>(payments);
    }

    public async Task<decimal> GetTotalPaymentsByBookingIdAsync(int bookingId)
    {
        return await _paymentRepository.GetTotalPaymentsByBookingIdAsync(bookingId);
    }

    public async Task<IEnumerable<PaymentDto>> GetPaymentsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        var payments = await _paymentRepository.GetPaymentsByDateRangeAsync(startDate, endDate);
        return _mapper.Map<IEnumerable<PaymentDto>>(payments);
    }

    public async Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto paymentDto)
    {
        var payment = _mapper.Map<Payment>(paymentDto);
        var createdPayment = await _paymentRepository.AddAsync(payment);
        return _mapper.Map<PaymentDto>(createdPayment);
    }

    public async Task<bool> UpdatePaymentAsync(int id, UpdatePaymentDto paymentDto)
    {
        var existingPayment = await _paymentRepository.GetByIdAsync(id);
        if (existingPayment == null)
            return false;

        _mapper.Map(paymentDto, existingPayment);
        await _paymentRepository.UpdateAsync(existingPayment);
        return true;
    }

    public async Task<bool> DeletePaymentAsync(int id)
    {
        var exists = await _paymentRepository.ExistsAsync(id);
        if (!exists)
            return false;

        await _paymentRepository.DeleteAsync(id);
        return true;
    }
}

