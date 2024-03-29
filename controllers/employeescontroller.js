// const data = {}
// data.employees = require('../model/employees.json')
const path = require('path')
const fsPromises = require('fs').promises;
const data = {
  employees: require('../model/employees.json'),
  setEmployees: function (data) {this.employees = data}
}

const getAllEmployees = (req, res) => {  //Send data from database
  res.json(data.employees);
}

const createNewEmployee = (req, res) => {  //insert new data to database
  const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1, // Create ID
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }
  if(!newEmployee.firstname || !newEmployee.lastname) {
    return res.status(400).json({'message': 'First and Last name are requred'});
  }
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
  fsPromises.writeFile(path.join(__dirname, '..', 'model', 'employees.json'), JSON.stringify(data.employees));
  console.log(data.employees)

}
 
const updateEmployee = (req, res) => {  // Update data to database
  const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
  if(!employee) {
    return res.status(400).json({"message": `Employee ID ${req.body.id} is not found`});
  }
  if(req.body.firstname) {employee.firstname = req.body.firstname;}
  if(req.body.lastname) {employee.lastname = req.body.lastname;}
  const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
  const unsortedArray = [...filteredArray, employee];
  data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
  res.json(data.employees);
  fsPromises.writeFile(path.join(__dirname, '..', 'model', 'employees.json'), JSON.stringify(data.employees));
  console.log(data.employees)
}

const deleteEmployee = (req, res) => {  // Delete data from database
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));
    if(!employee) {
      return res.status(400).json({"message": `Employee ID ${req.body.id} is not found`});
    }
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees([...filteredArray]);
    res.json(data.employees);
    fsPromises.writeFile(path.join(__dirname, '..', 'model', 'employees.json'), JSON.stringify(data.employees));
    console.log(data.employees)
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));
    if(!employee) {
      return res.status(400).json({"message": `Employee ID ${req.emp.id} is not found`});
    }
    res.json(employee);
};

  module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
  }
