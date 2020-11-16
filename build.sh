#!/usr/bin/env bash

set -e

QJS_VERSION="2020-11-08"

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

  make qjsc libquickjs.a libquickjs.lto.a
fi

cd "$mydir"

if [[ ! -d ./build ]]; then
  mkdir ./build
fi

cd ./build/

echo
echo "Compiling with $($QJS_HOME/qjsc | grep version)..."
echo

if [[ -z "$TESTONLY" ]]; then
  echo 'Compiling release build...'

  #    -fno-json \
  #    -fno-module-loader \
  #    -fno-regexp \
  #    -fno-eval \
  $QJS_HOME/qjsc \
    -flto \
    -fno-date \
    -fno-proxy \
    -fno-promise \
    -fno-map \
    -fno-typedarray \
    -fno-string-normalize \
    -fno-bigint \
    -o jsqry ../jsqry-cli.js
else
  echo 'Compiling test build...'

  $QJS_HOME/qjsc -o jsqry ../jsqry-cli.js
fi

ls -lh jsqry

cd ..
./tests.sh
