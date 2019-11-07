# first-network 직접 구축

* 구축하다가 에러 or 파일이 꼬일시

```

sudo ./byfn.sh -m down

```
  -->파일이 깔끔하게 다 지워짐


* cryprtogen 경로 추가

```
export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin:~/fabric-samples/bin;
```


* 1. 인증서 생성(cryptogen 이용, cryptogen 쓸때마다 새로우 키값고 인증서를 생성)

모든 명령어는 /fabric-samples/first-network 에서 실행



```
sudo ../bin/cryptogen generate --config=./crypto-config.yaml (명령어)

-->(출력 값)   org1.example.com

              org2.example.com 
```    
* 2. genesis.block 생성

```
export FABRIC_CFG_PATH=$PWD

sudo ../bin/configtxgen  -profile TwoOrgsOrdererGenesis -channelID (본인아이디) -outputBlock ./channel-artifacts/genesis.block 
** -(본인아이디) 부분에 소문자 or 숫자만 가능 (대문자쓰면 나중에 에러)
```

* 3. 채널 생성

```
export CHANNEL_NAME=mychannel

sudo ../bin/configtxgen  -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME
```

first-network/channel-artifacts 에서 channel.tx , genesis.block 파일 확인 (ls)


* 4. 앵커피어 정의 (외부기관에 존재하는 피어와 통신하는 피어)

다시 first-network 폴더에서,
```
sudo ../bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP

sudo ../bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP
```

first-network/channel-artifacts 에서 Org1MSPanchors.tx, Org2MSPanchors.tx 파일 확인


#### ================================================================== 초기 설정 완료

#### ================================================================== 피어 구동

* 1. 피어 실행

```
sudo docker-compose -f docker-compose-cli.yaml up

```



* 2. 피어 접속

새로운 터미널 창 오픈

클라이언트로 접속(각 피어로 접속해서 수정하기엔 너무 번거롭 --> 클라이언트에서 환경변수만 바꿈으로서, 피어로 접속가능
```
sudo docker exec -it cli /bin/bash
```

* 3. 채널 생성 

```
export CHANNEL_NAME=mychannel

peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem 

mychannel.block 파일 확인

```
* 4. 채널 참가 (각 피어마다 설정)

(peer0,org1) (peer1,org1) (peer0,org2) (peer1,org2)


1--*) peer0.org1
```
(각 피어로 접속하는 환경변수)
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
```

(mychannel.block 을 채널에 참여)
```
peer channel join -b mychannel.block 
```

-->INFO 002 Successfully submitted proposal to join channel   나오면 첫번째 환경 변수 성공


2--*) peer1.org1
```
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ADDRESS=peer1.org1.example.com:8051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt
peer channel join -b mychannel.block

3--*) peer0.org2
```
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp CORE_PEER_ADDRESS=peer0.org2.example.com:9051 CORE_PEER_LOCALMSPID="Org2MSP" CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt 

peer channel join -b mychannel.block

4--*) peer1.org2
```

CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
CORE_PEER_ADDRESS=peer1.org2.example.com:10051
CORE_PEER_LOCALMSPID="Org2MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/ca.crt

peer channel join -b mychannel.block
```

* 5.앵커피어 (외부와 접촉하는 피어) 업데이트 

peer0org1 앵커피어 업데이트

```
(각 피어로 접속하는 환경변수)
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt



peer channel update -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
```

* peer0org2 앵커피어 업데이트

```
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp CORE_PEER_ADDRESS=peer0.org2.example.com:9051 CORE_PEER_LOCALMSPID="Org2MSP" CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt 



peer channel update -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org2MSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
```

체인코드 설치(각 피어마다 해줘야함 --> 1--*) 부터 4--*) 까지) (4번)

```
peer chaincode install -n mycc -v 1.0 -l golang -p github.com/chaincode/chaincode_example02/go
```

* 체인코드 배포(a=100,b=200)
```
peer chaincode instantiate -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n mycc -l golang -v 1.0 -c '{"Args":["init","a","100","b","200"]}' -P 'AND ('\''Org1MSP.peer'\'','\''Org2MSP.peer'\'')'\
```


query : 토큰 조회
```
peer chaincode query -C mychannel -n mycc -c '{"Args":["query","a"]}'  (a의 데이터를 조회)
```


invoke : 토큰 이동
```
peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n mycc --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"Args":["invoke","a","b","10"]}'
```
(a-->b 로 10 이동)
(a=90,b=210)




#### ===================================================================== 직접 서버 구축 끝
