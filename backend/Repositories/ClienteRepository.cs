using Dapper;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class ClienteRepository : IClienteRepository
{
    private readonly DbConnectionFactory _factory;

    public ClienteRepository(DbConnectionFactory factory)
    {
        _factory = factory;
    }

   public async Task<IEnumerable<Cliente>> GetAllAsync()
{
    using var conn = _factory.CreateConnection();

    const string sql = @"
        SELECT
            id      AS Id,
            name    AS Name,
            phone   AS Phone,
            email   AS Email,
            active  AS Active
        FROM clients
        ORDER BY name;";

    return await conn.QueryAsync<Cliente>(sql);
}

    public async Task<Cliente?> GetByIdAsync(Guid id)
{
    using var conn = _factory.CreateConnection();

    const string sql = @"
        SELECT
            id AS Id,
            name AS Name,
            phone AS Phone,
            email AS Email,
            active AS Active
        FROM clients
        WHERE id = @Id;";

    return await conn.QuerySingleOrDefaultAsync<Cliente>(sql, new { Id = id });
}

public async Task<Cliente> CreateAsync(Cliente cliente)
{
    using var conn = _factory.CreateConnection();

    const string sql = @"
        INSERT INTO clients
        (
            name,
            phone,
            email,
            active
        )
        VALUES
        (
            @Name,
            @Phone,
            @Email,
            @Active
        )
        RETURNING id;";

    cliente.Id = await conn.QuerySingleAsync<Guid>(sql, cliente);

    return cliente;
}

public async Task<bool> UpdateAsync(Cliente cliente)
{
    using var conn = _factory.CreateConnection();

    const string sql = @"
        UPDATE clients
        SET
            name = @Name,
            phone = @Phone,
            email = @Email,
            active = @Active
        WHERE id = @Id;";

    var rows = await conn.ExecuteAsync(sql, cliente);

    return rows > 0;
}

public async Task<bool> DeleteAsync(Guid id)
{
    using var conn = _factory.CreateConnection();

    const string sql = @"
        UPDATE clients
        SET active = false
        WHERE id = @Id;";

    var rows = await conn.ExecuteAsync(sql, new { Id = id });

    return rows > 0;
}
}