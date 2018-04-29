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
  displayAll();
  setTimeout(buyMe, 500);
});

function displayAll() {
  let query1 = "SELECT * FROM products";
  connection.query(query1, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("Item id: " + res[i].item_id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || In stock: " + res[i].stock_quantity);
    }
  })
}

function buyMe() {

  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "Type in product id you would like to buy",

      },
      {
        name: "quantity",
        type: "input",
        message: "What quantity you would like to buy?"
      }
    ])
    .then(function (answer) {

      let productId = answer.id;
      let productQuantity = parseInt(answer.quantity);

      var query = "SELECT * FROM products WHERE ?";
      connection.query(query, { item_id: productId }, function (err, res) {
        if (res.length === 0) { console.log("Product not found") }

        else {
          if (productQuantity <= parseInt(res[0].stock_quantity)) {
            let diff = parseInt(res[0].stock_quantity) - productQuantity;
            let totalCost = productQuantity * parseInt(res[0].price);
            let productSales = parseInt(res[0].product_sales) + totalCost;

            let query1 = "UPDATE products SET product_sales=" + productSales + " WHERE ?";
            connection.query(query1, { item_id: productId }, function (err, res) {
              console.log("Product sales were adjusted");
            })
            let query = "UPDATE products SET stock_quantity=" + diff + " WHERE ?";
            connection.query(query, { item_id: productId }, function (err, res) {
              console.log("Transaction went through");
              console.log("Total cost was : " + totalCost);
              displayAll();
              setTimeout(buyMe, 500);
            })
            console.log("Order was placed successfully");
          } else {
            console.log("Insufficient quantity!");
            displayAll();
            setTimeout(buyMe, 500);
          }
        }
      });
    });
}