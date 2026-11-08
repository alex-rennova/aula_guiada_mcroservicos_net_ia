# ANFX Lab

Portal de aulas que acompanha a construção dos microserviços do Banco ANFX. HTML5, CSS e JavaScript, com diagramas vetoriais, busca, exercícios e progresso local. Não precisa instalar pacotes nem compilar.

## Abrir localmente

No terminal, dentro desta pasta:

```powershell
node server.mjs
```

Acesse http://127.0.0.1:4173. Para encerrar, use Ctrl+C. Outra porta: `$env:PORT=4174` antes do comando.

Também é possível abrir `dist/index.html` diretamente. O servidor local é recomendado para consultar os arquivos .NET com “Ver código”. Na versão hospedada, use “Copiar” para localizar o arquivo no checkout local.

## Conteúdo

- Aula 00: cenário, método e mapa inicial.
- Aula 01: ANFX Legacy e primeiro fluxo bancário proposto.
- Aula 02: estrutura .NET realmente existente, responsabilidades, caminhos e limitações.
- Guia: navegação, status e manutenção das aulas.
- Planejamento: Clientes e Contas, Pagamentos, Seguros e Investimentos.

As leituras concluídas são salvas apenas neste navegador. Os módulos bancários ainda não foram implementados. O monólito ANFX Legacy é uma simulação didática.

## Manutenção e verificação

Edite `dist/lessons.js` conforme `AULA-MODELO.md`. Estilos ficam em `dist/styles.css`, interações em `dist/app.js`. A fonte remota é opcional; há fontes de sistema como fallback e nenhum script externo.

```powershell
npm run check
```

O servidor publica somente `dist/` e permite consulta somente leitura de `.cs` e `.csproj` em `src/` e `tests/` da solução vizinha. Configurações, credenciais e pastas de build não são expostas.
