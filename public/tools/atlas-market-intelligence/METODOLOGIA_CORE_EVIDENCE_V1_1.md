# Atlas Market Intelligence — Metodologia national-v1.1-core-evidence

## Objetivo

Responder de forma reproduzível à pergunta **"onde a Atlas GR deve contratar o próximo vendedor?"** mesmo quando a pesquisa competitiva nacional ainda não atingiu o padrão de `CENSO_COMPLETO`, sem transformar ausência de evidência em ausência de concorrência.

A versão anterior travava todo o ranking porque `White Space` e `territorialEfficiency` eram componentes obrigatórios do Opportunity Score. Isso fazia dados nacionais já disponíveis e rastreáveis (CNPJ/ICP, RNTRC, CIOT e Sinesp) não produzirem nenhuma recomendação operacional.

A v1.1 separa duas perguntas que não devem ser confundidas:

1. **Prioridade territorial baseada em evidência nacional disponível:** pode ser calculada agora.
2. **White Space competitivo / saturação local:** continua indisponível onde o censo é parcial.

## Core Evidence Score

O score-base usa apenas componentes com cobertura nacional reproduzível:

| Componente | Peso | Fonte | Geografia | Confiança de origem |
| --- | ---: | --- | --- | --- |
| ICP / demanda | 35% | Receita Federal CNPJ + taxonomia ICP Atlas | Município | 0,90 |
| Presença logística | 25% | ANTT RNTRC | Município | 0,90 |
| Fluxo logístico | 20% | ANTT CIOT, proxy documentado de fluxo MDF-e | Origem + destino municipal | 0,85 |
| Need / risco | 20% | MJSP Sinesp VDE | PROXY_UF | 0,50 |
| White Space | 0% | Censo competitivo | Fora do Core enquanto parcial | não aplicável |
| Eficiência territorial | 0% | Malha/tempo de deslocamento | Fora do Core até modelo aprovado | não aplicável |

Os pesos ativos somam 100%. Componentes de peso zero **não recebem valor zero**: permanecem `NAO_DISPONIVEL` nas estruturas e telas correspondentes.

## Need v1

`Need` não é uma nova observação. Na v1.1 ele é definido como o **percentil de risco Sinesp já calculado por UF**, carregando a mesma confiança `0,50` e disponibilidade `PROXY`.

Isso significa:

- não existe alegação de risco municipal observado;
- todos os municípios de uma mesma UF recebem o mesmo sinal de risco enquanto a fonte oficial não oferecer granularidade mais fina;
- o ajuste por confiança reduz automaticamente o peso efetivo dessa dimensão no score final.

## Score bruto e score ajustado por confiança

O cálculo reutiliza `calculateOpportunityScore`.

- **Raw/Core Score:** média ponderada dos quatro componentes ativos.
- **Confidence Adjusted Score:** Core Score multiplicado pela confiança agregada geométrica.

Dessa forma, uma praça não sobe no ranking apenas porque um proxy incerto tem valor alto.

## Concorrência

A regra anterior de White Space continua válida: `calculateWhiteSpace` só libera o componente quando o município possui `CENSO_COMPLETO`.

Enquanto a pesquisa estiver `PESQUISA_PARCIAL` ou `NAO_PESQUISADO`:

- `competitionPressure` permanece não disponível;
- `whiteSpace` permanece não disponível;
- ausência de concorrente encontrado nunca vira pressão competitiva igual a zero;
- o Core Evidence Score continua calculável porque estes componentes têm peso zero nesta versão.

Quando o censo competitivo evoluir, uma metodologia posterior poderá recolocar White Space no score final sem alterar os dados históricos da v1.1.

## Territórios

Quando não há `territorios.json` publicado, o frontend gera candidatos reprodutíveis a partir dos municípios com Core Evidence Score válido usando o `territoryOptimizer` existente:

- raios: 100, 150, 200, 250, 300 e 400 km;
- distância Haversine;
- contas ICP como massa comercial;
- score municipal ajustado por confiança ponderado pelas contas ICP;
- até 100 candidatos materializados para navegação;
- nenhuma coordenada é inferida quando o município não possui centroide válido.

Um `territorios.json` publicado futuramente continua tendo precedência sobre a derivação client-side.

## Unit economics

Ticket, margem, salário, encargos, win rate, churn e demais premissas continuam sendo entradas próprias do **Simulador Econômico**. Elas não são inventadas para produzir o ranking geográfico.

Por isso `potentialMrr`, `breakEvenContracts` e campos econômicos territoriais podem permanecer `null` até calibração. A prontidão territorial e a autorização econômica são camadas diferentes.

## Significado de `decisionReady`

Na metodologia `national-v1.1-core-evidence`, `decisionReady=true` significa:

> existe evidência nacional suficiente para produzir e ordenar territórios candidatos com score ajustado por confiança.

Não significa:

- censo competitivo completo;
- garantia de ausência de concorrência;
- aprovação automática de contratação;
- ROI aprovado sem premissas econômicas;
- risco municipal observado quando a fonte é somente UF.

## Fontes atualmente materializadas

- IBGE / BCIM: geografia municipal e centroides;
- Receita Federal CNPJ: população ICP por município;
- ANTT RNTRC: transportadores ativos;
- SENATRAN: frota de carga;
- ANTT CIOT Jul/2026: fluxo origem-destino, explicitamente como proxy de MDF-e;
- MJSP Sinesp Jan-Jul/2026: risco em nível UF;
- concorrência: pesquisa parcial, preservada como parcial.

## Critérios para uma v1.2 ou v2

A metodologia deve ser revisada quando houver pelo menos um destes avanços:

1. censo competitivo suficientemente completo e comparável entre praças;
2. fonte oficial de risco com granularidade municipal para os indicadores relevantes;
3. modelo validado de eficiência territorial baseado em tempo/malha viária;
4. calibração dos pesos contra ganhos/perdas reais da Atlas;
5. premissas econômicas padronizadas e aprovadas para cálculo automático de ROI por território.
