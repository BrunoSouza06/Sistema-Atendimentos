using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class ClienteService
{
    private readonly IClienteRepository _repo;

    public ClienteService(IClienteRepository repo)
    {
        _repo = repo;
    }

    public Task<IEnumerable<Cliente>> GetAllAsync()
        => _repo.GetAllAsync();

    public Task<Cliente> CreateAsync(Cliente cliente)
        => _repo.CreateAsync(cliente);

    public Task<bool> UpdateAsync(Cliente cliente)
        => _repo.UpdateAsync(cliente);

    public Task<bool> DeleteAsync(Guid id)
        => _repo.DeleteAsync(id);
}