#!/usr/bin/env bash

set -e

QJS_HOME=~/soft/quickjs-2020-07-05/

if [[ ! -d ./build ]]
then
    mkdir ./build
fi

cd ./build/

#    -fno-json \
#    -fno-module-loader \
#    -fno-regexp \
#    -fno-eval \

# TODO: adding this setting causes https://github.com/jsqry/jsqry-cli2/issues/1
#     -fno-bigint \

$QJS_HOME/qjsc \
    -flto \
    -fno-date \
    -fno-proxy \
    -fno-promise \
    -fno-map \
    -fno-typedarray \
    -fno-string-normalize \
    ../jsqry-cli.js -o jsqry

ls -lh jsqry

