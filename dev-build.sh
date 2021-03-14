#!/bin/bash

set -euo pipefail

# this script parses ci.yml in a basic way in order to replicate the build that will be done when it gets pushed.

{
echo "set -euxo pipefail"; \
echo "root=\"$(git rev-parse --show-toplevel)\""; \
grep -E '(run\:|working-directory\:)' .github/workflows/ci.yml | \
sed 's/run: //' | \
sed 's/working-directory: /cd /' | \
awk '{$1=$1;print}' | \
tr '\n' '%' | \
sed -E 's#(npm [^%]+)%cd geo-bagging(/[^%]+)?(%|$)#cd $root\2\n\1\n#g' | \
sed 's#%#\n#g' | \
grep -v 'npm ci';
} | bash
