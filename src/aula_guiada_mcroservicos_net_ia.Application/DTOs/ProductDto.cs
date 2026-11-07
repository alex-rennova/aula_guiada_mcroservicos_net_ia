namespace aula_guiada_mcroservicos_net_ia.Application.DTOs;

public sealed record ProductDto(
    Guid Id,
    string Name,
    decimal Price
);
