#!/bin/sh

for FILE in "$@"
do
  if [ ! -e $FILE ]; then
    mkdir ${FILE}
  else
    :
  fi
done
