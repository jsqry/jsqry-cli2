#!/usr/bin/env bash

# Uses https://github.com/adolfopa/tush

mydir=$(cd "$(dirname $0)" ; pwd)

export PATH=$mydir/build:$PATH:~/proj_src/tush/bin/

echo "PATH 2222 $PATH"

#which jsqry
#jsqry -v

tush-check tests.tush