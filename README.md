[![MythXBadge](https://badgen.net/https/api.mythx.io/v1/projects/c28437af-c149-4c07-9783-4358782329ed/badge/data?cache=300&icon=https://raw.githubusercontent.com/ConsenSys/mythx-github-badge/main/logo_white.svg)](https://docs.mythx.io/dashboard/github-badges)

## Introduction
Brahma creates and manages a host of novel DeFi components and strategies by abstracting complexity and making DeFi accessible to the masses. Brahma's research-backed, experimental approach strives to create an "Investverse" starting with generating a sustained yield on top of your crypto assets. We unlock new portals for liquidity by paving way for autonomous and algorithm-led architectures. Our first product is Aastra. Aastra runs strategies to earn yield using your idle stables. All instruments on Aastra fuse structured strategies with degeneracy, to come up with innovative ways to generate sustainable yields.
Aastra is built for
- Users seeking to generate yield and
- Liquidity providers use their assets more efficiently.


## Dapp
- [brahma.fi](https://www.brahma.fi/)


## Community
[![Discord](https://img.shields.io/discord/413890591840272394.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discord.gg/kdM8myJv)
[![Twitter Follow](https://img.shields.io/twitter/follow/synthetix_io.svg?label=synthetix_io&style=social)](https://twitter.com/Brahmafi)

## Repo Guide
This repository contains the core smart contracts for the Aastra Vaults.
In order to deploy this code to a local testnet, you should clone the repository. 
- Compiling Contracts `npx hardhat compile` 
- Testing Contracts `npx hardhat test` 
- Generating Coverage Report `npx hardhat coverage --testfiles "test/tests.js" --solcoverjs ./solcover.js` 
- Deploying Contracts `npx hardhat run scripts/deploy.js`
- Generating Docs `npx solidity-docgen -i contracts/interfaces -o docs -t docs --solc-module solc-0.7.5`

## Current Deployment
Factory: [0xBAD59D2BA9A532242F1287DeaBc4227E8150D074](https://etherscan.io/address/0xBAD59D2BA9A532242F1287DeaBc4227E8150D074)
Router: [0x34511BE0a5eB24183B077682cBec5c7a9C9c5ADb](https://etherscan.io/address/0x34511BE0a5eB24183B077682cBec5c7a9C9c5ADb)
ETH-PUT-Vault: [0xc10d2E42dE16719523aAA9277d1b9290aA6c3Ad5](https://etherscan.io/address/0xc10d2E42dE16719523aAA9277d1b9290aA6c3Ad5)
