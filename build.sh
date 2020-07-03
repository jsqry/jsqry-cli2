#!/usr/bin/env bash

QJS_HOME=~/proj_src/quickjs/

if [[ ! -d ./build ]]
then
    mkdir ./build
fi

cd ./build/

$QJS_HOME/qjsc \
    -flto \
    -fno-date \
    -fno-eval \
    -fno-string-normalize \
    -fno-regexp \
    -fno-json \
    -fno-proxy \
    -fno-map \
    -fno-typedarray \
    -fno-promise \
    -fno-module-loader \
    -fno-bigint \
    ../jsqry-cli.js -o jsqry

ls -lh jsqry

