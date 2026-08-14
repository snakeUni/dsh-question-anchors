#!/usr/bin/env bash
# Install the dsh question-anchor plugin into the dsh web profile.
# Idempotent: safe to run repeatedly.
set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROFILE="${DSH_PROFILE_DIR:-$HOME/.dsh/profiles/web}"
PACKAGE_NAME="dsh-client-ui-question-anchors"
ROW_ID="ui-question-anchors"
PATCH="$PROFILE/cordis.patch.yml"

if [[ ! -d "$PROFILE" ]]; then
  echo "error: web profile not found at $PROFILE" >&2
  exit 1
fi

# 1. Symlink the package into the profile's node_modules (single source of truth).
NM="$PROFILE/node_modules"
mkdir -p "$NM"
if [[ -L "$NM/$PACKAGE_NAME" ]]; then
  echo "ok: symlink already present: $NM/$PACKAGE_NAME"
elif [[ -e "$NM/$PACKAGE_NAME" ]]; then
  echo "error: $NM/$PACKAGE_NAME exists and is not our symlink; remove it first" >&2
  exit 1
else
  ln -s "$PLUGIN_DIR" "$NM/$PACKAGE_NAME"
  echo "ok: linked $NM/$PACKAGE_NAME -> $PLUGIN_DIR"
fi

# 2. Add the loader row to cordis.patch.yml (idempotent).
if [[ ! -f "$PATCH" ]]; then
  echo "error: $PATCH not found" >&2
  exit 1
fi
if grep -q "id: $ROW_ID" "$PATCH" 2>/dev/null; then
  echo "ok: loader row $ROW_ID already present in $PATCH"
else
  # Replace a bare empty-list file, otherwise append an insert patch entry.
  if grep -Eq '^\s*\[\s*\]\s*$' "$PATCH"; then
    cat > "$PATCH" <<EOF
# dsh question-anchor plugin: a right-side floating panel listing every user
# question in the current conversation; clicking an item scrolls the chat to
# that message (dsh-client-ui-question-anchors).
- insert:
    - id: $ROW_ID
      name: '$PACKAGE_NAME'
EOF
  else
    printf -- '- insert:\n    - id: %s\n      name: %s\n' "$ROW_ID" "'$PACKAGE_NAME'" >> "$PATCH"
  fi
  echo "ok: added loader row $ROW_ID to $PATCH"
fi

echo "done. Restart the dsh web server (the 3080-port GUI) and hard-refresh the page to see the panel."
