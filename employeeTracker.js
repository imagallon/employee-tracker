const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "employee_trackerDB",
});

connection.connect((err) => {
  if (err) throw err;
  runEmployee();
});

const runEmployee = () => {
  const banner_wall = chalk.bold.blueBright(
    "\n=====================================================================================\n"
  );
  const banner_msg = chalk.bold.blue(figlet.textSync("Employee Tracker"));
  const app_author = chalk.bold.white(
    `\n\n                          Copyright @ 2021 by Israel Magallon\n`
  );
  console.log(banner_wall + banner_msg + app_author + banner_wall);
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Roles",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View All Employees by Department":
          viewDepartments();
          break;

        case "View All Employees by Roles":
          viewRoles();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update Employee":
          updateEmployee();
          break;

        case "Exit":
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const viewEmployees = () => {
  console.log("Viewing all Employees...\n");
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary, employee.manager_id 
   FROM employee, role, department;`,
    (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
    }
  );
  runEmployee();
};

const viewDepartments = () => {
  console.log("Viewing all Employees by Departments...\n");
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, department.department,
     employee.manager_id FROM employee join  department on employee.id = department.id;`,
    (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
    }
  );
  runEmployee();
};

const viewRoles = () => {
  console.log("Viewing all Employees by Roles...\n");
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, role.department_id,
     employee.manager_id FROM employee join role on employee.id = role.id;`,
    (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
    }
  );
  runEmployee();
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What Department would you like to Add?",
      },
    ])
    .then((answer) => {
      console.log("Adding Department...\n");
      const query = connection.query(
        `INSERT INTO department(department)
      VALUES ( "${answer.department}")`,

        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} Department Added!\n`);
          // Call updateProduct AFTER the INSERT completes
          runEmployee();
        }
      );
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is your Title?",
      },
      {
        name: "salary",
        type: "input",
        message: "Please enter salary for role",
      },
      {
        name: "department_id",
        type: "input",
        message: "What is the Department Code?",
      },
    ])
    .then((answer) => {
      const department = answer.department_id.split("");
      console.log("Adding role...\n");
      const query = connection.query(
        `INSERT INTO role(title, salary, department_id)
      VALUES (  "${answer.title}",
                ${answer.salary},
                ${answer.department_id}
                )`,

        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} Role Added!\n`);
          // Call updateProduct AFTER the INSERT completes
          runEmployee();
        }
      );
    });
};

const addEmployee = () => {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "first",
          type: "input",
          message: "What is the first name of your new employee?",
        },
        {
          name: "last",
          type: "input",
          message: "What is the last name of your new employee?",
        },
        {
          name: "roleID",
          type: "rawlist",
          choices: function () {
            // var choiceArray = [];
            // for (var i = 0; i < results.length; i++) {
            //   choiceArray.push(results[i].title);
            // }
            const roles = results.map( ({title, id}) => ({ name: title, value: id}) );

            return roles;
          },
          message: "What is the employee's role?",
        },
        {
          name: "managerID",
          type: "list",
          message: "Who is their manager?",
          choices: function () {
            connection.query("SELECT * FROM employee", function hello(err, results) {
              console.log(`results: ${results}`);
              if (err) throw err;
              const managers = results.map( ({ first_name, last_name, id }) => ({ name: `${first_name} ${last_name}`, value: id }) );

              return managers;
            }).then( () => hello());
          }
        },
      ])
      .then((answer) => {
        console.log("Adding a new Employee...\n");
        const query = connection.query(
          `INSERT INTO employee(first_name, last_name, role_id, manager_id)
        VALUES (  "${answer.first}",
                  "${answer.last}",
                  ${answer.roleID},
                  ${answer.managerID})`,

          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} Employee Added!\n`);
            // Call updateProduct AFTER the INSERT completes
            runEmployee();
          }
        );
      });
  });
};

// function addEmployee() {

//   connection.query("SELECT * FROM role", function (err, results) {
//       if (err) throw err;

//       inquirer.prompt([

//           {
//               type: "input",
//               name: "firstname",
//               message: "What is the employee's first name?"
//           },
//           {
//               type: "input",
//               name: "lastname",
//               message: "What is the employee's last name?"
//           },
//           {
//               name: "choice",
//               type: "rawlist",
//               choices: function () {
//                   var choiceArray = [];
//                   for (var i = 0; i < results.length; i++) {
//                       choiceArray.push(results[i].title);
//                   }

//                   return choiceArray;
//               },
//               message: "What is the employee's role?"
//           },

//           {
//               type: "input",
//               name: "manager",
//               message: "What is the employee's manager?"
//           }

//       ]).then(function (res) {

//           for (var i = 0; i < results.length; i++) {
//               if (results[i].title === res.choice) {
//                   res.role_id = results[i].id;
//               }
//           }
//           var query = "INSERT INTO employee SET ?"
//           const VALUES = {
//               first_name: res.firstname,
//               last_name: res.lastname,
//               role_id: res.role_id
//               // manager_id: employee(id)
//           }
//           connection.query(query, VALUES, function (err) {
//               if (err) throw err;
//               console.log("Employee successfully added!");
//               determineAction()
//           }

//           )
//       })
//   })

// }

// const bidAuction = () => {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", (err, results) => {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     const choiceArray = results.map((row) => row.item_name);
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: choiceArray,
//           message: "What auction would you like to place a bid in?",
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?",
//         },
//       ])
//       .then((answer) => {
//         // get the information of the chosen item
//         let chosenItem;
//         console.log(results);
//         results.forEach((item) => {
//           if (item.item_name === answer.choice) {
//             chosenItem = item;
//           }
//         });

//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid,
//               },
//               {
//                 id: chosenItem.id,
//               },
//             ],
//             (error) => {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         } else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
//
