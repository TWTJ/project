Hyperledger fabric 환경설정

**ubuntu로 진행 (virtualbox)

Docker 버전 17.06.2-ce 이상이 필요

docker 설치 : https://blog.cosmosfarm.com/archives/248/우분투-18-04-도커-docker-설치-방법/

Docker  Compose 버전 1.14.0 이상

docker-composer설치 : https://gmyankee.tistory.com/227

Go 버전 1.12.x가 필요

go 설치 : https://www.dante2k.com/590

Node.js 용 Hyperledger Fabric SDK를 활용하여 Hyperledger Fabric 용 애플리케이션을 개발할 경우 버전 8은 8.9.4 이상에서 지원됩니다. Node.js 버전 10은 10.15.3 이상에서 지원
(어플리케이션이 옛날 버전이 많아서 nvm으로 node버전을 관리해줌)
(nvm : node를 여러가지 버전으로 그때그때 바꾸며 사용)

nvm 설치 : https://trustyoo86.github.io/nodejs/2019/02/18/ubuntu-nvm.html

최종확인

docker --version

docker-compose --version

go version

nvm --version

node --version

npm --version


