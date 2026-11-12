// Repositories/AtendimentoRepository.cs
using Dapper;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class AtendimentoRepository : IAtendimentoRepository
{
    private readonly DbConnectionFactory _factory;

    public AtendimentoRepository(DbConnectionFactory factory)
    {
        _factory = factory;
    }

    public async Task<IEnumerable<Atendimento>> GetByMesAnoAsync(int mes, int ano)
{
    using var conn = _factory.CreateConnection();

    const string sql = @"
        SELECT
            a.id                   AS Id,
            a.data                 AS Data,
            a.client_id            AS ClientId,
            c.name                 AS ClienteNome,
            a.tipo_sessao          AS TipoSessao,
            a.valor_sessao         AS ValorSessao,
            a.percentual_repasse   AS PercentualRepasse
        FROM atendimentos a
        INNER JOIN clients c
            ON c.id = a.client_id
        WHERE extract(month from a.data) = @Mes
          AND extract(year from a.data) = @Ano
        ORDER BY a.data";

    return await conn.QueryAsync<Atendimento>(sql, new { Mes = mes, Ano = ano });
}

    public async Task<Atendimento?> GetByIdAsync(Guid id)
{
    using var conn = _factory.CreateConnection();

    const string sql = @"
        SELECT
            a.id                   AS Id,
            a.data                 AS Data,
            a.client_id            AS ClientId,
            c.name                 AS ClienteNome,
            a.tipo_sessao          AS TipoSessao,
            a.valor_sessao         AS ValorSessao,
            a.percentual_repasse   AS PercentualRepasse
        FROM atendimentos a
        INNER JOIN clients c
            ON c.id = a.client_id
        WHERE a.id = @Id";

    return await conn.QuerySingleOrDefaultAsync<Atendimento>(sql, new { Id = id });
}

    public async Task<Atendimento> CreateAsync(Atendimento a)
{
    using var conn = _factory.CreateConnection();

    const string sql = @"
        INSERT INTO atendimentos
        (
            data,
            client_id,
            tipo_sessao,
            valor_sessao,
            percentual_repasse
        )
        VALUES
        (
            @Data,
            @ClientId,
            @TipoSessao,
            @ValorSessao,
            @PercentualRepasse
        )
        RETURNING id;";

    a.Id = await conn.QuerySingleAsync<Guid>(sql, a);

    return a;
}

    public async Task<bool> DeleteAsync(Guid id)
    {
        using var conn = _factory.CreateConnection();
        var rows = await conn.ExecuteAsync("delete from atendimentos where id = @Id", new { Id = id });
        return rows > 0;
    }

    public async Task<bool> UpdateAsync(Atendimento a)
{
    using var conn = _factory.CreateConnection();

    const string sql = @"
        UPDATE atendimentos
        SET
            data = @Data,
            client_id = @ClientId,
            tipo_sessao = @TipoSessao,
            valor_sessao = @ValorSessao,
            percentual_repasse = @PercentualRepasse
        WHERE id = @Id;";

    var rows = await conn.ExecuteAsync(sql, a);

    return rows > 0;
}
}