echo "Pocetak deploy...."
rsync -avP build/ dm@donosimo.net:/var/www/donosimo015/vozac
echo "Kraj deploy. :)"