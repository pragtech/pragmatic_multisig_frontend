import React, { Component } from "react";
import MultisigWallet from "./contracts/MultisigWallet.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    balance: 0,
    authority: 0,
    blockLength: 0,
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      web3.eth.defaultAccount = accounts.first;
      console.log(`accounts ${accounts}`);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MultisigWallet.networks[networkId];
      const instance = new web3.eth.Contract(
        MultisigWallet.abi,
        "0x9E6A314987C1D1277BAA60213Ccfc80d83e0Af1c"
      );
      console.log(instance);
      this.setState(
        { web3, accounts, contract: instance },
        this.getWalletBalance
      );
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  getWalletBalance = async () => {
    const { accounts, contract } = this.state;
    var _balance = await contract.methods.getBalance().call();
    console.log("balance:" + _balance);
    this.setState({ balance: _balance });
  };

  getWalletAuthority = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    var _authority = await contract.methods.walletAuthority().call();
    console.log(_authority);
    this.setState({ authority: _authority });
  };

  maxBlockLength = async (event) => {
    // confirmationsRequired
    event.preventDefault();
    const { accounts, contract } = this.state;
    var _blockLength = await contract.methods.maxBlockLength().call();
    console.log(_blockLength);
    this.setState({ blockLength: _blockLength });
  };

  setNewAuthority = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    const result = await contract.methods
      .transferAuthority(event.target.address.value)
      .send({ from: accounts[0] });
    console.log(result);
  };

  setMaxBlockHight = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    const result = await contract.methods
      .setMaxBlockLength(event.target.blockHight.value)
      .send({ from: accounts[0] });
    console.log(result);
  };

  addNewOwner = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    const result = await contract.methods
      .addOwner(event.target.address.value)
      .send({ from: accounts[0] });
    console.log(result);
  };

  removeOwner = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    const result = await contract.methods
      .removeOwner(event.target.address.value)
      .send({ from: accounts[0] });
    console.log(result);
  };

  submitTransaction = async (event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;
    const result = await contract.methods
      .submitTransaction(event.target.amount.value, event.target.address.value)
      .send({ from: accounts[0] });
    console.log(result);
  };

  confirmTransaction = async (event) => {
    event.preventDefault();
    console.log(`confirming transaction: ${event.target.index.value}`);
    const { accounts, contract } = this.state;
    const result = await contract.methods
      .confirmTransaction(event.target.index.value)
      .send({ from: accounts[0] });
    console.log(result);
  };

  executeTransaction = async (event) => {
    event.preventDefault();
    console.log(
      `executing  transaction: ${event.target.index.value} with amount ${event.target.amount.value}`
    );
    const { accounts, contract } = this.state;
    const result = await contract.methods
      .executeTransaction(event.target.index.value)
      .send({ from: accounts[0], value: event.target.amount.value });
    console.log(result);
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <h3>ConnectedAccount:- {this.state.accounts}</h3>
        <h3>Balance:- {this.state.balance}</h3>
        <hr></hr>
        <h2>Authority</h2>
        <button onClick={this.getWalletAuthority}>Get Authority</button>
        <h3>Authority:- {this.state.authority}</h3>

        <form onSubmit={this.setNewAuthority}>
          <h2>Set New Authority</h2>
          <label>Address: </label>
          <input type="text" id="address" />
          <input type="submit" />
        </form>

        <h2>Max Allowed Block Hight</h2>
        <button onClick={this.maxBlockLength}>Get Confirmations</button>
        <h3>Authority:- {this.state.blockLength}</h3>
        <form onSubmit={this.setMaxBlockHight}>
          <h2>Set New BlockHight</h2>
          <label>BlockHight: </label>
          <input type="number" id="blockHight" />
          <input type="submit" />
        </form>
        <form onSubmit={this.addNewOwner}>
          <h2>Add new Owner to wallet</h2>
          <label>Address: </label>
          <input type="text" id="address" />
          <input type="submit" />
        </form>

        <form onSubmit={this.removeOwner}>
          <h2>Remove Owner from wallet</h2>
          <label>Address: </label>
          <input type="text" id="address" />
          <input type="submit" />
        </form>
        <hr></hr>
        <h2>For Owners</h2>

        <form onSubmit={this.submitTransaction}>
          <h2>Submit Transaction</h2>
          <label>Address To: </label>
          <input type="text" id="address" />
          <label>Amount: </label>
          <input type="number" id="amount" />
          <input type="submit" />
        </form>
        <form onSubmit={this.confirmTransaction}>
          <h2>Confirm Transaction</h2>
          <label>Transaction Index: </label>
          <input type="number" id="index" />
          <input type="submit" />
        </form>
        <form onSubmit={this.executeTransaction}>
          <h2>Execute Transaction</h2>
          <label>Index: </label>
          <input type="number" id="index" />
          <label>Amount: </label>
          <input type="number" id="amount" />
          <input type="submit" />
        </form>
        <br></br>
        <br></br>
        <br></br>
      </div>
    );
  }
}

export default App;
