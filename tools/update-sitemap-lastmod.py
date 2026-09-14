#!/usr/bin/env python3
"""Refresh sitemap.xml <lastmod> to today (UTC) for pages with changes.

Reads sitemap.xml in the repo root and stamps today's date on the <url>
entry of each page that changed. Only writes the file when a date
actually changes, so it is a no-op otherwise.

Usage:
    update-sitemap-lastmod.py [--staged]

    --staged   look at staged changes (used by the pre-commit hook)
    default    look at working tree + staged changes vs HEAD (manual runs)
"""
import re
import subprocess
import sys
from datetime import date, timezone

PAGE_URLS = {
    'index.html': 'https://dgreenniravakuta.com/',
    'id/index.html': 'https://dgreenniravakuta.com/id/',
}


def changed_files(staged):
    if staged:
        cmd = ['git', 'diff', '--cached', '--name-only']
    else:
        cmd = ['git', 'diff', '--name-only', 'HEAD']
    out = subprocess.run(cmd, capture_output=True, text=True)
    if out.returncode != 0:
        # No HEAD yet (fresh repo) — treat every page as changed.
        return set(PAGE_URLS)
    return set(out.stdout.split())


def main():
    staged = '--staged' in sys.argv[1:]
    changed = changed_files(staged)
    today = date.today().isoformat()  # local date is fine; CI-agnostic

    with open('sitemap.xml', encoding='utf-8') as f:
        sitemap = f.read()

    updated = []
    for path, url in PAGE_URLS.items():
        if path not in changed:
            continue
        pattern = re.compile(
            r'(<loc>' + re.escape(url) + r'</loc>\s*<lastmod>)[^<]*?(</lastmod>)'
        )
        sitemap, n = pattern.subn(r'\g<1>' + today + r'\g<2>', sitemap)
        if n:
            updated.append(url)

    if updated:
        with open('sitemap.xml', 'w', encoding='utf-8') as f:
            f.write(sitemap)
        print('sitemap lastmod -> %s for: %s' % (today, ', '.join(updated)))
    else:
        print('sitemap lastmod: nothing to update.')


if __name__ == '__main__':
    main()
