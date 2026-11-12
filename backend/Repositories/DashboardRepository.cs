using Dapper;
using backend.Data;
using backend.DTOs;

namespace backend.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly DbConnectionFactory _factory;

    public DashboardRepository(DbConnectionFactory factory)
    {
        _factory = factory;
    }

    public async Task<DashboardDto> GetAsync(int mes, int ano)
    {
        using var conn = _factory.CreateConnection();

        const string sql = @"
            SELECT
                COALESCE(SUM(valor_sessao),0) AS Receita,

                COALESCE(
                    SUM(valor_sessao * percentual_repasse / 100),
                0) AS Repasse,

                COALESCE(
                    SUM(valor_sessao) -
                    SUM(valor_sessao * percentual_repasse / 100),
                0) AS Lucro,

                COUNT(*) AS QuantidadeAtendimentos

            FROM atendimentos

            WHERE EXTRACT(MONTH FROM data)=@Mes
              AND EXTRACT(YEAR FROM data)=@Ano;
        ";

        return await conn.QuerySingleAsync<DashboardDto>(
            sql,
            new
            {
                Mes = mes,
                Ano = ano
            });
    }

        public async Task<IEnumerable<FaturamentoMensalDto>> GetFaturamentoAnoAsync(int ano)
    {
        using var conn = _factory.CreateConnection();

        const string sql = @"
        SELECT
            EXTRACT(MONTH FROM data)::int AS Mes,
            COALESCE(SUM(valor_sessao),0) AS Receita
        FROM atendimentos
        WHERE EXTRACT(YEAR FROM data)=@Ano
        GROUP BY EXTRACT(MONTH FROM data)
        ORDER BY Mes";

        return await conn.QueryAsync<FaturamentoMensalDto>(
            sql,
            new { Ano = ano });
    }
}

