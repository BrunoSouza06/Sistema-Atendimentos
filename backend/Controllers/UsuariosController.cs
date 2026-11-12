using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsuariosController : ControllerBase
{
    private readonly SupabaseAdminService _service;

    public UsuariosController(SupabaseAdminService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await _service.ListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create(UsuarioCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || dto.Password.Length < 6)
            return BadRequest("Informe um email e uma senha com pelo menos 6 caracteres.");

        var (ok, erro) = await _service.CreateAsync(dto);
        return ok ? NoContent() : BadRequest(erro);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var meuId = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (id == meuId) return BadRequest("Você não pode excluir o próprio usuário.");

        var ok = await _service.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}