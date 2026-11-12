// Services/AtendimentoService.cs
using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class AtendimentoService
{
    private readonly IAtendimentoRepository _repo;

    public AtendimentoService(IAtendimentoRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<AtendimentoResponseDto>> GetByMesAnoAsync(int mes, int ano)
    {
        var lista = await _repo.GetByMesAnoAsync(mes, ano);
        return lista.Select(AtendimentoResponseDto.FromModel);
    }

    public async Task<AtendimentoResponseDto> CreateAsync(AtendimentoCreateDto dto)
    {
        var model = new Atendimento
        {
            Data = dto.Data,
            ClientId = dto.ClientId,
            TipoSessao = dto.TipoSessao,
            ValorSessao = dto.ValorSessao,
            PercentualRepasse = dto.PercentualRepasse
        };

        var criado = await _repo.CreateAsync(model);

        return AtendimentoResponseDto.FromModel(criado);
    }

    public Task<bool> DeleteAsync(Guid id)
        => _repo.DeleteAsync(id);

    public async Task<bool> UpdateAsync(Guid id, AtendimentoCreateDto dto)
    {
        var model = new Atendimento
        {
            Id = id,
            Data = dto.Data,
            ClientId = dto.ClientId,
            TipoSessao = dto.TipoSessao,
            ValorSessao = dto.ValorSessao,
            PercentualRepasse = dto.PercentualRepasse
        };

        return await _repo.UpdateAsync(model);
    }
}