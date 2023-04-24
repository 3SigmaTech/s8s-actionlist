
nvm use 18
npm run deploy
npm pack --pack-destination ~/Repos/
echo "Updating package in S8S API Repo"
cd ../s8s-api/
npm update s8s-actionlist
echo "Broadcasting javascript and css file update"
echo "" >> ./vendor/vendor.ts
echo "" >> ./public/style/styles.scss