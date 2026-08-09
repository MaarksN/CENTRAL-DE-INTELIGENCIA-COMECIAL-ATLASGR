# AGENTS.md — Backups (não deve ser versionado)

## Status
Esta pasta **não deveria conter arquivos versionados no git**. `/AGENTS.md` → "Segurança e higiene" proíbe explicitamente dumps e backups de banco no repositório.

## Achado conhecido
`backups/prospector-*.dump` está atualmente versionado (`git ls-files` confirma rastreamento), contendo dump de banco com dado pessoal real. Ver `/AGENTS.md` → "Segurança e higiene" para o plano de remediação recomendado (remover do próximo commit, avaliar rotação de credencial, decidir sobre reescrita de histórico com o dono do repositório).

## Dono da remediação
Agente 01 — Plataforma, Segurança e Dados, em conjunto com o Coordenador para a decisão de reescrever histórico (isso é decisão humana, não automática de agente).

## Regra permanente
Nenhum agente cria, restaura ou versiona arquivo nesta pasta. Backup operacional deve viver fora do repositório de código (storage dedicado, com controle de acesso e retenção próprios) — ver `/AGENTS.md` → "LGPD e dados pessoais".

## Gate mínimo
- confirmar, a cada onda, que nenhum novo arquivo de backup/dump foi adicionado aqui (`git status`/`git diff` no diretório).
