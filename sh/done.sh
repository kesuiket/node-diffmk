#!/bin/sh

for FILE in "$@"
do
  if [ -e ${FILE} ]; then
    echo ${FILE}=
    ls -l ${FILE} | awk '{ print $5; }'
    echo ,
  else
    :
  fi
done
