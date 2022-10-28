import { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import truncateEthAddress from "truncate-eth-address";
import { NFTCONTRACT, LOCKCONTRACT, MININGCONTRACT } from "../config/config";
import LOCKABI from '../config/LOCKABI.json';
import MININGABI from '../config/MININGABI.json';
import NFTABI from '../config/NFTABI.json';

export const WalletConnectContext = createContext();

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        80001: 'https://matic-mumbai.chainstacklabs.com'
      },
      chainId: 80001
    }
  }
}

export const ConnectWalletProvider = ({ children }) => {
  const [addr, setAddr] = useState(null);
  const [web3Modal, setWeb3Modal] = useState({});
  const [account, setAccount] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [lockContract, setLockContract] = useState(null);
  const [miningContract, setMiningContract] = useState(null);
  const [loading, isLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(true);
  const [mineBal, setMineBal] = useState(0);
  const [users, setUsers] = useState(0);
  const [cowR, setCowR] = useState(0);
  const [rate, setRate] = useState(0);
  const [unlockedNFTs, setUnlockedNFTs] = useState([]);
  const [walletNFTs, setWalletNFTs] = useState([]);
  const [lockedNFTs, setLockedNFTs] = useState([]);

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('WalletConnected') === ('true')) {
        try{ 
            if (typeof window !== "undefined") {
              const web3Modal = new Web3Modal({
                network: "mumbai", // optional
                cacheProvider: true, // optional
                providerOptions, // required
                theme: "dark",
              });
            setWeb3Modal(web3Modal)
              await ConnectWallet()
            localStorage.setItem('WalletConnected', true)
          }

        } catch(ex) {
          console.log(ex)
        }
      }
    }
    connectWalletOnPageLoad()
  },[])

  const isConnected = () => {
    account != null ? true : false;
  };

  const ConnectWallet = async () => {
    if (typeof window !== "undefined") {
      web3Modal = new Web3Modal({
        network: "mumbai", // optional
        cacheProvider: true, // optional
        providerOptions, // required
        theme: "dark",
      });
      setWeb3Modal(web3Modal);
    }
    localStorage.setItem("WalletConnected", true);
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();
    setAddr(addr);
    const address = truncateEthAddress(addr);
    setAccount(address);
    let nftcontract = new ethers.Contract(NFTCONTRACT, NFTABI, signer);
    let miningcontract = new ethers.Contract(MININGCONTRACT, MININGABI, signer);
    let lockcontract = new ethers.Contract(LOCKCONTRACT, LOCKABI, signer);
    setNftContract(nftcontract);
    setMiningContract(miningcontract);
    setLockContract(lockcontract);
    const unstakednfts = await nftcontract.walletOfOwner(addr);
    console.log(unstakednfts)
    const unstkarr = [];
    unstakednfts.map((nft) => {
      let nfta = parseInt(nft);
      unstkarr.push(nfta);
    });
    setWalletNFTs(unstkarr)
    let deposit = await lockcontract.depositsOf(addr);
    let id = []
    let di = []
    deposit.map(async(nft) => {
      let info = await lockcontract.NFTInfos(nft);
      let lock = parseInt(info.lockPeriod)
      let token = parseInt(info.tokenId)
      let date = new Date(lock)
      if(date > Date.now()) {
        id.push(token);
      } else {
        di.push(token)
      } 
    })
    console.log(id)
    let approved = await nftcontract.isApprovedForAll(addr, LOCKCONTRACT);
    if (approved === false) {
      setIsApproved(false);
    }
    let miningBalance = await miningcontract.getBalance();
    let users = await miningcontract.users();
    let rewards = await miningcontract.cowsRewards(addr);
    let rate = await lockcontract.findRateOfUser(addr);
    let r = parseInt(rate)
    if (r <= 5000) {
      setRate(730)
    } else if (r <= 30000) {
      setRate(1095)
    } else if (r <= 60000) {
      setRate(2190)
    } else if (r <= 75000) {
      setRate(2920)
    } else if (r <= 90000) {
      setRate(3650)
    } else if (r > 90000) {
      setRate(4015)
    } else {
      setRate(0)
    }
    setUsers(parseInt(users));
    setMineBal(Number(ethers.utils.formatEther(String(miningBalance))).toFixed(3));
    setCowR(Number(ethers.utils.formatEther(String(rewards))).toFixed(5));
    setLockedNFTs(di)
    setUnlockedNFTs(id)
  };

  const DisconnectWallet = async () => {
    try {
      await web3Modal.clearCachedProvider();
      setAccount(null);
      localStorage.setItem("isWalletConnected", false);
    } catch (ex) {
      console.log(ex);
    }
  };

  const buyMiners = async(amount) => {
    let tx = await miningContract.buyCows('0xb5Afa0238113a3c67787AC184BF4865a80E11C03', {
      value: ethers.utils.parseEther(amount.toString()),
    });
    isLoading(true);
    await tx.wait(1);
    isLoading(false);
    ConnectWallet();
  }

  const approveNFT = async() => {
    let tx = await nftContract.setApprovalForAll(LOCKCONTRACT, true);
    isLoading(true);
    await tx.wait(1);
    isLoading(false);
    setIsApproved(true);
    ConnectWallet();
  }

  const sellMiners = async() => {
    let tx = await miningContract.sellCows();
    isLoading(true);
    await tx.wait(1);
    isLoading(false);
    ConnectWallet();
  }

  const compound = async() => {
    let tx = await miningContract.compoundCows('0xb5Afa0238113a3c67787AC184BF4865a80E11C03');
    isLoading(true);
    await tx.wait(1);
    isLoading(false);
    ConnectWallet();
  }

  const lock = async(nft) => {
    let tx = await lockContract.deposit(nft);
    isLoading(true);
    await tx.wait(1);
    isLoading(false);
    ConnectWallet();
  }

  const unlock = async() => {
    let tx = await lockContract.withdraw(nft);
    isLoading(true);
    await tx.wait(1);
    isLoading(false);
    ConnectWallet();
  }

  const relock = async() => {
    let tx = await lockContract.restake(nft);
    isLoading(true);
    await tx.wait(1);
    isLoading(false);
    ConnectWallet();
  }

  const rarity = async(a, b) => {
   let tx = await lockContract.setRarity(a, b)
  }

  return (
    <WalletConnectContext.Provider
      value={{
        account,
        ConnectWallet,
        isConnected,
        DisconnectWallet,
        buyMiners,
        sellMiners,
        compound,
        relock,
        unlock,
        lock,
        approveNFT,
        rarity,
        loading,
        isApproved,
        mineBal,
        users,
        cowR,
        rate,
        unlockedNFTs,
        walletNFTs,
        lockedNFTs
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};