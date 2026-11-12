using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientesController : ControllerBase
{
    private readonly ClienteService _service;

    public ClientesController(ClienteService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var clientes = await _service.GetAllAsync();
        return Ok(clientes);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Cliente cliente)
    {
        var criado = await _service.CreateAsync(cliente);
        return Ok(criado);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, Cliente cliente)
    {
        cliente.Id = id;

        var ok = await _service.UpdateAsync(cliente);

        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _service.DeleteAsync(id);

        return ok ? NoContent() : NotFound();
    }
}