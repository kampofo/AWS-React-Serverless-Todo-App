# #!/bin/bash

# mkdir -p dist-zips

# for name in createTask getTasks updateTask deleteTask
# do
#   echo "Zipping $name..."
#   cd dist/handlers/tasks
#   zip -r ../../../dist-zips/$name.zip $name.js
#   cd ../../../
#   zip -r dist-zips/$name.zip node_modules package.json
# done
#!/usr/bin/env bash
set -e

mkdir -p dist-zips

# Find every compiled handler JS file two levels below dist/handlers/
find dist/handlers -maxdepth 2 -type f -name '*.js' | while read -r js_path; do
  base_name=$(basename "$js_path" .js)        # e.g. migrate
  zip_path="dist-zips/${base_name}.zip"

  echo "Zipping $base_name…"
  rm -f "$zip_path"

  zip -j "$zip_path" "$js_path"               # put handler at zip root
  zip -r "$zip_path" node_modules package.json
done
