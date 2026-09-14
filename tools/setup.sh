#!/bin/sh
# One-time setup after cloning. Git never executes repo code on clone
# (security feature), so hooks need this single explicit opt-in.
set -eu
git rev-parse --show-toplevel >/dev/null
git config core.hooksPath tools/githooks
echo "Git hooks enabled (core.hooksPath=$(git config --get core.hooksPath))."
command -v awk >/dev/null || echo "warning: awk not found; sitemap hook needs it."
