rm -rf docs && bun run build
bunx typedoc
cd demo
rm -rf dist && bun run build
cd ..

cp -r demo/dist docs/demo
ghp-import docs -p