#!/bin/bash

set -euxo pipefail

currentDir=$(pwd)
codeDir=$(git rev-parse --show-toplevel)
revision=$(git rev-parse HEAD)
tmp=$(mktemp --directory)

cd $tmp
git init
git remote add origin $codeDir
git fetch
git checkout gh-pages
rm -rf *
cp -R $codeDir/ui/dist/* ./
git add .

# fix up data sources not in the built package
git checkout HEAD -- bundles/nt/*.json
git checkout HEAD -- bundles/nt/*.json.meta
git checkout HEAD -- bundles/trigs/*.json
git checkout HEAD -- bundles/trigs/*.json.meta

git commit -m "Deploying $revision"
git push origin gh-pages

cd $currentDir

git push origin gh-pages:gh-pages
