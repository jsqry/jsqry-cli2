# jsqry-cli2

Command-line jsqry (like jq).

Unlike [jsqry-cli](https://github.com/jsqry/jsqry-cli) this one is based on [QuickJS](https://bellard.org/quickjs/) by [Fabrice Bellard](https://bellard.org/).

```bash
$ echo '[{"a":1},{"a":2}]' | jsqry 'a' # query
[
  1,
  2
]

$ echo '[{"a":1},{"a":2}]' | jsqry -1 'a' # first
1
```

The output is pretty-printed by default.

## Install

Sorry, but only Linux x64 is supported at the moment. Hopefully this will improve.

To install or update the tool simply run the command below.

```bash
$ sudo bash -e -c "
wget https://github.com/jsqry/jsqry-cli2/releases/download/v0.0.2/jsqry-linux-amd64 -O/usr/local/bin/jsqry
chmod +x /usr/local/bin/jsqry
echo \"jsqry \$(jsqry -v) installed successfully\" 
"
```