# jsqry-cli2

`jsqry` is a small command line tool to query JSON using [sane DSL](https://jsqry.github.io/) (similar to [jq](https://github.com/stedolan/jq)).

The purpose of this app is to expose the functionality of [jsqry](https://github.com/jsqry/jsqry) JS library in form of CLI.

Unlike [jsqry-cli](https://github.com/jsqry/jsqry-cli) this one is based on [QuickJS](https://bellard.org/quickjs/) by [Fabrice Bellard](https://bellard.org/).

```bash
$ echo '[{"a":1},{"a":2}]' | jsqry 'a' # query
[
  1,
  2
]

$ echo '[{"a":1},{"a":2}]' | jsqry -1 'a' # first
1

$ echo '[{"a":1},{"a":2}]' | jsqry # use as simple JSON pretty-printer
[
  {
    "a": 1
  },
  {
    "a": 2
  }
]

$ jsqry
jsqry ver. 0.0.2
Usage: echo $JSON | jsqry 'query'
 -1,--first     return first result element
 -h,--help      print help and exit
 -v,--version   print version and exit
```

The output is pretty-printed by default.

## Compare to jq

https://gist.github.com/xonixx/d6066e83ec0773df248141440b18e8e4

## Install

Current version: [0.0.2](https://github.com/jsqry/jsqry-cli2/releases/tag/v0.0.2).

Sorry, but only Linux x64 is supported at the moment. Hopefully this will improve.

To install or update the tool simply run the command below.

```bash
$ sudo bash -e -c "
wget https://github.com/jsqry/jsqry-cli2/releases/download/v0.0.2/jsqry-linux-amd64 -O/usr/local/bin/jsqry
chmod +x /usr/local/bin/jsqry
echo \"jsqry \$(jsqry -v) installed successfully\" 
"
```