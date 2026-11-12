using System.Text.Json;
using backend.Services;

namespace backend.Services;

public record UsuarioDto(string Id, string Email, DateTime? CreatedAt, DateTime? LastSignInAt);
public record UsuarioCreateDto(string Email, string Password);

public class SupabaseAdminService
{
    private readonly HttpClient _http;

    public SupabaseAdminService(HttpClient http)
    {
        _http = http;
    }

    public async Task<IEnumerable<UsuarioDto>> ListAsync()
    {
        var res = await _http.GetAsync("users?per_page=100");
        res.EnsureSuccessStatusCode();

        using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
        var users = doc.RootElement.GetProperty("users");

        return users.EnumerateArray().Select(u => new UsuarioDto(
            u.GetProperty("id").GetString()!,
            u.TryGetProperty("email", out var e) ? e.GetString() ?? "" : "",
            u.TryGetProperty("created_at", out var c) && c.ValueKind == JsonValueKind.String ? c.GetDateTime() : null,
            u.TryGetProperty("last_sign_in_at", out var l) && l.ValueKind == JsonValueKind.String ? l.GetDateTime() : null
        )).OrderBy(u => u.CreatedAt).ToList();
    }

    public async Task<(bool Ok, string? Erro)> CreateAsync(UsuarioCreateDto dto)
    {
        var res = await _http.PostAsJsonAsync("users", new
        {
            email = dto.Email,
            password = dto.Password,
            email_confirm = true
        });

        if (res.IsSuccessStatusCode) return (true, null);
        return (false, await LerErroAsync(res));
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var res = await _http.DeleteAsync($"users/{id}");
        return res.IsSuccessStatusCode;
    }

    private static async Task<string> LerErroAsync(HttpResponseMessage res)
    {
        try
        {
            using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
            if (doc.RootElement.TryGetProperty("msg", out var msg)) return msg.GetString() ?? "Erro ao criar usuário.";
            if (doc.RootElement.TryGetProperty("message", out var message)) return message.GetString() ?? "Erro ao criar usuário.";
        }
        catch { }
        return "Erro ao criar usuário.";
    }
}