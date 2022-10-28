import Head from 'next/head'
import { Container, Text, Button, Spacer, Card, Input, Row, Link, Badge } from '@nextui-org/react'
import { WalletConnectContext } from '../context/WalletConnectContext'
import { useRef, useContext } from 'react'

export default function Home() {

  const ConnectContext = useContext(WalletConnectContext)
  const { ConnectWallet, DisconnectWallet, account, buyMiners, sellMiners, compound, loading, rate, mineBal, cowR, users } = ConnectContext
  const inputRef = useRef(null);

  const handleHire = () => {
    buyMiners(inputRef.current?.value);
  }

  return (
    <div>
      <Head>
        <title>PsyBulls Mining</title>
        <meta name="PsyBulls" content="Psy bulls miner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container css={{ dflex:"center", my:"$10", jc:"space-between"}}>
      <Text
        h1
        size={25}
        weight="bold"
      >
        <Link href='/Lock'> Lock NFT</Link>
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
      <Spacer />
      <Container css={{dflex:"center"}}>
      <Text
        h1
        size={40}
        weight="bold"
      >
        PsyBulls Mining 
      </Text>
      </Container>
      <Text
        h1
        size={20}
        css={{
          dflex:"center",
          px:"$10"
        }}
        weight="bold"
      >
       Lock PsyBulls in the Lock page Deposit BNB and compound daily to earn rewards!
      </Text>
      <Text
        h1
        size={20}
        css={{
          dflex:"center",
          px:"$10",
        }}
        weight="bold"
      >
       The rarer your nfts the higher rewards you earn..
      </Text>
      <Container css={{
        mb:"$10",
        ta:"center"
      }}>
        <Badge size='lg' variant='bordered' isSquared color='secondary'>
       Contract Balance : {mineBal} BNB
        </Badge>
      </Container>
      <Container css={{
        mb:"$10",
        ta:"center"
      }}>
        <Badge size='lg' variant='bordered' isSquared color='secondary'>
       APR : {rate}%
        </Badge>
      </Container>
      <Container>
        <Card isHoverable bordered>
        <Card.Header css={{jc:"space-around", d:"flex", }}>
      <Text
        h1
        size={20}
        css={{
          dflex:"center",
          px:"$10",
        }}
        weight="bold"
      >
       Earned {cowR} BNB
      </Text>
        </Card.Header>
        <Card.Divider />
        <Card.Body>
          <Spacer />
          <Input
          bordered 
          labelPlaceholder={`0 ${'BNB'}`}
          css={{
            ta:"center",
            mb:"$10"
          }}
          type="number"
          color="secondary"
          ref={inputRef}
           />
           <Button auto flat bordered disabled={loading} color="secondary" onClick={handleHire}>
            Hire Miners
           </Button>
           <Spacer />
           <Text
        h1
        size={20}
        css={{
          dflex:"center",
          px:"$10",
        }}
        weight="bold"
      >
       Compound in 00:00:00
      </Text>
        </Card.Body>
        <Card.Divider />
        <Card.Footer>
            <Row justify="space-around">
         <Button auto flat bordered disabled={loading} color="secondary" onClick={compound}>
            Compound
           </Button>
           <Button auto flat bordered disabled={loading} color="secondary" onClick={sellMiners}>
            Withdraw
           </Button>
            </Row>
          </Card.Footer>
      </Card>
      <Spacer />
      <Card isHoverable bordered>
        <Card.Header css={{jc:"space-around", d:"flex", }}>
          Total Users: {users}
          </Card.Header>
          </Card>
          <Spacer />
      </Container>
    </div>
  )
}


  {/*
        <div>
        <Text
          h1
          size={25}
          css={{
            dflex: "center",
          }}
          weight="bold"
          style={{ marginTop: "20px", color:"white"  }}
        >
          UnLocked NFTs
        </Text>
        <Table
      sticked
      aria-label="Example static collection table"
      selectionMode="multiple"
      color="secondary"
      css={{
        height: "auto",
        minWidth: "100%",
      }}
      selectedKeys={unstakeSelected}
      onSelectionChange={setUnstakeSelected}
    >
      <Table.Header>
        <Table.Column>NFT</Table.Column>
        <Table.Column>ID</Table.Column>
        </Table.Header>
      <Table.Body>
      {unlockedNFTs?.map((nft) => {
          return(<>
           <Table.Row key={nft}>
          <Table.Cell>
          <Image
              src={IPFSURL + _metadata[0][nft - 1].image.replace("ipfs://","ipfs/")}
              width="100px"
              style={{ borderRadius: "20px" }}
              alt=""
                      />
          </Table.Cell>
          <Table.Cell>{nft}</Table.Cell>
          </Table.Row>
          </>)
        })
        }
      </Table.Body>
            <Table.Pagination
              shadow
              noMargin
              align="center"
              rowsPerPage={3}
              onPageChange={(page) => console.log({ page })}
            />
          </Table>
      </div>
           
        <div>
        <Text
          h1
          size={25}
          css={{
            dflex: "center",
          }}
          weight="bold"
          style={{ marginTop: "20px",color:"white"  }}
        >
          Locked NFTs
        </Text>
        <Table
      sticked
      aria-label="Example static collection table"
      selectionMode="multiple"
      color="secondary"
      css={{
        height: "auto",
        minWidth: "100%",
      }}
    >
      <Table.Header>
        <Table.Column>NFT</Table.Column>
        <Table.Column>ID</Table.Column>
        <Table.Column>UNLOCK DATE</Table.Column>
        </Table.Header>
      <Table.Body>
      {lockedNFTs?.map((nft) => {
          return(<>
           <Table.Row key={nft}>
          <Table.Cell>
          <Image
              src={IPFSURL + _metadata[0][nft - 1].image.replace("ipfs://","ipfs/")}
              width="100px"
              style={{ borderRadius: "20px" }}
              alt=""
                      />
          </Table.Cell>
          <Table.Cell>{nft}</Table.Cell>
          </Table.Row>
          </>)
        })
        }
      </Table.Body>
            <Table.Pagination
              shadow
              noMargin
              align="center"
              rowsPerPage={3}
              onPageChange={(page) => console.log({ page })}
            />
          </Table>
      </div> */}