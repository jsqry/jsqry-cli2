# jsqry-cli2

Command-line jsqry (like jq).

Unlike [jsqry-cli](https://github.com/jsqry/jsqry-cli) this one is based on [QuickJS](https://bellard.org/quickjs/) by [Fabrice Bellard](https://bellard.org/).

```bash
$ echo '[{"a":1},{"a":2}]' | jsqry 'a' # query
[1, 2]

$ echo '[{"a":1},{"a":2}]' | jsqry -1 'a' # first
1
```

The output is pretty-printed by default.