namespace backend.Models;

public class Cliente
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public bool Active { get; set; }
}