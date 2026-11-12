using backend.DTOs;

namespace backend.Repositories;

public interface IDashboardRepository
{
    Task<DashboardDto> GetAsync(int mes, int ano);

    Task<IEnumerable<FaturamentoMensalDto>> GetFaturamentoAnoAsync(int ano);
}