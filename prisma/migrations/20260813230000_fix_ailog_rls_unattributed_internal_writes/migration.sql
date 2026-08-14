-- Onda 2.5 - Agente 01 (Plataforma, Segurança e Dados)
--
-- Corrige a falha observada em `npm run verify:ai`: chamadas de IA executadas fora de uma
-- request HTTP (scripts, workers e verificadores) chegam a `logAiUsage()` sem tenant no
-- AsyncLocalStorage e precisam gravar `organizationId = NULL`.
--
-- A autorização desse caso NÃO usa app.bypass_rls. O gateway abre uma transação curta e seta
-- `app.allow_unattributed_ailog = 'on'` com SET LOCAL. A variável morre no COMMIT/ROLLBACK e a
-- policy abaixo só a reconhece para linhas AILog sem organização. Isso evita um bypass genérico.
--
-- Prisma usa INSERT ... RETURNING, portanto a mesma autorização precisa existir em SELECT para
-- a linha recém-inserida poder ser devolvida dentro da transação. Fora dessa transação, AILog NULL
-- continua invisível aos tenants.

DROP POLICY IF EXISTS tenant_isolation_policy ON "AILog";
DROP POLICY IF EXISTS ailog_tenant_select_policy ON "AILog";
DROP POLICY IF EXISTS ailog_tenant_insert_policy ON "AILog";
DROP POLICY IF EXISTS ailog_tenant_update_policy ON "AILog";
DROP POLICY IF EXISTS ailog_tenant_delete_policy ON "AILog";

CREATE POLICY ailog_tenant_select_policy ON "AILog"
FOR SELECT
USING (
    current_setting('app.current_tenant_id', TRUE) = "organizationId"
    OR current_setting('app.bypass_rls', TRUE) = 'on'
    OR (
        "organizationId" IS NULL
        AND current_setting('app.allow_unattributed_ailog', TRUE) = 'on'
        AND current_user NOT IN ('anon', 'authenticated')
    )
);

CREATE POLICY ailog_tenant_insert_policy ON "AILog"
FOR INSERT
WITH CHECK (
    current_setting('app.current_tenant_id', TRUE) = "organizationId"
    OR current_setting('app.bypass_rls', TRUE) = 'on'
    OR (
        "organizationId" IS NULL
        AND current_setting('app.allow_unattributed_ailog', TRUE) = 'on'
        AND current_user NOT IN ('anon', 'authenticated')
    )
);

CREATE POLICY ailog_tenant_update_policy ON "AILog"
FOR UPDATE
USING (
    current_setting('app.current_tenant_id', TRUE) = "organizationId"
    OR current_setting('app.bypass_rls', TRUE) = 'on'
)
WITH CHECK (
    current_setting('app.current_tenant_id', TRUE) = "organizationId"
    OR current_setting('app.bypass_rls', TRUE) = 'on'
);

CREATE POLICY ailog_tenant_delete_policy ON "AILog"
FOR DELETE
USING (
    current_setting('app.current_tenant_id', TRUE) = "organizationId"
    OR current_setting('app.bypass_rls', TRUE) = 'on'
);
