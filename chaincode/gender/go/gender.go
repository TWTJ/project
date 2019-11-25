package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type GenderContract struct {
}

type genderPurchase struct {
	Product []string `json:"product"`
	Price   []string `json:"price"`
}
type genderPurchaseResult struct {
	Product []string `json:"product"`
	Price   []string `json:"price"`
}

func (s *GenderContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {

	return shim.Success(nil)
}

func (s *GenderContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	function, args := APIstub.GetFunctionAndParameters()

	if function == "initGender" {
		return s.initGender(APIstub)
	} else if function == "addGender" {
		return s.addGender(APIstub, args)
	}

	return shim.Error("Invalid Gender Contract function name.")
}

func (s *GenderContract) initGender(APIstub shim.ChaincodeStubInterface) sc.Response {
	var product []string
	var price []string
	genderPurchase := &genderPurchase{
		Product: product,
		Price:   price,
	}
	genderJSONasBytes, err := json.Marshal(genderPurchase)
	if err != nil {
		return shim.Error(err.Error())
	}
	APIstub.PutState("male", genderJSONasBytes)
	APIstub.PutState("female", genderJSONasBytes)

	return shim.Success(nil)
}

func (s *GenderContract) addGender(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var gender = args[0]
	var arrproduct []string
	var arrprice []string

	getData, err := APIstub.GetState(gender)
	if err != nil {
		return shim.Error("addGender Getstate Error")
	}
	APIstub.DelState(gender)

	genderPurchase := &genderPurchase{}
	json.Unmarshal(getData, &genderPurchase)

	arrproduct = append(genderPurchase.Product, args[1])
	arrprice = append(genderPurchase.Price, args[2])
	shim.Error(arrproduct[0])

	genderPurchaseResult := &genderPurchaseResult{
		Product: arrproduct,
		Price:   arrprice,
	}

	genderPurchaseBytes, err := json.Marshal(genderPurchaseResult)
	APIstub.PutState(gender, genderPurchaseBytes)

	// var arrProduct

	return shim.Success(nil)
}

// func (s *GenderContract) readGender(APIstub shim.ChaincodeStubInterface,args []string) sc.Response{
// 	var gender=args[0]
// }

// func (s *GenderContract) addArrGender(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
// 	var gender = args[0]
// 	var arrproduct []string
// 	var arrprice []int

// 	price, _ := strconv.Atoi(args[2])

// 	getData, err := APIstub.GetState(gender)
// 	if err != nil {
// 		return shim.Error("addGender Getstate Error")
// 	}
// 	APIstub.DelState(gender)

// 	genderPurchase := &genderPurchase{}
// 	json.Unmarshal(getData, &genderPurchase)

// 	arrproduct = append(genderPurchase.Product, args[1])
// 	arrprice = append(genderPurchase.Price, price)
// 	shim.Error(arrproduct[0])

// 	genderPurchaseResult := &genderPurchaseResult{
// 		Product: arrproduct,
// 		Price:   arrprice,
// 	}

// 	genderPurchaseBytes, err := json.Marshal(genderPurchaseResult)
// 	APIstub.PutState(gender, genderPurchaseBytes)

// 	// var arrProduct

// 	return shim.Success(nil)
// }

func main() {
	err := shim.Start(new(GenderContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
