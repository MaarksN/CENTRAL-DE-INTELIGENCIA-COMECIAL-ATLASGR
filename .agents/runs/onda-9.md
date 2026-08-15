# Onda 9 — Correção do bug de visibilidade do AsyncLocalStorage sob Prisma 7

- Data: 2026-08-15
- Branch: `fix/async-context-prisma7-visibility`, criada a partir de `main` (commit `67e80179`,
  já com a Onda 7 integrada).
- Executor: Coordenador (00), diretamente — investigação e correção pontual, não onda de agentes.
- Autorização: usuário confirmou "PODE INVESTIGAR" após o relatório final da Onda 7 apontar o
  achado independente dos Agentes 07/12/13.

## Contexto

Handoffs de origem:
- `.agents/handoffs/onda-7/07-para-01-flaky-org-creation-mid-integration-test.md`
- `.agents/handoffs/onda-7/12-para-00-test-db-contencao-cross-agente.md`
- `.agents/handoffs/onda-7/13-para-01-anomalia-visibilidade-entre-requestcontext-run.md`

Três agentes da Onda 7, de forma independente, encontraram sintomas da mesma classe de bug:
escrita e leitura via Prisma, dentro de dois `requestContext.run()` de nível superior separados,
perdendo visibilidade entre si de forma intermitente/determinística.

## Causa raiz

Reproduzida de forma isolada, fora do harness de teste, sem nenhuma extensão Prisma no meio:
qualquer callback passado a `requestContext.run(store, callback)` que **não é ele próprio uma
função `async`** perde o contexto do `AsyncLocalStorage` sob o client-engine-runtime do Prisma 7
(`@prisma/client` 7.9.1) — `requestContext.getStore()` volta `undefined` dentro de
`executeWithRls` (`src/lib/prisma.ts`), mesmo com `tenantId`/`bypassRls` corretos passados para
`run()`. Sem contexto, a policy de RLS nega a operação (fail-closed, nunca vazamento entre
tenants) — mas quebra funcionalidade real de forma silenciosa e intermitente.

Confirmado com scripts de repro isolados (descartados após uso, não commitados):
1. `pg` puro (sem Prisma): comporta-se como esperado — mesma conexão/transação funciona, conexões
   separadas do pool falham (esperado, não é bug).
2. `$transaction([...])` array-form do Prisma puro (sem extensão): funciona.
3. Extensão `$extends` + `$transaction([...])` sem `AsyncLocalStorage`: funciona.
4. Extensão + `AsyncLocalStorage.run(store, callback)` com `callback` **não-async**: falha,
   `getStore()` retorna `undefined`.
5. Mesmo caso com `callback` **async**: funciona, `getStore()` correto.

Não é bug do `pg`/`@prisma/adapter-pg`, nem contenção entre processos/agentes (hipótese original
do Agente 12, descartada — reproduzido em processo único, sem nenhuma concorrência).

## Correção

`runInContext()` centralizado em `src/lib/async-context.ts` — sempre envolve o callback em
`async () => fn()`, incondicionalmente seguro (nunca muda o comportamento de um callback que já
funcionava). Aplicado em todos os call sites reais com o padrão não-seguro:

**Produção (5):** `src/shared/middlewares/authenticateToken.ts` (x2 — inclui o hook que
estabelece o `tenantId` para o resto da cadeia de toda requisição autenticada),
`src/features/integrations/bitrix/bitrix.webhook.ts`, `src/features/automations/automation.engine.ts`,
`server.ts` (rota `/api/auth/*` inteira, e o sync de feature flags no boot — este último
introduzido pela sessão paralela durante esta investigação, corrigido no rebase).

**Testes (16):** `tests/helpers/integration-setup.ts` e os `withRlsBypass`/`asOrg`-equivalentes
duplicados em `tests/integration/{swarm-autonomous-mission-e2e,threecx-persistence,
lgpd-erasure-cross-tenant,tenant-isolation-db001,knowledge-rag-tenant-isolation}.test.ts`, mais
`src/features/intelligence/agents/__tests__/{ops,sdr}.agent.consent.test.ts` (unitários com
Prisma mockado — bug não se manifesta ali, corrigido por consistência/defesa em profundidade).

Também corrigido: `tests/integration/threecx-persistence.test.ts` usava `prisma.$queryRaw` direto
para inspecionar cifra em repouso — SQL cru não passa por `$allOperations` (só intercepta
operação de model), então precisa do helper dedicado `withRlsContext()` (já existente em
`src/lib/prisma.ts`), não só de `AsyncLocalStorage` correto. Os 2 testes quarentenados no gate
final da Onda 7 (`it.skip`, ver PR #128) foram reabilitados.

Achado extra durante o gate de e2e: `tests/e2e/crm.spec.ts` tinha um seletor ambíguo
(`getByRole('button', {name: 'Agenda'})` sem `exact: true` também batia no botão "Ver agenda
completa" do Dashboard) — pré-existente, não relacionado a este bug, corrigido por ter sido
encontrado no caminho.

## Gate

`tsc --noEmit`: limpo. `lint`: 0 erros, 101 warnings (baseline). `test:unit`: 1065/1065.
`test:integration`: 91/91, 2 execuções completas seguidas (determinismo confirmado — as 2
asserções antes quarentenadas passam de forma estável). `build`: ok. `test:e2e`: 44-45/45 (+ 5
skipped, baseline visual pendente) em múltiplas execuções — a única falha observada
(`crm-kanban.spec.ts:108`, drag-and-drop por teclado com anúncio ARIA) é flakiness de timing
pré-existente, não relacionada a este fix; reproduziu em linhas diferentes em rodadas diferentes,
nunca em cascata de autenticação/RLS (padrão de servidor caído, descartado).

## Status

PR aberto contra `main`. Não bloqueia nem depende da Onda 8 (arquivos disjuntos, confirmado por
ambas as sessões antes do disparo).
