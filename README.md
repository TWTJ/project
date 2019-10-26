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

sudo ../bin/cryptogen generate --config=./crypto-config.yaml
--> org1.example.com
    org2.example.com
    
2. genesis.block 생성
export FABRIC_CFG_PATH=$PWD

sudo ../bin/configtxgen  -profile TwoOrgsOrdererGenesis -channelID dong -outputBlock ./channel-artifacts/genesis.block 
** -channelID 부분에 소문자 or 숫자만 가능 (대문자쓰면 나중에 에러)
/src/github.com/hyperledger/fabric-samples/first-network/channel-artifacts 에서 genesis.block 파일 확인

3. 채널 정의
(CHANNEL_NAME 은 아까 쓴 channelID 와 다르게써야함)
export CHANNEL_NAME=mychannel

sudo ../bin/configtxgen  -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME

/src/github.com/hyperledger/fabric-samples/first-network/channel-artifacts 에서 channel.tx 파일 확인

4. 앵커피어 정의 (외부기관에 존재하는 피어와 통신하는 피어)

sudo ../bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP

/src/github.com/hyperledger/fabric-samples/first-network/channel-artifacts 에서 Org1MSPanchors.tx, Org2MSPanchors.tx 파일 확인

================================================================== 초기 설정 완료

================================================================== 노드 구동

1. 노드 실행

sudo docker-compose -f docker-compose-cli.yaml up

2. 노드 접속

sudo docker exec -it cli /bin/bash

3. 채널 생성

export CHANNEL_NAME=mychannel

peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem 

mychannel.block 파일 확인

4.
















    








