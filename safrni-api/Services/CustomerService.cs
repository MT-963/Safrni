using AutoMapper;
using safrni.DTOs;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Services;

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IMapper _mapper;

    public CustomerService(ICustomerRepository customerRepository, IMapper mapper)
    {
        _customerRepository = customerRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
    {
        var customers = await _customerRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<CustomerDto>>(customers);
    }

    public async Task<CustomerDto?> GetCustomerByIdAsync(int id)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        return customer == null ? null : _mapper.Map<CustomerDto>(customer);
    }

    public async Task<CustomerDto?> GetCustomerWithBookingsAsync(int id)
    {
        var customer = await _customerRepository.GetCustomerWithBookingsAsync(id);
        return customer == null ? null : _mapper.Map<CustomerDto>(customer);
    }

    public async Task<IEnumerable<CustomerDto>> SearchCustomersByNameAsync(string name)
    {
        var customers = await _customerRepository.SearchCustomersByNameAsync(name);
        return _mapper.Map<IEnumerable<CustomerDto>>(customers);
    }

    public async Task<CustomerDto?> GetCustomerByEmailAsync(string email)
    {
        var customer = await _customerRepository.GetCustomerByEmailAsync(email);
        return customer == null ? null : _mapper.Map<CustomerDto>(customer);
    }

    public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto customerDto)
    {
        var customer = _mapper.Map<Customer>(customerDto);
        var createdCustomer = await _customerRepository.AddAsync(customer);
        return _mapper.Map<CustomerDto>(createdCustomer);
    }

    public async Task<bool> UpdateCustomerAsync(int id, UpdateCustomerDto customerDto)
    {
        var existingCustomer = await _customerRepository.GetByIdAsync(id);
        if (existingCustomer == null)
            return false;

        _mapper.Map(customerDto, existingCustomer);
        await _customerRepository.UpdateAsync(existingCustomer);
        return true;
    }

    public async Task<bool> DeleteCustomerAsync(int id)
    {
        var exists = await _customerRepository.ExistsAsync(id);
        if (!exists)
            return false;

        await _customerRepository.DeleteAsync(id);
        return true;
    }
}

