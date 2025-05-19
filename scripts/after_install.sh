#!/bin/bash

cd /var/www/html/tenant-app

ls -la

cp -arp build/. . && rm -rf build 

systemctl reload nginx