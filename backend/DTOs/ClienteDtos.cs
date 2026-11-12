namespace backend.DTOs;

public record ClienteCreateDto(
    string Name,
    string? Phone,
    string? Email
);