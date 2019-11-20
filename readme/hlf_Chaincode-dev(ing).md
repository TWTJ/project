# 체인코드 개발 모드 

### (앞선 과정을 반복하기에 너무 복잡 --> 체인코드만 따로 분리해서 개발 배포) 


##### 첫 번째 터미널

fabric-samples/chaincode-docker-devmode 이동

```
docker-compose -f docker-compose-simple.yaml up
```

##### 두 번째 터미널 (체인코드 빌드)


```
docker exec -it chaincode /bin/bash
```

```
cd sacc

go build

CORE_PEER_ADDRESS=peer:7052 CORE_CHAINCODE_ID_NAME=mycc:0 ./sacc
```


##### 세 번째 터미널 (설치 배포)
```
docker exec -it cli /bin/bash
```

instantiate : 배포

```
cd ..

peer chaincode install -p chaincodedev/chaincode/sacc -n mycc -v 0

peer chaincode instantiate -n mycc -v 0 -c '{"Args":["a","10"]}' -C myc


```

query(조회), invoke(생성)

```
peer chaincode invoke -n mycc -c '{"Args":["set","b","20"]}' -C myc

peer chaincode query -n mycc -c '{"Args":["query","a"]}' -C myc

peer chaincode query -n mycc -c '{"Args":["query","b"]}' -C myc

export FABRIC_LOGGING_SPEC=INFO  --> 로그 단순화 (value값만 보기)
```
-C : channel name

peer chaincode list --instantiated -C [채널명] --> 해당 채널에 배포된 체인코드 확인

```
peer chaincode list --instantiated -C myc
```

