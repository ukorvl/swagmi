#!/bin/bash

set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
# shellcheck disable=SC1091 # common.sh path is resolved dynamically from SCRIPT_DIR.
source "$SCRIPT_DIR/common.sh"

check_command jq
check_command pnpm
check_command npm
check_command node

# Ensure packaged outputs exist when this script is invoked directly on a clean checkout.
node "$SCRIPT_DIR/prebuild-lib-if-needed.mjs"

tmp_dir="$(mktemp -d)"
cleanup() {
  rm -rf "$tmp_dir"
}
trap cleanup EXIT

tarball_path="$(
  pnpm -C "$REPO_ROOT/$LIB_PATH" pack --pack-destination "$tmp_dir" --json \
    | jq -r 'if type == "array" then .[0].filename else .filename end'
)"

if [[ -z "$tarball_path" || "$tarball_path" == "null" ]]; then
  echo "Error: No tarball filename in pnpm pack --json output." >&2
  exit 1
fi

if [[ ! -f "$tarball_path" ]]; then
  echo "Error: Packed tarball not found at '$tarball_path'." >&2
  exit 1
fi

package_name="$(jq -r '.name // empty' "$LIB_PACKAGE_JSON")"
if [[ -z "$package_name" ]]; then
  echo "Error: Missing package name in '$LIB_PACKAGE_JSON'." >&2
  exit 1
fi

consumer_dir="$tmp_dir/consumer"
npm_cache_dir="$tmp_dir/.npm-cache"
mkdir -p "$consumer_dir" "$npm_cache_dir"

run_npm_clean() {
  local -a cmd=(env)

  while IFS='=' read -r key _; do
    if [[ "$key" == npm_config_* ]]; then
      cmd+=("-u" "$key")
    fi
  done < <(env)

  cmd+=("npm_config_cache=$npm_cache_dir" npm "$@")
  "${cmd[@]}"
}

pushd "$consumer_dir" > /dev/null

run_npm_clean init -y > /dev/null
run_npm_clean install "$tarball_path" > /dev/null
node --input-type=module -e "await import(process.argv[1]);" "$package_name"

popd > /dev/null

echo "Tarball smoke test passed for $package_name"
