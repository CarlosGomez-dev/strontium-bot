# Strontium-bot

Discord bot for the Software Rookies discord server.<br>
Named `strontium` after the group abreviation `SR`.

## How it works

Bot functionality is divided into folders:

- `commands` for all bot commands executed via server chat.
- `events` for all events listeners.
- `img` for commands that send image attachments.
- `models` for the sequelize model that generates the messages sqlite database, used for `top` and `rank` commands.
- `util` for the console log colors.

Bot dynamically loads everything inside `commands` and `events` folders on boot, and can be reloaded using the corresponding dev commands. <br>

## Development

There are a few helpful commands when testing:

- `reload`/`rlall` reload a single command, or all commands. Useful to make changes to a command and reload it without restarting the bot.
- `revent`/`rvall` same as reload, but for events.
- `test` can be used a sandbox to test functions/expressions. Simply make your edits, save the file, and reload it.

## Contribute

Feel free to open an issue to request new commands. <br>
Pull Request are also welcome.
