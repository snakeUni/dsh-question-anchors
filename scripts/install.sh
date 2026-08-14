#!/usr/bin/env bash
# Install the dsh question-anchor plugin into the dsh web profile.
# Idempotent: safe to run repeatedly.
set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROFILE="${DSH_PROFILE_DIR:-$HOME/.dsh/profiles/web}"
PACKAGE_NAME="@dsh-client/ui-question-anchors"
# Legacy pre-rename package name; removed when it is our own symlink.
LEGACY_NAME="dsh-client-ui-question-anchors"
ROW_ID="ui-question-anchors"
PATCH="$PROFILE/cordis.patch.yml"

if [[ ! -d "$PROFILE" ]]; then
  echo "error: web profile not found at $PROFILE" >&2
  exit 1
fi

# 1. Symlink the package into the profile's node_modules (single source of truth).
#    Scoped names live at node_modules/<scope>/<name>.
NM="$PROFILE/node_modules"
mkdir -p "$NM"
if [[ -L "$NM/$LEGACY_NAME" && "$(readlink "$NM/$LEGACY_NAME")" == "$PLUGIN_DIR" ]]; then
  rm "$NM/$LEGACY_NAME"
  echo "ok: removed legacy symlink $NM/$LEGACY_NAME"
fi
SCOPE_DIR="$(dirname "$PACKAGE_NAME")"
if [[ "$SCOPE_DIR" != "." ]]; then
  mkdir -p "$NM/$SCOPE_DIR"
fi
LINK_DIR="$NM/$PACKAGE_NAME"
if [[ -L "$LINK_DIR" ]]; then
  echo "ok: symlink already present: $LINK_DIR"
elif [[ -e "$LINK_DIR" ]]; then
  echo "error: $LINK_DIR exists and is not our symlink; remove it first" >&2
  exit 1
else
  ln -s "$PLUGIN_DIR" "$LINK_DIR"
  echo "ok: linked $LINK_DIR -> $PLUGIN_DIR"
fi

# 2. Add the loader row to cordis.patch.yml (idempotent).
if [[ ! -f "$PATCH" ]]; then
  echo "error: $PATCH not found" >&2
  exit 1
fi
if grep -q "id: $ROW_ID" "$PATCH" 2>/dev/null; then
  # Row exists: make sure its name matches the current package name
  # (migrates rows written under the legacy pre-scope name).
  if grep -q "name: '$LEGACY_NAME'" "$PATCH" 2>/dev/null; then
    sed -i.bak "s|name: '$LEGACY_NAME'|name: '$PACKAGE_NAME'|" "$PATCH"
    rm -f "$PATCH.bak"
    echo "ok: updated loader row name to $PACKAGE_NAME in $PATCH"
  else
    echo "ok: loader row $ROW_ID already present in $PATCH"
  fi
else
  # Replace a bare empty-list file, otherwise append an insert patch entry.
  if grep -Eq '^\s*\[\s*\]\s*$' "$PATCH"; then
    cat > "$PATCH" <<EOF
# dsh question-anchor plugin: a right-side floating panel listing every user
# question in the current conversation; clicking an item scrolls the chat to
# that message ($PACKAGE_NAME).
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
