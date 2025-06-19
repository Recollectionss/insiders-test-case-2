#!/bin/bash

mkdir -p ./src/shared/keys

openssl genpkey -algorithm RSA -out ./src/shared/keys/private.pem -pkeyopt rsa_keygen_bits:2048

openssl rsa -pubout -in ./src/shared/keys/private.pem -out ./src/shared/keys/public.pem

echo "Keys generated in ./src/shared/keys/"
