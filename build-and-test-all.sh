#!/usr/bin/env bash
set -e

echo "00. Environment diagnostics"

npx envinfo


echo ""
echo ""
echo "10. Ensuring required env variables and directories"

source ./ensure-variables-and-paths.sh


echo ""
echo ""
echo "20. Installing dependencies"

echo "running npm install in $(pwd)"
rm -rf node_modules
npm ci # --loglevel verbose


echo ""
echo ""
echo "30. Running tests"

npm run test


echo ""
echo ""
echo "40. Building the site"

npm run build


echo ""
echo ""
echo "50. Archiving and copying the resulted built files"

tar -czvf "$CI_ARTIFACTS_PATH/build_$(date '+%Y%m%d_%H%M').tar.gz" build
tar -czvf "$CI_ARTIFACTS_PATH/coverage_$(date '+%Y%m%d_%H%M').tar.gz" "$JEST_COVERAGE_OUTPUT_DIR"

cp ./junit.xml "$JEST_JUNIT_OUTPUT_DIR/junit_$(date '+%Y%m%d_%H%M').xml" 2>/dev/null || :

echo "Copy NPM logs"
[ -d "$HOME/.npm/_logs" ] && cp -R ~/.npm/_logs/* "$CI_ARTIFACTS_PATH/npm-logs" 2>/dev/null || :
