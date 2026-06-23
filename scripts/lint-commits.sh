#!/bin/bash

# This script checks commits in the configured range for compliance with the
# commit message format.

set -euo pipefail

# Check if the repository is shallow.
IS_SHALLOW=$(git rev-parse --is-shallow-repository)

# If the repository is shallow, fetch all commits.
if [ "$IS_SHALLOW" = "true" ]; then
  echo "Repository is shallow. Fetching all commits..."
  git fetch --unshallow
fi

# Allow CI to lint only the commits introduced by a PR.
COMMITLINT_FROM_REF=${COMMITLINT_FROM_REF:-}
COMMITLINT_TO_REF=${COMMITLINT_TO_REF:-HEAD}

if [ -n "$COMMITLINT_FROM_REF" ]; then
  FROM_REF="$COMMITLINT_FROM_REF"
  NUMBER_OF_COMMITS=$(git rev-list --count "$FROM_REF..$COMMITLINT_TO_REF")
else
  # Fall back to linting the current branch history when no explicit base is provided.
  FROM_REF=$(git rev-list --max-parents=0 "$COMMITLINT_TO_REF")
  NUMBER_OF_COMMITS=$(git rev-list --count "$COMMITLINT_TO_REF")
fi

echo "Linting $NUMBER_OF_COMMITS commits..."

if [ "$NUMBER_OF_COMMITS" -eq 0 ]; then
  echo "No commits to lint."
  exit 0
fi

# Run commitlint for the selected range.
echo "Running Commitlint from $FROM_REF to $COMMITLINT_TO_REF..."
pnpm exec commitlint --from="$FROM_REF" --to="$COMMITLINT_TO_REF"
echo "All commit messages are valid."
