# Market Intelligence Atlas GR — Unit Economics v1.4

## Registro auditável de decisões econômicas territoriais

A v1.4 não altera o ranking territorial Core Evidence nem a matemática econômica da v1.2. Ela resolve um problema de governança: uma decisão econômica preenchida na interface não pode existir somente no estado temporário do navegador.

A partir desta versão, ADMIN e GESTOR podem registrar um snapshot econômico imutável e reproduzível.

## O que é persistido

Cada snapshot contém:

- território canônico publicado em `data/territorios.json`;
- versão da metodologia territorial;
- versão do modelo econômico;
- cenário comercial (`CONSERVADOR`, `BASE` ou `AGRESSIVO`);
- percentual de mercado ICP atendível;
- custos mensais do vendedor;
- investimento inicial;
- premissas de receita, funil e retenção;
- política de payback e ROI;
- snapshot da calibração CRM, quando existente;
- indicação explícita de a calibração ter sido aplicada ou não;
- assessment econômico recalculado no servidor;
- recomendação resultante;
- hash SHA-256 determinístico;
- autor e data de criação.

## Regra central: o navegador não é fonte de verdade

O `POST /api/market-intelligence/economic-scenarios` recebe apenas as premissas e o `territoryId`.

O backend:

1. abre o ranking materializado publicado;
2. resolve o território pelo `territoryId`;
3. ignora qualquer tentativa do cliente de informar TAM, score, cidade, confiança ou veredito;
4. deriva o SAM a partir do TAM canônico e da parcela atendível;
5. recalcula `assessTerritoryEconomics` no servidor;
6. monta o snapshot final;
7. gera o hash determinístico;
8. persiste o resultado sob RLS.

Assim, mudar uma resposta no DevTools não transforma um cenário ruim em `RECOMENDADO` dentro da trilha auditável.

## Integridade da calibração CRM

Quando `calibration.applied = true`, o servidor exige que:

- o snapshot de calibração exista;
- ele esteja elegível;
- Ticket MRR, Win Rate e Sales Cycle do cenário correspondam aos valores recomendados pela calibração registrada.

Se um destes três valores divergir, a gravação é rejeitada.

A ausência de calibração continua válida. Cenários totalmente manuais podem ser auditados, desde que o snapshot registre explicitamente `applied = false`.

## Imutabilidade e idempotência

A API não expõe `PUT`, `PATCH` nem `DELETE` para cenários econômicos.

O banco possui chave única:

```text
organizationId + snapshotHash
```

Salvar o mesmo estado econômico novamente não cria uma cópia nova. O registro já existente é devolvido.

Alterar qualquer premissa relevante gera outro hash e, portanto, outra versão histórica.

O nome do snapshot não participa do hash. Ele funciona como rótulo humano, não como parte da decisão matemática.

## Isolamento e RBAC

A tabela `MarketIntelligenceEconomicScenario` possui:

- `organizationId` obrigatório;
- `ENABLE ROW LEVEL SECURITY`;
- `FORCE ROW LEVEL SECURITY`;
- policy baseada em `app.current_tenant_id`;
- filtro explícito por organização nas queries de serviço como defesa adicional.

A rota exige:

```text
ADMIN ou GESTOR
```

Custos, margem, política de investimento e histórico de decisão não são expostos a papéis operacionais nesta versão.

## Reabrir um snapshot

Reabrir restaura:

- território;
- mercado atendível;
- custos;
- receita e funil;
- investimento inicial;
- política;
- cenário comercial.

A v1.4 não marca automaticamente uma calibração CRM histórica como aplicada numa nova versão.

O snapshot antigo continua preservando sua proveniência original. Se o usuário quiser salvar uma nova versão com selo CRM, deve reaplicar conscientemente a calibração corrente.

Isto evita representar dados históricos como se fossem uma leitura atual do CRM.

## O que a v1.4 não faz

A v1.4 não:

- altera o Opportunity Score territorial;
- inventa custos;
- inventa margem;
- inventa churn;
- inventa produtividade;
- inventa conversão reunião → oportunidade;
- altera o ranking materializado;
- aprova contratação automaticamente fora da política configurada;
- transforma snapshot histórico em verdade atual.

## Testes obrigatórios

A implementação deve manter verdes:

1. teste de integração real de persistência e idempotência;
2. teste de isolamento entre tenants;
3. rejeição de falsa proveniência CRM;
4. E2E de salvar, alterar o formulário e reabrir o estado histórico;
5. Market Intelligence Quality Gate;
6. Code Quality;
7. SonarQube;
8. Playwright;
9. CI completo.

## Evolução posterior

A trilha criada aqui permite, em versões futuras:

- comparar duas decisões históricas;
- exigir aprovação executiva sobre um snapshot específico;
- registrar `APROVADO`, `REJEITADO` ou `ADIADO` sem alterar o snapshot econômico original;
- medir posteriormente resultado realizado versus hipótese original;
- calibrar o modelo com decisões e resultados reais sem apagar o histórico.
