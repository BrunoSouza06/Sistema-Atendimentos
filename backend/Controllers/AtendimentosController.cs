using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AtendimentosController : ControllerBase
{
    private readonly AtendimentoService _service;

    public AtendimentosController(AtendimentoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int mes, [FromQuery] int ano)
    {
        if (mes is < 1 or > 12) return BadRequest("Mês inválido.");
        var resultado = await _service.GetByMesAnoAsync(mes, ano);
        return Ok(resultado);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AtendimentoCreateDto dto)
    {
        var criado = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { mes = dto.Data.Month, ano = dto.Data.Year }, criado);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, AtendimentoCreateDto dto)
    {
        var ok = await _service.UpdateAsync(id, dto);
        return ok ? NoContent() : NotFound();
    }
}