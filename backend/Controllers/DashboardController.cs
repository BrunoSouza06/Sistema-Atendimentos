using Microsoft.AspNetCore.Mvc;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _service;

    public DashboardController(DashboardService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] int mes,
        [FromQuery] int ano)
    {
        return Ok(await _service.GetAsync(mes, ano));
    }

    [HttpGet("faturamento")]
    public async Task<IActionResult> Faturamento([FromQuery] int ano)
    {
        var dados = await _service.GetFaturamentoAnoAsync(ano);
        return Ok(dados);
    }
}