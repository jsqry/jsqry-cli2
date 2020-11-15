#!/usr/bin/env bash

# Uses https://github.com/adolfopa/tush

mydir=$(
  cd "$(dirname $0)"
  pwd
)

export PATH=$mydir/build:$PATH:$mydir/soft/tush/bin/

cd "$mydir"

if [ ! -d "./soft" ]; then
  mkdir "./soft"
fi

if [ ! -d "./soft/tush" ]; then
  echo
  echo "Fetching tush..."
  echo

  cd "./soft"
  wget https://github.com/adolfopa/tush/archive/master.zip -O./tush.zip
  unzip ./tush.zip
  rm ./tush.zip
  mv tush-master tush
  cd "$mydir"
fi

#which jsqry
#jsqry -v

tush-check tests.tush && echo 'TESTS PASSED' || (
  echo '!!! TESTS FAILED !!!'
  exit 1
)
