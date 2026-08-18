# AGENTS.md — Backups (não deve ser versionado)

## Status
Esta pasta **não deveria conter arquivos versionados no git**. `/AGENTS.md` → "Segurança e higiene" proíbe explicitamente dumps e backups de banco no repositório.

## Achado conhecido
`backups/prospector-*.dump` chegou a ser versionado neste repositório, contendo dump de banco com dado pessoal real. Estado atual (verificado na Sprint 00/Onda 12 — GOV-002): **removido do working tree atual** — `git ls-files` não retorna nenhum `.dump` e esta pasta hoje só contém este `AGENTS.md`; `.gitignore` cobre `backups/*.dump`/`*.sql`/`*.backup`/`*.tar`/`*.tar.gz`/`*.gz` para evitar reincidência. Isso não elimina o risco: **o histórico do git continua recuperável**, o arquivo ainda existe em commits antigos. Reescrever o histórico (`git filter-repo`/BFG) é decisão humana separada, ainda não tomada — ver `/AGENTS.md` → "Segurança e higiene" para o estado completo e as pendências (rotação de credencial embutida, se houver, e a decisão de rewrite).

## Dono da remediação
Agente 01 — Plataforma, Segurança e Dados, em conjunto com o Coordenador para a decisão de reescrever histórico (isso é decisão humana, não automática de agente).

## Regra permanente
Nenhum agente cria, restaura ou versiona arquivo nesta pasta. Backup operacional deve viver fora do repositório de código (storage dedicado, com controle de acesso e retenção próprios) — ver `/AGENTS.md` → "LGPD e dados pessoais".

## Gate mínimo
- confirmar, a cada onda, que nenhum novo arquivo de backup/dump foi adicionado aqui (`git status`/`git diff` no diretório).
