# make a linode
recommended more ram or dedicated ram
# make a directory called /app in root

# get the https certificates from letsencrypt

# dependencies

docker
nodejs
netstat
nginx
python3-certbot-nginx


# ssl certs 
run certbot --nginx, rest is self explanitory 
# copy the fullchain.pem and privkey.pem located in ~/certs to /app/certs
this is automatically done by the github actions


# nginx
refer to the site.conf

# commands to run 
docker build -t my-puppeteer-app .
# builds the app

docker run -it -p 4000:4000 --rm --cap-add=SYS_ADMIN my-puppeteer-app
# starts the app