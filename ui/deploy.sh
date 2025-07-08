#!/bin/bash

set -euxo pipefail

currentDir=$(pwd)
codeDir=$(git rev-parse --show-toplevel)
revision=$(git rev-parse HEAD)
tmp=$(mktemp --directory)

# git config --global user.email "tstibbs@users.noreply.github.com"
# git config --global user.name "Tim Stibbs"
# track gh-pages just to ensure it gets passed down to the secondary repo
# git branch gh-pages origin/gh-pages

cd $tmp
git clone --single-branch --branch=gh-pages --depth=1 file://$codeDir
cd geo-bagging
rm -rf *
cp -R $codeDir/ui/dist/* ./
git add .

if ! git diff-index --quiet HEAD
then
	git commit -m "Deploying $revision"
	git push origin gh-pages

	# cd $currentDir

	# git push origin gh-pages:gh-pages
else
    echo "Skipping commit, as there are no changes."
fi
