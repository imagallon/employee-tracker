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
        type: "input",
        message: "What is their role ID?",
      },
      {
        name: "managerID",
        type: "input",
        message: "Who is their manager?",
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
};
