var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "u8zu5ve1988",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
  
});


function runSearch() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View Products for Sale":
          viewAll();
          break;
  
        case "View Low Inventory":
          checkAllLow();
          break;
  
        case "Add to Inventory":
          
          addtoInventory();
          break;
  
        case "Add New Product":
          addNewprod();
          break;
        }
      });
  }


  function viewAll(){
      let query = "SELECT * FROM products";

      connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log("Item id: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || In stock: " + res[i].stock_quantity);
        }
      })
      setTimeout(runSearch,500);
  }

  function checkAllLow(){
    let query = "SELECT * FROM products WHERE stock_quantity < 5";

    connection.query(query, function (err, res) {
        if(res.length === 0){
            console.log("No Low inventory found");
            setTimeout(runSearch,500);
        }
        for (var i = 0; i < res.length; i++) {
          console.log("Item id: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || In stock: " + res[i].stock_quantity);
          setTimeout(runSearch,500);
        }
        })
        
  }

  function addtoInventory(){
    inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Type in product id",

      },
      {
        name: "quantity",
        type: "input",
        message: "What quantity you would like to add?"
      }
    ])
    .then(function (answer) {

      let productID = answer.id;
      let toAdd = parseInt(answer.quantity);

      var query = "SELECT * FROM products WHERE ?";
      connection.query(query, { item_id: productID }, function (err, res) {
        if (res.length === 0) { console.log("Product not found") }

        else {
            let existingQuantity = parseInt(res[0].stock_quantity);
            let totalQuantity = existingQuantity + toAdd;
            let query = "UPDATE products SET stock_quantity=" + totalQuantity + " WHERE ?";
            connection.query(query, { item_id: productID }, function (err, res) {
              console.log("Changes made successfuly");
              console.log("New amount is : "+ totalQuantity);
            })
          } 
        })
        setTimeout(runSearch,500);
    })
};


function addNewprod(){
    inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Type in product name",

      },
      {
        name: "department",
        type: "input",
        message: "What department?"
      },
      {
        name: "price",
        type: "input",
        message: "What price?"
      },
      {
        name: "instock",
        type: "input",
        message: "What stock quantity?"
      }
    ])
    .then(function (answer) {
        let name = answer.name;
        let department = answer.department;
        let price = parseInt(answer.price);
        let stock = parseInt(answer.instock);

        let query = `INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("${name}", "${department}", ${price}, ${stock})`;
        console.log(query);
        connection.query(query, function(err,res){
            if (err) throw err;
            console.log("New item was successfully added!")
            viewAll();
        })
    })
}