// Repositories/IAtendimentoRepository.cs
using backend.Models;

namespace backend.Repositories;

public interface IAtendimentoRepository
{
    Task<IEnumerable<Atendimento>> GetByMesAnoAsync(int mes, int ano);
    Task<Atendimento?> GetByIdAsync(Guid id);
    Task<Atendimento> CreateAsync(Atendimento atendimento);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> UpdateAsync(Atendimento atendimento);
}

