package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type AgeContract struct {
}

type agePurchase struct {
	Product []string `json:"product"`
	Price   []string `json:"price"`
}
type agePurchaseResult struct {
	Product []string `json:"product"`
	Price   []string `json:"price"`
}

func (s *AgeContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {

	return shim.Success(nil)
}

func (s *AgeContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	function, args := APIstub.GetFunctionAndParameters()

	if function == "initAge" {
		return s.initAge(APIstub)
	} else if function == "addAge" {
		return s.addAge(APIstub, args)
	}

	return shim.Error("Invalid Gender Contract function name.")
}

func (s *AgeContract) initAge(APIstub shim.ChaincodeStubInterface) sc.Response {
	var product []string
	var price []string
	agePurchase := &agePurchase{
		Product: product,
		Price:   price,
	}
	ageJSONasBytes, err := json.Marshal(agePurchase)
	if err != nil {
		return shim.Error(err.Error())
	}
	APIstub.PutState("0", ageJSONasBytes)
	APIstub.PutState("1", ageJSONasBytes)
	APIstub.PutState("2", ageJSONasBytes)
	APIstub.PutState("3", ageJSONasBytes)
	APIstub.PutState("4", ageJSONasBytes)
	APIstub.PutState("5", ageJSONasBytes)
	APIstub.PutState("6", ageJSONasBytes)

	return shim.Success(nil)
}

func (s *AgeContract) addAge(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var age, _ = strconv.Atoi(args[0])
	age = age / 10
	if age > 6 {
		age = 6
	}
	var strAge = strconv.Itoa(age)
	var arrproduct []string
	var arrprice []string

	getData, err := APIstub.GetState(strAge)
	if err != nil {
		return shim.Error("addAge Getstate Error")
	}
	APIstub.DelState(strAge)

	genderPurchase := &agePurchase{}
	json.Unmarshal(getData, &genderPurchase)

	arrproduct = append(genderPurchase.Product, args[1])
	arrprice = append(genderPurchase.Price, args[2])
	shim.Error(arrproduct[0])

	agePurchaseResult := &agePurchaseResult{
		Product: arrproduct,
		Price:   arrprice,
	}

	agePurchaseBytes, err := json.Marshal(agePurchaseResult)
	APIstub.PutState(strAge, agePurchaseBytes)

	// var arrProduct

	return shim.Success(nil)
}

func main() {
	err := shim.Start(new(AgeContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
