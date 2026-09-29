# Publish on GitHub Pages

The site requires no backend, API keys, npm packages, or custom domain. The workflow
rebuilds from the authored inputs and archived evidence, checks JavaScript syntax,
runs the scoring/data checks, and uploads only the two standalone HTML pages plus
`.nojekyll`. Relative links work beneath a repository path such as `/compass/`.

Pushes to `main` deploy after checks pass. Pull requests build and check without
deploying. You can also run **Build and deploy GitHub Pages** manually in Actions.
The workflow uses GitHub's automatic token; no deployment secret is required.

## First publication

Run from this project directory. A local `main` branch and initial commit have
already been prepared. These commands create a **public** repository named
`compass` under the account you authenticate with. Use another name if that
repository already exists; do not overwrite an unrelated repository.

The environment token and saved GitHub login were invalid during setup. Clear the
overriding token variables in this terminal and authenticate again:

```sh
unset GH_TOKEN GITHUB_TOKEN
gh auth login --hostname github.com --git-protocol https --web --scopes repo,workflow
gh auth setup-git
gh repo create compass --public --source=. --remote=origin --push
gh api --method POST 'repos/{owner}/{repo}/pages' -f build_type=workflow
gh workflow run pages.yml --ref main
```

The `{owner}` and `{repo}` placeholders are expanded by `gh` from the local remote.

The first push might start a run before Pages is enabled. The explicit workflow
run above starts another after setup. If Pages was already enabled, use
`gh api --method PUT 'repos/{owner}/{repo}/pages' -f build_type=workflow` instead of
POST. You can also choose **Settings → Pages → Build and deployment → Source →
GitHub Actions** in the repository.

Follow deployment and retrieve the URL:

```sh
gh run list --workflow pages.yml --limit 3
gh run watch
gh api 'repos/{owner}/{repo}/pages' --jq .html_url
```

Normally the URL will be `https://YOUR_ACCOUNT.github.io/compass/`. The deployment
job also links to the published site. Language-specific links can append
`?lang=ru`, `?lang=he`, or `?lang=en`; otherwise the browser preference is used.

## Subsequent updates

Edit source files, then build locally with Python 3 and Node.js 24 or newer:

```sh
python3 scripts/build_site.py
git add .
git commit -m "Update compass"
git push
```

The workflow rebuilds independently, so generated HTML cannot silently become
stale in the deployed site. `_site/` is ignored by Git. To preview the exact
artifact locally:

```sh
python3 -m http.server 8766 --bind 127.0.0.1 --directory _site
```

Open `http://127.0.0.1:8766/`. To roll back a deployed change, revert its commit and
push the revert to `main`.

Workflow reference: [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
