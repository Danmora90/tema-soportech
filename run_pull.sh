#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm install 20
nvm use 20
npm install -g @shopify/cli@latest
shopify theme pull --store soportech-p.myshopify.com --live --nodelete
