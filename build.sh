#!/usr/bin/env bash

set -e

#QJS_HOME=~/proj_src/quickjs/
#QJS_HOME=~/soft/quickjs-2020-07-05/
QJS_HOME=~/soft/quickjs-2020-09-06/

if [[ ! -d ./build ]]
then
    mkdir ./build
fi

cd ./build/

#    -fno-json \
#    -fno-module-loader \
#    -fno-regexp \
#    -fno-eval \

echo "Compiling with $($QJS_HOME/qjsc | grep version)"

$QJS_HOME/qjsc \
    -flto \
    -fno-date \
    -fno-proxy \
    -fno-promise \
    -fno-map \
    -fno-typedarray \
    -fno-string-normalize \
    -fno-bigint \
    ../jsqry-cli.js -o jsqry

ls -lh jsqry

cd ..
./tests.sh && echo 'TESTS PASSED' || echo 'TESTS FAILED'

