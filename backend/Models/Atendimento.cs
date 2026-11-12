// Models/Atendimento.cs
namespace backend.Models;

public class Atendimento
{
    public Guid Id { get; set; }

    public DateOnly Data { get; set; }

    public Guid ClientId { get; set; }

    // Será preenchido pelo JOIN com a tabela clients
    public string ClienteNome { get; set; } = string.Empty;

    public string TipoSessao { get; set; } = string.Empty;

    public decimal ValorSessao { get; set; }

    public decimal PercentualRepasse { get; set; } = 20;
}