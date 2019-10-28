```
Hyperledger fabric 환경설정

**ubuntu(18.04)로 진행 (virtualbox)


Docker 버전 17.06.2-ce 이상이 필요

docker 설치 : https://blog.cosmosfarm.com/archives/248/우분투-18-04-도커-docker-설치-방법/


Docker  Compose 버전 1.14.0 이상

docker-composer설치 : https://gmyankee.tistory.com/227


Go 버전 1.12.x가 필요

go 설치 : https://www.dante2k.com/590


Node.js 용 Hyperledger Fabric SDK를 활용하여 Hyperledger Fabric 용 애플리케이션을 개발할 경우 버전 8은 8.9.4 이상에서 지원됩니다. Node.js 버전 10은 10.15.3 이상에서 지원

(어플리케이션이 옛날 버전이 많아서 nvm으로 node버전을 관리해줌)

(nvm : node를 여러가지 버전으로 바꿔가며 사용할수 있게 해줌)

nvm 설치 : https://trustyoo86.github.io/nodejs/2019/02/18/ubuntu-nvm.html



git 설치 : 
sudo apt-get install git-core 
git config --global user.name "이름" 
git config --global user.email "이메일 주소"





최종확인

docker --version

docker-compose --version

go version

nvm --version

node --version

npm --version

git version

================================================================== 개발환경 설정 끝



하이퍼레저 샘플 다운로드

"mkdir -p $GOPATH/src/github.com/hyperledger"

"cd $GOPATH/src/github.com/hyperledger"

Fabric-sample project git clone

"git clone -b master https://github.com/hyperledger/fabric-samples.git"


다운로드후

"mkdir fabric-samples"

"cd fabric-samples"

"git checkout v1.2.0"

"git branch"

샘플에 필요한 binary tool 설치(root 권한으로 해줘야 함) 

"sudo su" --> root권한으로 가는 명령어

cd /src/github.com/hyperledger/fabric-samples/first-network (still at root)

"curl -sSL https://goo.gl/6wtTN5 | bash -s 1.2.0"

새 터미널 창 열어 실행.

First-Network 실행:

"cd first-network"

"./byfn.sh -m generate"

"sudo ./byfn.sh -m up"


First-network 종료:

"sudo ./byfn.sh -m down"



**서버를 다시 up시키려면 꼭 down을 해줘야함**

================================================================== 테스트 끝

================================================================== 직접 구축

구축하다가 에러 or 파일이 꼬일시

"sudo ./byfn.sh -m up"

"sudo ./byfn.sh -m down"  

  -->파일이 깔끔하게 다 지워짐 

1. 인증서 생성(cryptogen 이용)

모든 명령어는 /src/github.com/hyperledger/fabric-samples/first-network 에서 실행

sudo ../bin/cryptogen generate --config=./crypto-config.yaml (명령어)

-->(출력 값)   org1.example.com

              org2.example.com 
    
2. genesis.block 생성

export FABRIC_CFG_PATH=$PWD

sudo ../bin/configtxgen  -profile TwoOrgsOrdererGenesis -channelID (본인아이디) -outputBlock ./channel-artifacts/genesis.block 
** -(본인아이디) 부분에 소문자 or 숫자만 가능 (대문자쓰면 나중에 에러)

3. 채널 정의 

export CHANNEL_NAME=mychannel

sudo ../bin/configtxgen  -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME

/src/github.com/hyperledger/fabric-samples/first-network/channel-artifacts 에서 channel.tx , genesis.block 파일 확인 (ls)

4. 앵커피어 정의 (외부기관에 존재하는 피어와 통신하는 피어)

다시 first-network 폴더에서,

(1) sudo ../bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP

(2) sudo ../bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP


/src/github.com/hyperledger/fabric-samples/first-network/channel-artifacts 에서 Org1MSPanchors.tx, Org2MSPanchors.tx 파일 확인


================================================================== 초기 설정 완료

================================================================== 노드 구동

1. 노드 실행

sudo docker-compose -f docker-compose-cli.yaml up

새로운 터미널 창에서,

2. 노드 접속

sudo docker exec -it cli /bin/bash

3. 채널 생성

export CHANNEL_NAME=mychannel

peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem 

mychannel.block 파일 확인

4. 채널 참가

(peer0,org1) (peer1,org1) (peer0,org2) (peer1,org2) 4가지의 환경변수들 // 각각의 6가지 단계 반복 ( 명령어 한번에 입력 가능)

1--*) peer0.org1

export CORE_PEER_LOCALMSPID="Org1MSP"

export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt 

export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt 

export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key 

export CORE_PEER_TL
S_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin\@org1.example.com/msp

export CORE_PEER_ADDRESS=peer0.org1.example.com:7051

peer channel join -b mychannel.block 

-->INFO 002 Successfully submitted proposal to join channel   나오면 첫번째 환경 변수 성공

2--*) peer1.org1

export CORE_PEER_LOCALMSPID="Org1MSP"

export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/server.crt 

export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt 

export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/server.key 

export CORE_PEER_TL
S_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin\@org1.example.com/msp

export CORE_PEER_ADDRESS=peer1.org1.example.com:7051

peer channel join -b mychannel.block

3--*) peer0.org2

export CORE_PEER_LOCALMSPID="Org2MSP"

export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/server.crt 

export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt 

export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/server.key 

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin\@org2.example.com/msp

export CORE_PEER_ADDRESS=peer0.org2.example.com:7051

peer channel join -b mychannel.block

4--*) peer1.org2

export CORE_PEER_LOCALMSPID="Org2MSP"

export CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/server.crt 

export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/ca.crt 

export CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/server.key 

export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin\@org2.example.com/msp

export CORE_PEER_ADDRESS=peer1.org2.example.com:7051

peer channel join -b mychannel.block

5.앵커피어 업데이트

peer0org1 앵커피어 업데이트

CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt


peer channel update -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org1MSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


peer0org2 앵커피어 업데이트

CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp CORE_PEER_ADDRESS=peer0.org2.example.com:7051 CORE_PEER_LOCALMSPID="Org2MSP" CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt peer channel update -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/Org2MSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


n = name
v = version
p = path


체인코드 설치(각 피어마다 해줘야함 --> 1--*) 부터 4--*) 까지)

6개 세트 이후 peer channel join -b mychannel.block 대신 

아래의 명령어 입력

peer chaincode install -n mycc -v 1.0 -l golang -p github.com/chaincode/chaincode_example02/go

체인코드 배포
peer chaincode instantiate -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n mycc -l golang -v 1.0 -c '{"Args":["init","a","100","b","200"]}' -P 'AND ('\''Org1MSP.peer'\'','\''Org2MSP.peer'\'')'\

peer chaincode query -C mychannel -n mycc -c '{"Args":["query","a"]}'

peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n mycc --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"Args":["invoke","a","b","10"]}'


===================================================================== 기본 서버 구축 끝

체인코드 개발 모드 (앞선 과정을 반복하기에 너무 복잡 --> 체인코드만 따로 분리해서 개발 배포)


# 첫 번째 터미널

/src/github.com/hyperledger/fabric-samples/chaincode-docker-devmode 이동

docker-compose -f docker-compose-simple.yaml.up

# 두 번째 터미널

docker exec -it chaincode /bin/bash

cd sacc

go build 하고 

/opt/gopath/src 로 이동후

CORE_PEER_ADDRESS=peer:7052 CORE_CHAINCODE_ID_NAME=mycc:0 ./sacc

# 세 번째 터미널 (설치 배포)

docker exec -it cli /bin/bash

peer chaincode install -p chaincodedev/chaincode/sacc -n mycc -v 0 

peer chaincode instantiate -n mycc -v 0 -c '{"Args":["a","10"]}' -C myc

query,invoke

peer chaincode invoke -n mycc -c '{"Args":["set","a","20"]}' -C myc

peer chaincode query -n mycc -c '{"Args":["query","a"]}' -C myc
```




































    








