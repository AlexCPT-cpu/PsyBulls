import {
    Table,
    Image,
    Container,
    Button,
    Text,
    Link
  } from "@nextui-org/react";
  import React, { useState, useMemo, useContext } from "react";
  import { IPFSURL } from "../config/config";
  import _metadata from "../config/_metadata.json";
  import { WalletConnectContext } from '../context/WalletConnectContext'
  

function Lock() {
    const ConnectContext = useContext(WalletConnectContext)
    const { ConnectWallet, DisconnectWallet, account, lock, unlock, relock, unlockedNFTs, walletNFTs, lockedNFTs, loading, isApproved, approveNFT } = ConnectContext

    const [unstakeSelected, setUnstakeSelected] = useState([]);
    const [lockSelected, setLockSelected] = useState([]);

    
    const unStakeSelectedValue = useMemo(
      () => Array.from(unstakeSelected).join(","),
      [unstakeSelected]
    );
    const lockSelectedValue = useMemo(
      () => Array.from(lockSelected).join(","),
      [lockSelected]
    );
  
  
    const handleUnstake = async () => {
      let unstakeconverted = (unStakeSelectedValue.split(',').map((val) => {return parseInt(val)}))
      if (unStakeSelectedValue == "a,l,l") {
        console.log("all :", unlockedNFTs)
       // unlock(unlockedNFTs)
      }
      else {
        console.log(unstakeconverted)
        //unlock(unstakeconverted)
      }
    }

    const handleRelock = async () => {
      let relockconverted = (unStakeSelectedValue.split(',').map((val) => {return parseInt(val)}))
      if (unStakeSelectedValue == "a,l,l") {
        console.log("all :",unlockedNFTs)
        //relock(unlockedNFTs)
      }
      else {
        console.log(relockconverted)
       // relock(relockconverted)
      }
    }

    const handleLock = async () => {
      let lockconverted = (lockSelectedValue.split(',').map((val) => {return parseInt(val)}))
      if (lockSelectedValue == "a,l,l") {
        console.log("all :", walletNFTs)
       // lock(walletNFTs)
      }
      else {
        console.log(lockconverted)
       // lock(lockconverted)
      }
    }
  
  return (
    <Container>
         <Container css={{ dflex:"center", my:"$10", jc:"space-between"}}>
      <Text
        h1
        size={25}
        weight="bold"
      >
        <Link href='/' css={{color:"$white"}}> Mine BNB</Link>
        </Text>
        {account ?
            <Button auto color="secondary" flat onClick={DisconnectWallet}>
                  {account}
            </Button>
                :
            <Button auto color="secondary" flat onClick={ConnectWallet}>
                  Connect Wallet
            </Button>
        }
      </Container>
    <>
      <div>
        <Text
          h1
          size={25}
          css={{
            dflex: "center",
          }}
          weight="bold"
          style={{ marginTop: "20px", color:"white" }}
        >
          Wallet NFTs
        </Text>
        {walletNFTs?.length !== 0 ? (
          <Table
            shadow={false}
            selectionMode="multiple"
            aria-label="All Unstaked NFTs"
            css={{ minWidth: "100%", height: "calc($space$14 * 10)" }}
            color="secondary"
            selectedKeys={lockSelected}
            onSelectionChange={setLockSelected}
          >
            <Table.Header>
              <Table.Column>NFT</Table.Column>
              <Table.Column>TOKENID</Table.Column>
            </Table.Header>
            <Table.Body>
              {walletNFTs?.map((nfts) => {
                return (
                  <Table.Row key={nfts}>
                    <Table.Cell>
                      <Image
                        src={IPFSURL + _metadata[0][nfts]['image'].replace("ipfs://","ipfs/")}
                        width="100px"
                        style={{ borderRadius: "20px" }}
                        alt=""
                      />
                    </Table.Cell>
                    <Table.Cell>{nfts}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
            <Table.Pagination
              shadow
              noMargin
              align="center"
              rowsPerPage={3}
              onPageChange={(page) => console.log({ page })}
            />
          </Table>
        ) : null}
      </div>
      <Container css={{ dflex: "center", mt: "$5",mb: "$5" }}>
        {isApproved ?
        <>
         {lockSelectedValue === "a,l,l" ?
                   <Button auto bordered disabled={loading} color="white" css={{ px: "$13" }} onClick={handleLock}>
                   Lock All
             </Button>
             :
          <Button auto bordered disabled={loading} color="white" css={{ px: "$13" }} onClick={handleLock}>
                Lock 
          </Button>
         }   
        </>
        :
        <Button auto bordered disabled={loading} color="white" css={{ px: "$13" }} onClick={handleLock}>
        Approve NFT
  </Button>
      }
        </Container>
        <div>
          <hr />
        <Text
          h1
          size={25}
          css={{
            dflex: "center",
          }}
          weight="bold"
          style={{ marginTop: "20px", color:"white" }}
        >
          Unlocked NFTs
        </Text>
        {unlockedNFTs?.length !== 0 ? (
          <Table
            shadow={false}
            selectionMode="multiple"
            aria-label="All Unstaked NFTs"
            css={{ minWidth: "100%", height: "calc($space$14 * 10)" }}
            color="secondary"
            selectedKeys={unstakeSelected}
            onSelectionChange={setUnstakeSelected}
          >
            <Table.Header>
              <Table.Column>NFT</Table.Column>
              <Table.Column>TOKENID</Table.Column>
            </Table.Header>
            <Table.Body>
              {unlockedNFTs?.map((nfts) => {
                return (
                  <Table.Row key={nfts}>
                    <Table.Cell>
                      <Image
                        src={IPFSURL + _metadata[0][nfts]['image'].replace("ipfs://","ipfs/")}
                        width="100px"
                        style={{ borderRadius: "20px" }}
                        alt=""
                      />
                    </Table.Cell>
                    <Table.Cell>{nfts}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
            <Table.Pagination
              shadow
              noMargin
              align="center"
              rowsPerPage={3}
              onPageChange={(page) => console.log({ page })}
            />
          </Table>
        ) : null}
      </div>
      {unStakeSelectedValue === "a,l,l" ?
                  <Container css={{ dflex: "center", mt: "$5",mb: "$5", jc:"space-between"}}>
              <Button auto flat bordered disabled={loading} color="$white" css={{}} onClick={handleRelock}>
                        ReLock All
                  </Button>
            <Button auto flat bordered disabled={loading} color="$white" css={{}} onClick={handleUnstake}>
                Withdraw All
          </Button>
          </Container>
          :
          <Container css={{ dflex: "center", mt: "$5",mb: "$5", jc:"space-between"}}>
            <Button auto flat bordered disabled={loading} color="$white" css={{ px: "$13" }} onClick={handleRelock}>
                    Relock
              </Button>
          <Button auto flat bordered disabled={loading} color="$white" css={{ px: "$13" }} onClick={handleUnstake}>
                Withdraw
          </Button>
          </Container>
          }
      <div>
      <hr />
        <Text
          h1
          size={25}
          css={{
            dflex: "center",
          }}
          weight="bold"
          style={{ marginTop: "20px", color:"white" }}
        >
          Locked NFTs
        </Text>
        {lockedNFTs?.length !== 0 ? (
          <Table
            shadow={false}
            aria-label="All Unstaked NFTs"
            css={{ minWidth: "100%", height: "calc($space$14 * 10)" }}
            color="secondary"
          >
            <Table.Header>
              <Table.Column>NFT</Table.Column>
              <Table.Column>TOKENID</Table.Column>
            </Table.Header>
            <Table.Body>
              {lockedNFTs?.map((nfts) => {
                return (
                  <Table.Row key={nfts}>
                    <Table.Cell>
                      <Image
                        src={IPFSURL + _metadata[0][nfts]['image'].replace("ipfs://","ipfs/")}
                        width="100px"
                        style={{ borderRadius: "20px" }}
                        alt=""
                      />
                    </Table.Cell>
                    <Table.Cell>{nfts}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
            <Table.Pagination
              shadow
              noMargin
              align="center"
              rowsPerPage={3}
              onPageChange={(page) => console.log({ page })}
            />
          </Table>
        ) : null}
        <hr />
      </div>
      </>
    </Container>

  )
}

export default Lock