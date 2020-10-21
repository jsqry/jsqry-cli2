#!/usr/bin/env bash

set -e

QJS_VERSION="2020-09-06"

mydir=$(
  cd "$(dirname $0)"
  pwd
)

cd "$mydir"

QJS_HOME="$mydir/soft/quickjs-$QJS_VERSION"

if [ ! -d "./soft" ]; then
  mkdir "./soft"
fi

if [ ! -f "$QJS_HOME/qjsc" ]; then
  echo
  echo "Fetching QJS..."
  echo

  cd "./soft"

  QJS=quickjs-$QJS_VERSION
  wget https://bellard.org/quickjs/$QJS.tar.xz
  tar xvf ./$QJS.tar.xz
  rm ./$QJS.tar.xz

  echo
  echo "Compile QJSC..."
  echo

  cd "./$QJS"

  make qjsc libquickjs.lto.a
fi

cd "$mydir"

if [[ ! -d ./build ]]; then
  mkdir ./build
fi

cd ./build/

#    -fno-json \
#    -fno-module-loader \
#    -fno-regexp \
#    -fno-eval \

echo
echo "Compiling with $($QJS_HOME/qjsc | grep version)..."
echo

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
./tests.sh
