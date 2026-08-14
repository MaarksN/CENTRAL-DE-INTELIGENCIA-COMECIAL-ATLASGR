-- Onda 2.5 - Agente 01 (Plataforma, Segurança e Dados)
--
-- Chamadas de IA internas (scripts, workers e verificadores) podem não possuir tenant no
-- AsyncLocalStorage e, portanto, precisam registrar AILog com organizationId = NULL.
--
-- Esse corredor NÃO usa app.bypass_rls. O gravador interno abre uma transação curta, ativa
-- app.allow_unattributed_ailog='on' com SET LOCAL e executa INSERT parametrizado SEM RETURNING.
-- A flag morre no COMMIT/ROLLBACK e só é reconhecida pela policy de INSERT desta tabela.
--
-- A policy de SELECT permanece estrita: logs NULL nunca ficam legíveis para um tenant comum nem
-- para a própria transação interna. Isso evita transformar telemetria não atribuída em bypass.

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
