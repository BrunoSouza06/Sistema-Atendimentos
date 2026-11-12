// DTOs/AtendimentoDtos.cs
namespace backend.DTOs;

public record AtendimentoCreateDto(
    DateOnly Data,
    Guid ClientId,
    string TipoSessao,
    decimal ValorSessao,
    decimal PercentualRepasse = 20
);

public record AtendimentoResponseDto(
    Guid Id,
    DateOnly Data,
    Guid ClientId,
    string ClienteNome,
    string TipoSessao,
    decimal ValorSessao,
    decimal PercentualRepasse,
    decimal ValorRepasse
)
{
    public static AtendimentoResponseDto FromModel(Models.Atendimento a) => new(
        a.Id,
        a.Data,
        a.ClientId,
        a.ClienteNome,
        a.TipoSessao,
        a.ValorSessao,
        a.PercentualRepasse,
        Math.Round(a.ValorSessao * a.PercentualRepasse / 100, 2)
    );
}