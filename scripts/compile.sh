#!/bin/bash

truffle compile
mkdir -p app/contracts
mkdir -p app/client/src/contracts
cp abis/HelloNft.json app/contracts/HelloNft.json
cp abis/HelloNft.json app/client/src/contracts/HelloNft.json