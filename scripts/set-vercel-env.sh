#!/usr/bin/env bash
# Copies the production settings from .env to the Vercel project and removes
# variables the app no longer reads. Values are never printed.
set -euo pipefail
cd "$(dirname "$0")/.."

vercel() { npx -y vercel@latest "$@"; }
value() { grep -E "^$1=" .env | head -1 | cut -d= -f2- | tr -d '\n'; }

for name in DATABASE_URL LLM_API_KEY LLM_BASE_URL LLM_MODEL; do
  if [ -z "$(value "$name")" ]; then echo "skip $name (empty in .env)"; continue; fi
  vercel env rm "$name" production -y >/dev/null 2>&1 || true
  value "$name" | vercel env add "$name" production >/dev/null
  echo "set $name"
done

for name in PRIVATE_KEY CAP_API_KEY CAP_SERVICE_ID CAP_AGENT_ID CAP_ENV USE_DEMO_DATA USE_MOCK_CAP; do
  for target in production preview; do
    vercel env rm "$name" "$target" -y >/dev/null 2>&1 || true
  done
  echo "removed $name"
done

echo "Done. Vercel production now has:"
vercel env ls production 2>/dev/null | grep -E "DATABASE_URL|LLM_|NEXT_PUBLIC|BASE_SEPOLIA" || true
