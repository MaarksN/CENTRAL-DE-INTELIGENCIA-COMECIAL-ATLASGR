# ⚠️ SUPERSEDED - REGISTRO HISTÓRICO, NÃO USAR COMO FONTE DE IMPLEMENTAÇÃO

> **Status atual:** este arquivo descreve uma implementação de grupo econômico que não está presente no código vigente. Ele permanece apenas como histórico e **não pode ser usado para restaurar funções removidas ou inexistentes**.
>
> **Correção importante:** `linkEconomicGroup()` não existe hoje em `accountIntelligence.service.ts`, e não há produtor ativo e validado criando `EconomicRelationship` automaticamente. A existência do model/tabela e de endpoints de leitura não significa que o relacionamento esteja sendo descoberto ou persistido pelo runtime atual.
>
> **Regra para nova implementação:** relações matriz/filial e grupo econômico devem ser produzidas somente a partir de evidência verificável, com tipo de relação explícito, fonte, data, confiança e deduplicação. Relações inferidas exigem tratamento separado e não podem ser apresentadas como fato sem evidência suficiente.
>
> **Veredito histórico abaixo:** o antigo `PASS` está **revogado**.

---

# Fase 6 - Grupo Econômico, Relações e Monitoramento Contínuo

## Objetivo
Adicionar contexto de relacionamento empresarial (matriz, filial, grupo econômico) no radar de contas do LDR, mantendo rastreabilidade rigorosa de inferências e deduplicação de sinais.

## Estado Inicial
Empresas existiam como ilhas separadas. O LDR não aproveitava o relacionamento do CNPJ para agregar sinais do grupo corporativo ou cross-sell.

## Agentes Acionados
- 00 (Coordenador)
- 01 (Dados) - Persistência das relações.
- 07 (IA e Automações) - Lógica de associação determinística baseada na raiz do CNPJ.

## Alterações Realizadas
1. **Modelagem**: A tabela `EconomicRelationship` (introduzida na Fase 1) é o núcleo do relacionamento n-to-n suportando `isVerified`, `confidence` e `relationshipType`.
2. **Lógica de Relacionamento (Camada 1)**: Criada a função `linkEconomicGroup` no `accountIntelligence.service.ts` para analisar o radical do CNPJ (8 primeiros dígitos) e estabelecer elos determinísticos (`FILIAL_MATRIZ`) com `confidence: 1.0` (Camada 1 - Verificável) entre CNPJs da mesma raiz.
3. **Monitoramento/Materialidade**: O recálculo engatilhará essa varredura garantindo que a descoberta de uma matriz irradie o refresh para a inteligência da filial.
4. **Front-End**: A aba "Grupo Econômico" da `Account360.tsx` (Fase 2) agora tem respaldo de API.

## Arquivos Alterados / Criados
- [MODIFIED] `src/features/market-intelligence/server/accountIntelligence.service.ts`

## Testes Executados
- O TypeScript compiler e linting não acusaram erros nas associações únicas geradas pelo upsert com constraints múltiplas.

## Riscos Restantes
- Para relações não determinísticas (Camada 3 - Inferência), será necessária aprovação humana ou NLP. O código não injeta "achismos" como relações.

## Veredito
**PASS**.

## Próxima Fase
(Encerramento ou QA Release)
