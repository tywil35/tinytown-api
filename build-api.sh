npx tsc --outDir ./build/ --project ./ && \
cp -r ./src/mysql/migration/script ./build/mysql/migration && \
cp -r ./src/gmailer/templates ./build/gmailer