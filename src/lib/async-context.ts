import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
    tenantId?: string;
    userId?: string;
    role?: string;
    // Só usado para as rotas do Better Auth (/api/auth/*, ver server.ts) e para a checagem de
    // sessão em authenticateToken.ts: antes de uma sessão existir não há tenantId conhecido, mas
    // o Better Auth ainda precisa localizar o usuário por e-mail (login), criar a Organization
    // inicial (signup) e ler/gravar Session — todas essas tabelas têm FORCE ROW LEVEL SECURITY
    // (prisma/migrations/20260722020322_enable_rls). Sem este bypass explícito,
    // current_setting('app.current_tenant_id') nunca bate com nada e as policies de RLS bloqueiam
    // até as próprias queries internas do Better Auth. O efeito do bypass, na camada do Prisma
    // (src/lib/prisma.ts), é restrito a um allowlist de models de identidade — nunca vale para
    // Company/Lead/etc.
    bypassRls?: boolean;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

export const getTenantId = (): string | undefined => {
    return requestContext.getStore()?.tenantId;
};

export const getUserId = (): string | undefined => {
    return requestContext.getStore()?.userId;
};

/**
 * Sempre use isto em vez de `requestContext.run(store, callback)` direto quando `callback`
 * (ou algo que ele chama de forma síncrona) acaba executando uma query Prisma.
 *
 * Causa raiz (achado real, Onda 7 → investigação pós-merge, 2026-08-15): sob o
 * client-engine-runtime do Prisma 7 (`src/lib/prisma.ts`, sem query engine binário — interpreta a
 * árvore de query em JS puro), `AsyncLocalStorage.getStore()` volta `undefined` dentro de
 * `executeWithRls` sempre que o `callback` passado para `requestContext.run(...)` NÃO é ele
 * próprio uma função `async` — mesmo que esse callback só chame, de forma síncrona, uma função
 * async e devolva a promise dela sem await (`() => prisma.model.create(...)`). Com o contexto
 * perdido, `executeWithRls` cai no atalho `!tenantId && !bypassRls` e roda a query SEM nenhum
 * `set_config` de tenant/bypass — o resultado é falha fail-closed da política de RLS (nunca
 * vazamento entre tenants), mas quebra funcionalidade real de forma silenciosa/intermitente.
 * Reproduzido de forma isolada e determinística (script fora do harness de teste, sem Prisma
 * extension nenhuma no meio) — não é bug do `pg`/`@prisma/adapter-pg` em si, nem contenção entre
 * processos.
 *
 * `async () => fn()` corrige isso de forma incondicionalmente segura: nunca muda o comportamento
 * de um callback que já funcionava, só corrige os que perdiam contexto.
 */
export function runInContext<T>(store: RequestContext, fn: () => T | Promise<T>): Promise<T> {
    return requestContext.run(store, async () => fn());
}
