#!/bin/bash

truffle compile
mkdir -p app/contracts
mkdir -p app/client/src/contracts
cp build/contracts/Color.json app/contracts/Color.json
cp build/contracts/Color.json app/client/src/contracts/Color.json