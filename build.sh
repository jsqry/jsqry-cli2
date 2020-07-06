#!/usr/bin/env bash

set -e

QJS_HOME=~/proj_src/quickjs/

if [[ ! -d ./build ]]
then
    mkdir ./build
fi

cd ./build/

#    -fno-json \
#    -fno-module-loader \
#    -fno-regexp \
#    -fno-eval \

$QJS_HOME/qjsc \
    -flto \
    -fno-date \
    -fno-proxy \
    -fno-promise \
    -fno-bigint \
    -fno-map \
    -fno-typedarray \
    -fno-string-normalize \
    ../jsqry-cli.js -o jsqry

ls -lh jsqry

