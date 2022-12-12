import { Injectable, OnModuleInit } from '@nestjs/common';
import serviceData from '../util/data';
import { Everscale } from './everscale';
import { Hedera } from './hedera';
import { Near } from './near';
import { Solana } from './solana';
import { Stacks } from './stacks';
import { Tezos } from './tezos';
import Web3 from 'web3';

const config = {
  clientConfig: {
    maxReceivedFrameSize: 1000000000,
    maxReceivedMessageSize: 1000000000,
  },
};

@Injectable()
export class Web3ProviderService {
  constructor(
    private readonly everscale: Everscale,
    private readonly hedera: Hedera,
    private readonly near: Near,
    private readonly solana: Solana,
    private readonly stacks: Stacks,
    private readonly tezos: Tezos,
  ) {}

  async getWeb3(chain = 'ethereum', url = null) {
    const supportChain = serviceData.CHAINS[chain] ? chain : 'ethereum';
    const node_url =
      url || serviceData[`${supportChain.toUpperCase()}_NODE_URL`];

    let web3;
    switch (supportChain) {
      case 'everscale': {
        web3 = { eth: this.everscale };
        web3.nodeUrl = node_url;
        break;
      }
      case 'hedera': {
        web3 = { eth: this.hedera };
        break;
      }
      case 'near': {
        web3 = { eth: this.near };
        break;
      }
      case 'solana': {
        web3 = { eth: this.solana };
        break;
      }
      case 'stacks': {
        web3 = { eth: this.stacks };
        break;
      }
      case 'tezos': {
        web3 = { eth: this.tezos };
        break;
      }
      default: {
        if (node_url.startsWith('ws')) {
          web3 = new Web3(
            new Web3.providers.WebsocketProvider(node_url, config),
          );
        } else {
          web3 = new Web3(new Web3.providers.HttpProvider(node_url));
        }
      }
    }
    return web3;
  }
}