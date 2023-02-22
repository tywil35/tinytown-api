npx tsc --outDir ./build/ --project ./ && \
cp -r ./src/mysql/migration/script ./build/mysql/migration && \
cp -r ./src/gmailer/templates ./build/gmailer
mkdir api
cp -r ./build ./api
cp package.json ./api
cp .env.local.prod ./api/.env
tar -czf api.tar.gz ./api/.
scp api.tar.gz tinytown@api.tinytown.online:/home/tinytown
#ssh tinytown@api.tinytown.online /home/tinytown/shop/start_api.sh
rm -R api
rm api.tar.gz