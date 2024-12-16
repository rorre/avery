rm -rf docs && bun run build
bunx typedoc
ghp-import docs -p