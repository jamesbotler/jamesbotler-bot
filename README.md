[![Build](https://github.com/ralphschuler/jamesbotler/actions/workflows/publish.yml/badge.svg)](https://github.com/ralphschuler/jamesbotler/actions/workflows/publish.yml)
[![Anchore Analysis](https://github.com/ralphschuler/jamesbotler/actions/workflows/anchore-analysis.yml/badge.svg)](https://github.com/ralphschuler/jamesbotler/actions/workflows/anchore-analysis.yml)
[![Quality Analysis](https://github.com/ralphschuler/jamesbotler/actions/workflows/quality-analysis.yml/badge.svg)](https://github.com/ralphschuler/jamesbotler/actions/workflows/quality-analysis.yml)

## James Botler

Goal of this project is to create a discord bot free personal discord bot.

[Invite slash Integration](https://discord.com/oauth2/authorize?client_id=814435537888346112&scope=applications.commands&permissions=2147483647)

[Invite Bot Integration](https://discord.com/oauth2/authorize?client_id=814435537888346112&scope=bot&permissions=2147483647)

### Environment Variables

```.env

SALT=<a strong random key>
TRANSLATION_API=<at the moment this is kept "private">
DISCORD_TOKEN=<the discord bot token>
SENTRY_DSN=<sentry dsn for error tracking>
WITAI_TOKEN_EN=<token for english witai api>

```
