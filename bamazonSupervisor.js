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
          "View Product Sales by Department",
          "Create New Department"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View Product Sales by Department":
          viewSales();
          break;
  
        case "Create New Department":
          createDep();
          break;
        }
      });
  }



  function viewSales(){
      let query = `
        SELECT departments.department_id,departments.department_name,
        departments.over_head_costs, SUM(products.product_sales) AS prodsales, (SUM(products.product_sales)-departments.over_head_costs) AS total_profit
        FROM departments LEFT JOIN products ON products.department_name=departments.department_name
        GROUP BY departments.department_id
      `;

      connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log("Department id: " + res[i].department_id + " || Department name: " + res[i].department_name + " || Over Head Costs: " + res[i].over_head_costs + " || Prod sales: " + res[i].prodsales + " || Total Profit " + res[i].total_profit);
        }
      })

      setTimeout(runSearch,500);
  }


  function createDep(){
    inquirer
    .prompt([
    {
      name: "name",
      type: "input",
      message: "What will be a name of a new department?"
    
    },
    {
        name: "overhead",
        type: "input",
        message: "What will be over head cost for a new department?"
      
    }
])
    .then(function(answer) {

        let newName = answer.name;
        let newCost = parseInt(answer.overhead);

        let query = `
        INSERT INTO departments (department_name, over_head_costs)
        VALUES ("${newName}", ${newCost})
        `;
        connection.query(query, function(err,res){
            if (err) throw err;
            console.log("New department was successfully added!")
            setTimeout(runSearch,500);
        })

    })
  }
