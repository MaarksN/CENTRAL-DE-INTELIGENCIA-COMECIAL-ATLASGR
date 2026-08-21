import { test, expect } from '@playwright/test';
import { signUp, uniqueTestEmail, waitForAppReady } from './helpers';

// MI-007 (Sprint 04/Onda 16): este E2E toca a rota real do Market Intelligence e funciona
// como contrato entre manifest, snapshots publicados e UI. A metodologia territorial continua
// fail-closed se uma camada obrigatória desaparecer, a calibração econômica só aplica CRM por
// ação explícita e a v1.4 registra cenários imutáveis sem confiar em resultados calculados no browser.

test.describe('Market Intelligence — módulo de território', () => {
  test('abre o módulo, navega para Saúde dos Dados e mostra o status real de cada dataset', async ({ page }) => {
    await signUp(page, { email: uniqueTestEmail('mi-smoke') });
    await page.goto('/app/market-intelligence');
    await waitForAppReady(page);

    await expect(page.getByRole('heading', { name: /Onde a Atlas GR deve contratar o próximo vendedor/i })).toBeVisible();

    await page.getByRole('button', { name: 'Saúde dos Dados' }).click();
    await expect(page.getByRole('heading', { name: /Competência, cobertura e confiança antes do score/i })).toBeVisible();

    const statusBadge = page.getByText(/^(ATUALIZADO|PARCIAL|DESATUALIZADO|NAO DISPONIVEL)$/).first();
    await expect(statusBadge).toBeVisible();
  });

  test('mostra ranking territorial Core Evidence quando os snapshots obrigatórios estão publicados', async ({ page }) => {
    await signUp(page, { email: uniqueTestEmail('mi-ready') });
    await page.goto('/app/market-intelligence');
    await waitForAppReady(page);

    await expect(page.getByRole('heading', { name: /Top 5 territórios calculados/i })).toBeVisible();
    await expect(page.getByText(/^#1$/)).toBeVisible();
    await expect(page.getByText(/Score/i).first()).toBeVisible();
  });

  test('liga unit economics aos territorios reais sem inventar premissas', async ({ page }) => {
    await signUp(page, { email: uniqueTestEmail('mi-economics') });
    await page.goto('/app/market-intelligence');
    await waitForAppReady(page);

    await page.getByRole('button', { name: /Economia territorial/i }).click();
    await expect(page.getByRole('heading', { name: /O território paga a contratação/i })).toBeVisible();
    await expect(page.getByLabel('Território analisado')).toBeVisible();
    await expect(page.getByText('PREMISSAS PENDENTES').first()).toBeVisible();
    await expect(page.getByText('TAM ICP observado', { exact: true })).toBeVisible();
    await expect(page.getByText('SAM derivado', { exact: true })).toBeVisible();
  });

  test('calibra ticket, win rate e sales cycle com historico real somente após ação explícita', async ({ page }) => {
    await page.route('**/api/commercial-intelligence/trends?**', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          points: [
            { period: '2026-03', label: 'Mar', winRate: 25, salesCycleMeanDays: 40, averageTicketWon: 3000, pipelineCreatedAmount: 100000, closedSampleSize: 15 },
            { period: '2026-04', label: 'Abr', winRate: 25, salesCycleMeanDays: 40, averageTicketWon: 3000, pipelineCreatedAmount: 100000, closedSampleSize: 15 },
            { period: '2026-05', label: 'Mai', winRate: 25, salesCycleMeanDays: 40, averageTicketWon: 3000, pipelineCreatedAmount: 100000, closedSampleSize: 15 },
            { period: '2026-06', label: 'Jun', winRate: 25, salesCycleMeanDays: 40, averageTicketWon: 3000, pipelineCreatedAmount: 100000, closedSampleSize: 15 },
          ],
        },
      }),
    }));

    await signUp(page, { email: uniqueTestEmail('mi-crm-calibration') });
    await page.goto('/app/market-intelligence');
    await waitForAppReady(page);
    await page.getByRole('button', { name: /Economia territorial/i }).click();

    await expect(page.getByText('CONFIANÇA ALTA', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Ticket MRR médio')).toHaveValue('0');
    await page.getByRole('button', { name: 'Aplicar dados do CRM' }).click();
    await expect(page.getByLabel('Ticket MRR médio')).toHaveValue('3000');
    await expect(page.getByLabel('Win Rate')).toHaveValue('25');
    await expect(page.getByLabel('Sales Cycle')).toHaveValue('40');
    await expect(page.getByText(/aplicado ao cenário atual/i)).toBeVisible();
  });

  test('salva e reabre snapshot econômico sem transformar histórico em estado efêmero', async ({ page }) => {
    const scenarioId = '44d4f8f6-5042-40df-85ec-9d3d71cb2395';
    let saved: Record<string, unknown> | null = null;

    await page.route('**/api/market-intelligence/economic-scenarios**', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const method = request.method();

      if (method === 'POST') {
        const payload = request.postDataJSON() as Record<string, any>;
        const input = {
          serviceableSharePct: payload.serviceableSharePct,
          costs: payload.costs,
          revenue: payload.revenue,
          upfrontInvestment: payload.upfrontInvestment,
          policy: payload.policy,
          scenario: payload.scenario,
          calibration: payload.calibration,
        };
        saved = {
          id: scenarioId,
          label: payload.label || 'Guarujá/SP · BASE',
          territoryId: payload.territoryId,
          baseCity: 'Guarujá',
          uf: 'SP',
          radiusKm: 100,
          commercialScenario: payload.scenario,
          recommendation: 'PREMISSAS_PENDENTES',
          auditVersion: 'market-intelligence-economics-v1.4',
          methodologyVersion: 'national-v1.1-core-evidence',
          economicModelVersion: 'seller-economics-v1.2',
          calibrationVersion: null,
          calibrationApplied: false,
          calibrationQuality: null,
          tamAccounts: 889983,
          samAccounts: 88998,
          monthlyFixedCost: 6000,
          paybackMonth: null,
          roi12Pct: null,
          roi24Pct: null,
          snapshotHash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
          createdAt: '2026-08-21T03:00:00.000Z',
          createdBy: 'test-user',
          snapshot: {
            auditVersion: 'market-intelligence-economics-v1.4',
            methodologyVersion: 'national-v1.1-core-evidence',
            economicModelVersion: 'seller-economics-v1.2',
            calibrationVersion: null,
            territory: {
              id: payload.territoryId,
              baseIbgeCode: '3518701',
              baseCity: 'Guarujá',
              uf: 'SP',
              radiusKm: 100,
              municipalityCount: 62,
              opportunityScore: 78.1,
              confidence: 'ALTO',
              icp: { total: 889983, tierA: 393243, tierB: 144457, tierC: 352283 },
              evidenceIds: ['cnpj', 'rntrc'],
            },
            input,
            assessment: {},
          },
        };
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true, data: saved }) });
        return;
      }

      if (method === 'GET' && url.pathname.endsWith(`/${scenarioId}`)) {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: saved }) });
        return;
      }

      const summary = saved ? [{ ...saved, snapshot: undefined }] : [];
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: summary }) });
    });

    await signUp(page, { email: uniqueTestEmail('mi-audit-snapshot') });
    await page.goto('/app/market-intelligence');
    await waitForAppReady(page);
    await page.getByRole('button', { name: /Economia territorial/i }).click();

    await expect(page.getByRole('heading', { name: /Snapshots econômicos imutáveis/i })).toBeVisible();
    await page.getByLabel('Salário').fill('6000');
    await page.getByLabel('ICP territorial realmente atendível').fill('10');
    await page.getByLabel('Nome do snapshot').fill('Expansão SP auditada');
    await page.getByRole('button', { name: 'Salvar snapshot auditável' }).click();

    await expect(page.getByText(/Snapshot registrado/i)).toBeVisible();
    await expect(page.getByText('Expansão SP auditada', { exact: true })).toBeVisible();

    await page.getByLabel('Salário').fill('7000');
    await expect(page.getByLabel('Salário')).toHaveValue('7000');
    await page.getByRole('button', { name: 'Carregar snapshot Expansão SP auditada' }).click();

    await expect(page.getByLabel('Salário')).toHaveValue('6000');
    await expect(page.getByText(/Snapshot reaberto:.*Expansão SP auditada/i)).toBeVisible();
  });

  test('volta a bloquear a decisão se o CIOT publicado desaparecer em runtime', async ({ page }) => {
    await page.route('**/tools/atlas-market-intelligence/data/mdfe_origens_municipios.json', (route) =>
      route.fulfill({ status: 404, contentType: 'application/json', body: '{}' }),
    );
    await page.route('**/tools/atlas-market-intelligence/data/mdfe_destinos_municipios.json', (route) =>
      route.fulfill({ status: 404, contentType: 'application/json', body: '{}' }),
    );

    await signUp(page, { email: uniqueTestEmail('mi-fail-closed') });
    await page.goto('/app/market-intelligence');
    await waitForAppReady(page);

    await expect(page.getByRole('heading', { name: /Ainda não há evidência suficiente para nomear o vendedor 01/i })).toBeVisible();
  });

  test('mostra estado de erro quando o manifest não pode ser carregado', async ({ page }) => {
    await page.route('**/tools/atlas-market-intelligence/data/manifest.json', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }),
    );

    await signUp(page, { email: uniqueTestEmail('mi-error') });
    await page.goto('/app/market-intelligence');

    await expect(page.getByRole('alert')).toBeVisible();
  });
});
