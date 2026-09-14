#!/bin/sh
# Refresh sitemap.xml <lastmod> to today (UTC) for pages with changes.
# Only rewrites the file when a date actually changes (silent otherwise).
#
# Usage: update-sitemap-lastmod.sh [--staged]
#   --staged   look at staged changes (used by the pre-commit hook)
#   default    look at working tree + staged changes vs HEAD (manual runs)
set -eu

TODAY=$(date -u +%F)

if [ "${1:-}" = "--staged" ]; then
    CHANGED=$(git diff --cached --name-only)
else
    CHANGED=$(git diff --name-only HEAD 2>/dev/null || printf 'index.html\nid/index.html\n')
fi

needs_update() {
    printf '%s\n' "$CHANGED" | grep -qx "$1"
}

stamp_url() {
    # $1 = page path (change check), $2 = sitemap <loc> URL
    needs_update "$1" || return 0
    awk -v url="$2" -v today="$TODAY" '
        index($0, "<loc>" url "</loc>") { inblock = 1 }
        inblock && /<lastmod>/ {
            sub(/<lastmod>[^<]*<\/lastmod>/, "<lastmod>" today "</lastmod>")
            inblock = 0
        }
        { print }
    ' sitemap.xml > sitemap.xml.tmp
    if cmp -s sitemap.xml.tmp sitemap.xml; then
        rm sitemap.xml.tmp
    else
        mv sitemap.xml.tmp sitemap.xml
        echo "sitemap lastmod -> $TODAY for: $2"
    fi
}

stamp_url "index.html" "https://dgreenniravakuta.com/"
stamp_url "id/index.html" "https://dgreenniravakuta.com/id/"
