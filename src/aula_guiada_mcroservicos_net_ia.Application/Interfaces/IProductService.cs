using aula_guiada_mcroservicos_net_ia.Application.DTOs;

namespace aula_guiada_mcroservicos_net_ia.Application.Interfaces;

public interface IProductService
{
    Task<ProductDto> CreateAsync(
        string name,
        decimal price,
        CancellationToken cancellationToken = default);

    Task<ProductDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ProductDto>> GetAllAsync(
        CancellationToken cancellationToken = default);
}
