# jsqry-cli2

`jsqry` is a small command line tool (similar to [jq](https://github.com/stedolan/jq)) to query JSON using sane DSL.

The purpose of this app is to expose the functionality of [jsqry](https://github.com/jsqry/jsqry) JS library in form of CLI.

Unlike [jsqry-cli](https://github.com/jsqry/jsqry-cli) this one is based on [QuickJS](https://bellard.org/quickjs/) by [Fabrice Bellard](https://bellard.org/).

## Examples

#### query
```
$ echo '[{"name":"John","age":30},
         {"name":"Alice","age":25},
         {"name":"Bob","age":50}]' | jsqry 'name'
[
  "John",
  "Alice",
  "Bob"
]
```

#### first element

```
$ echo '[{"name":"John","age":30},
         {"name":"Alice","age":25},
         {"name":"Bob","age":50}]' | jsqry -1 'name'
"John"
```

#### use as simple JSON pretty-printer

```
$ echo '[{"name":"John","age":30},{"name":"Alice","age":25},{"name":"Bob","age":50}]' | jsqry
[
  {
    "name": "John",
    "age": 30
  },
  {
    "name": "Alice",
    "age": 25
  },
  {
    "name": "Bob",
    "age": 50
  }
]
```

#### something trickier

Filter greater than 2, map adding 100, sort descending, take last 2 elements. 
By combining these features you can build arbitrary complex queries. [Find more on supported DSL](https://jsqry.github.io/).

```
$ echo '[1,2,3,4,5]' | jsqry '[_>2] {_+100} s(-_) [-2:]'
[
  104,
  103
]
```

The output is pretty-printed by default.

#### full JS power

Since `jsqry` bundles the full-fledged [JS engine](https://bellard.org/quickjs/) in under 1 MB executable, the full power of JS is in your hands!

```
$ echo '["HTTP://EXAMPLE.COM/123", 
         "https://www.Google.com/search?q=test", 
         "https://www.YouTube.com/watch?v=_OBlgSz8sSM"]' | jsqry '{ _.match(/:\/\/([^\/]+)\//)[1].toLowerCase() }'
[
  "example.com",
  "www.google.com",
  "www.youtube.com"
]
```  

#### help message

```
$ jsqry
jsqry ver. 0.0.2
Usage: echo $JSON | jsqry 'query'
 -1,--first     return first result element
 -h,--help      print help and exit
 -v,--version   print version and exit
 -as ARG,
 --arg-str ARG  supply string query argument
 -a ARG,
 --arg ARG      supply query argument of any other type
```

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