using backend.DTOs;
using backend.Repositories;

namespace backend.Services;

public class DashboardService
{
    private readonly IDashboardRepository _repo;

    public DashboardService(IDashboardRepository repo)
    {
        _repo = repo;
    }

    public async Task<DashboardDto> GetAsync(int mes, int ano)
    {
        return await _repo.GetAsync(mes, ano);
    }

    public Task<IEnumerable<FaturamentoMensalDto>> GetFaturamentoAnoAsync(int ano)
    {
        return _repo.GetFaturamentoAnoAsync(ano);
    }
}