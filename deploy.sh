#!/bin/bash

clear;

find . ! -name CNAME ! -name deploy.sh  -maxdepth 1 -type f -exec rm -rf "{}" \;
find . ! -name .git !  -name portfolio  -maxdepth 1 -type d -exec rm -rf "{}" \;

git clone git@github.com:vanillabeach/jpholt.dev.git

cd jpholt.dev

npm install
npm run build

cd ../

mv jpholt.dev/build/** .

rm -rf jpholt.dev
