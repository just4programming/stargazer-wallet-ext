import {render,screen} from "@testing-library/react";
import { Wallet } from "ethers";

const { strict: assert } = require('assert');
const { withFixtures } = require('../helpers');
const CONSTANTS = require('../constants'); 

describe.only('Connect wallet to external site', function () {

  it('should fail to connect only selected wallets to external site', async function () {
    await withFixtures(
      {
        title: this.test.title,
        leaveRunning: false
      },
      async ({ driver }) => {
        await driver.render(SelectAccounts);
        accounts = driver.findElement('#selectAccounts-accountList');
        checkedWallets = driver.findElement('#selectAccounts-checkedWallets');
        console.log(checkedWallets);
        assert.notEqual(accounts,null);
       }
    );
  });

  it('should succeed in connecting only selected wallets to external site', async function () {
    
  });

  
  
});
