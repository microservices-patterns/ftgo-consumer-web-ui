#!/usr/bin/env bash
set -e

echo "00. Environment diagnostics"

npx envinfo


echo ""
echo ""
echo "10. Ensuring required env variables and directories"

source ./ensure-variables-and-paths.sh
#
#if [[ -z "$JEST_JUNIT_OUTPUT_DIR_PARENT" ]]; then
#    export JEST_JUNIT_OUTPUT_DIR_PARENT=./reports/
#fi
#
#rm -rf "$JEST_JUNIT_OUTPUT_DIR_PARENT"
#mkdir -p "$JEST_JUNIT_OUTPUT_DIR_PARENT"
#
#if [[ -z "$JEST_JUNIT_OUTPUT_DIR" ]]; then
#    export JEST_JUNIT_OUTPUT_DIR=$JEST_JUNIT_OUTPUT_DIR_PARENT/junit/
#    mkdir -p "$JEST_JUNIT_OUTPUT_DIR"
#fi
#
#if [[ -z "$CI_ARTIFACTS_PATH" ]]; then
#    export CI_ARTIFACTS_PATH=$(pwd)/ci-artifacts/
#    mkdir -p "$CI_ARTIFACTS_PATH"
#fi
#mkdir -p "$CI_ARTIFACTS_PATH/npm-logs"


echo ""
echo ""
echo "20. Installing dependencies"

echo "running npm install in $(pwd)"
rm -rf node_modules
rm -f package-lock.json
npm install --no-audit # --loglevel verbose
npm audit fix


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

cp ./junit.xml "$JEST_JUNIT_OUTPUT_DIR/junit_$(date '+%Y%m%d_%H%M').xml" 2>/dev/null || :

echo "Copy NPM logs"
[ -d "$HOME/.npm/_logs" ] && cp -R ~/.npm/_logs/* "$CI_ARTIFACTS_PATH/npm-logs" 2>/dev/null || :
