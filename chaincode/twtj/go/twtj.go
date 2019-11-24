package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

// Define the car structure, with 4 properties.  Structure tags are used by encoding/json library
type user struct {
	Age    int    `json:"age"`
	Gender string `json:"gender"`
}

type privateAge struct {
	Product []string `json:"product"`
	Price   []int    `json:"price"`
}

/*
 * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {

	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately

	if function == "initUser" {
		return s.initUser(APIstub, args)
	}
	// else if function == "readPrivateGender" {
	// 	return s.readPrivateGender(APIstub, args)
	// }
	// else if function == "initGender" {
	// 	return s.initGender(APIstub, args)
	// }
	// else if function == "queryAllUsers" {
	// 	return s.queryAllUsers(APIstub)
	// }

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) initUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var err error
	var email = args[0]

	// type userTransientInput struct {
	// 	Email   string `json:"email"`
	// 	Age     int    `json:"age"`
	// 	Gender  string `json:"gender"`
	// 	Product string `json:"product"`
	// 	Price   int    `json:"price"`
	// }
	// fmt.Println("-start initLedger")

	// if len(args) != 5 {
	// 	return shim.Error("Incorrect number of arguments. Private user data must be passed in transient map.")
	// }

	// transMap, err := APIstub.GetTransient()
	// if err != nil {
	// 	return shim.Error("Error getting transient: " + err.Error())
	// }

	// if _, ok := transMap["user"]; !ok {
	// 	return shim.Error("user must be a key in the transient map")
	// }

	// if len(transMap["user"]) == 0 {
	// 	return shim.Error("user value in the transient map must be a non-empty JSON string")
	// }

	// var userInput userTransientInput
	// err = json.Unmarshal(transMap["user"], &userInput)
	// if err != nil {
	// 	return shim.Error("Failed to decode JSON of: " + string(transMap["user"]))
	// }

	//create user
	age, _ := strconv.Atoi(args[1])
	user := &user{
		Age:    age,
		Gender: args[2],
	}

	userJSONasBytes, err := json.Marshal(user)
	if err != nil {
		return shim.Error(err.Error())
	}

	//save user
	APIstub.PutState(email, userJSONasBytes)
	// private_GenderAsBytes, err := APIstub.GetPrivateData("collectionGender", args[0])
	// if err != nil {
	// 	return shim.Error("Failed to get user :" + err.Error())
	// } else if private_GenderAsBytes != nil {
	// 	//전에 private data 기록이 있으면 받은후 삭제하고 받은데이터를 더해서 다시넣기
	// 	APIstub.DelPrivateData("collectionGender", args[0])
	// 	var arr_product []string
	// 	arr_product = append(arr_product, args[3], string(private_GenderAsBytes[1]))
	// 	price, _ := strconv.Atoi(args[4])
	// 	var arr_price []int
	// 	arr_price = append(arr_price, price, int(private_GenderAsBytes[2]))
	// 	private_Gender := &private_Gender{
	// 		Product: arr_product,
	// 		Price:   arr_price,
	// 	}
	// 	private_GenderBytes, err := json.Marshal(private_Gender)
	// 	if err != nil {
	// 		return shim.Error(err.Error())
	// 	}
	// 	err = APIstub.PutPrivateData("collectionGender", args[0], private_GenderBytes)

	// } else {
	// }

	//기록이없으면 방금 받은값 넣기
	// var arrproduct []string
	// arrproduct = append(arrproduct, args[3])
	// price, _ := strconv.Atoi(args[4])
	// var arrprice []int
	// arrprice = append(arrprice, price)

	// privateGender := &privateGender{
	// 	Product: arrproduct,
	// 	Price:   arrprice,
	// }

	// privateGenderBytes, err := json.Marshal(privateGender)
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }
	// err = APIstub.PutPrivateData("collectionGender", email, privateGenderBytes)

	//입력값 받기

	// twtjs := []user{
	// User{Email: "aaa@naver.com", Age: 34, Gender: "man", Product: "MAC", Price: 1000000},
	// Car{Make: "Toyota", Model: "Prius", Colour: "blue", Owner: "Tomoko"},
	// Car{Make: "Ford", Model: "Mustang", Colour: "red", Owner: "Brad"},
	// Car{Make: "Hyundai", Model: "Tucson", Colour: "green", Owner: "Jin Soo"},
	// Car{Make: "Volkswagen", Model: "Passat", Colour: "yellow", Owner: "Max"},
	// Car{Make: "Tesla", Model: "S", Colour: "black", Owner: "Adriana"},
	// Car{Make: "Peugeot", Model: "205", Colour: "purple", Owner: "Michel"},
	// Car{Make: "Chery", Model: "S22L", Colour: "white", Owner: "Aarav"},
	// Car{Make: "Fiat", Model: "Punto", Colour: "violet", Owner: "Pari"},
	// Car{Make: "Tata", Model: "Nano", Colour: "indigo", Owner: "Valeria"},
	// Car{Make: "Holden", Model: "Barina", Colour: "brown", Owner: "Shotaro"},
	// }

	return shim.Success(nil)
}

// func (s *Smart

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
