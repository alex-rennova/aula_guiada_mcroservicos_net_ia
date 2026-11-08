# Modelo de aula do Banco ANFX

Cada nova implementação deve ter uma aula correspondente em `dist/lessons.js`.

1. Contexto: qual necessidade do banco estamos resolvendo?
2. No ANFX Legacy: descreva um exemplo do comportamento anterior simulado.
3. Objetivos: o que o aluno aprenderá e o que foi efetivamente implementado.
4. Decisão: limite de negócio, alternativas, motivo da escolha e consequências.
5. Tecnologia: função, ganhos e custos; não escolher ferramentas apenas para completar a arquitetura.
6. Diagrama: fluxo real da implementação, diferenciando execução e dependências de código.
7. Código: caminhos relativos à solução, classes, trechos comentados e contratos HTTP/eventos.
8. Execução: pré-requisitos, comandos e exemplos reproduzíveis, sem credenciais reais.
9. Verificação: o que foi executado, resultado e limitações. Não afirmar sucesso sem evidência.
10. Exercício de fixação: pergunta com explicação ou atividade prática.
11. Próximo passo: separar claramente planejamento de comportamento implementado.

## Registro JavaScript

Adicione o registro ao array `window.ANFX_LESSONS`, na posição desejada:

```js
{
  id: 'id-estavel-da-aula',
  number: '06',
  group: 'TÍTULO DO GRUPO',
  title: 'Título na navegação',
  kind: 'lesson', // lesson, guide ou planned
  duration: '8 min',
  category: 'Categoria',
  heading: 'Título principal com <em>destaque</em>',
  intro: 'Resumo da aula.',
  body: `<div class="section-title"><h2>Contexto</h2></div>
         <p class="section-copy">Conteúdo autoral revisado.</p>
         {{files}}`,
  files: [['Finalidade do arquivo', 'src/caminho-real/Arquivo.cs']],
  quiz: {
    question: 'Pergunta sobre uma decisão?',
    options: ['Alternativa A', 'Alternativa B'],
    correct: 1,
    explanation: 'Por que B resolve a questão.'
  }
}
```

O corpo aceita HTML editorial confiável, mantido no código. Não inserir conteúdo de usuário ou fontes externas sem sanitização. IDs são usados em URLs e progresso; preserve os existentes. `Concluída` representa leitura marcada pelo aluno, nunca estado da implementação.
