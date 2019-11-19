# Hyperledger fabric 개발환경설정 (1.4.1)

## ubuntu(18.04)로 진행 (virtualbox)


* Docker 버전 17.06.2-ce 이상이 필요

```
docker 설치 : https://blog.cosmosfarm.com/archives/248/우분투-18-04-도커-docker-설치-방법/

sudo usermod -aG docker $USER 
```

* Docker  Compose 버전 1.14.0 이상

```
docker-composer설치 : https://gmyankee.tistory.com/227
```

* Go 버전 1.12.x가 필요

```
go 설치 : https://www.dante2k.com/590
```

Node.js 용 Hyperledger Fabric SDK를 활용하여 Hyperledger Fabric 용 애플리케이션을 개발할 경우 버전 8은 8.9.4 이상에서 지원됩니다. Node.js 버전 10은 10.15.3 이상에서 지원

(어플리케이션이 옛날 버전이 많아서 nvm으로 node버전을 관리해줌)

(nvm : node를 여러가지 버전으로 바꿔가며 사용할수 있게 해줌)

```
nvm 설치 : https://trustyoo86.github.io/nodejs/2019/02/18/ubuntu-nvm.html
```


* git 설치 

```
sudo apt-get install git-core 
git config --global user.name "이름" 
git config --global user.email "이메일 주소"
```





* 최종확인

```
docker --version

docker-compose --version

go version

nvm --version

node --version

npm --version

git version
```
(node 8.11.1, npm 5.6.0 으로 진행)

* hyperledger fabirc-sameple + binary tool 설치

설치할 곳으로 들어간뒤

```
curl -sSL http://bit.ly/2ysbOFE | bash -s 1.4.1

```

//새 터미널 창 열어 실행.

* First-Network 실행:

```
cd first-network

./byfn.sh -m generate

./byfn.sh -m up
```

* First-network 종료:

```
./byfn.sh -m down
```
