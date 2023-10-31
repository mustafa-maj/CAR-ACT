// authDB is the database name
const db=openDatabase("authDB","1.0","authDB",65535);

// creating the database table (for testing purposes only)
$("#create").click(function(){
  db.transaction(function(transaction){
      var sql="CREATE TABLE auth "+
      "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
      "username VARCHAR(100) NOT NULL,"+
      "hash INTEGER NOT NULL)";
      transaction.executeSql(sql,undefined,function(){
          alert("Table is created successfully");
      },function(){
          alert("Table is already being created");
      })
  });
  });

// deleting the database table (for testing purposes only)
$("#remove").click(function(){
  if(!confirm("Are you sure to delete this table?","")) return;;
  db.transaction(function(transaction){
      var sql="DROP TABLE auth";
      transaction.executeSql(sql,undefined,function(){
          alert("Table is deleted successfully")
      },function(transaction,err){
          alert(err.message);
      })
  });
  });

  
// for logging into the site
// checking whether the username and password enterred are correct
$("#login").click(function(){
  var user=$("#user").val();
  var pass=$("#pass").val();
  db.transaction(function(transaction){
      var sql="SELECT * FROM auth ORDER BY id DESC";
      transaction.executeSql(sql,undefined,function(transaction,result){
  if(result.rows.length){
  var status = false;
  for(var i=0;i<result.rows.length;i++){
      var row=result.rows.item(i);
      var userN=row.username;
      var hash=row.hash;
      if(userN == user){
          var actualPass=myTable.getItem(userN);
          console.log(actualPass)
          if(actualPass == pass){
              status = true;
              window.location.href = 'selector.html';
          }
      }
  }
  if(status === false){
  setError(login, 'Either username or password not correct.');
  }}}, function(transaction,err){
              alert('No table found. Click on "Create Table" to create table now');
          })
      })})

// function to add username and password into the database
function confirm(){
    var user=$("#username").val();
    var pass=$("#password").val();
    myTable.setItem(user, pass);
    var hash=myTable.getItem(user);
    db.transaction(function(transaction){
    var sql="INSERT INTO auth(username,hash) VALUES(?,?)";
    transaction.executeSql(sql, [user, hash], function(){
      window.location.href = 'selector.html';
    },function(transaction,err){
        alert(err.message);
    })
    })
    }

// function adding all usernames into a binary tree
function addTree(){
  db.transaction(function(transaction){
      var sql="SELECT * FROM auth ORDER BY id DESC";
      transaction.executeSql(sql,undefined,function(transaction,result){
  if(result.rows.length){
  for(var i=0;i<result.rows.length;i++){
      var row=result.rows.item(i);
      var user=row.username;
      var pass=row.hash;
      userTree.insert(user);
  }}}, 
  function(transaction,err){
              alert('No table found. Click on "Create Table" to create table now');
          })
      })}

// defines the properties of a node that will be in the binary tree 
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// class that captures the attributes and methods of a binary search tree
class BinarySearchTree {
  constructor() {
    this.root = null; // The root of the tree
  }

  // adds a new node into the tree 
  insert(value) {
    const newNode = new Node(value); // Create a new node with the given value
    // If the tree is empty, set the new node as the root
    if (this.root === null) {
      this.root = newNode;
      return this;
    }
    let currentNode = this.root;// Start at the root
    // Traverse the tree until we find the correct spot for the new node
    while (true) {
       // If the value is less than the current node, move left
      if (value < currentNode.value) {
        // If there is no left child, insert the new node as the left child
        if (currentNode.left === null) {
          currentNode.left = newNode;
          return this;
        }
        currentNode = currentNode.left;  // Otherwise, continue traversing left
      }  
      // If the value is greater than or equal to the current node, move right
      else {
        // If there is no right child, insert the new node as the right child
        if (currentNode.right === null) {
          currentNode.right = newNode;
          return this;
        }
        currentNode = currentNode.right; // Otherwise, continue traversing right
      }
    }
  }

  // checks if a given node is in the tree and returns true if it is
  find(value) {
    if (this.root === null) return false;
    let currentNode = this.root;
    // Traverse the tree until we find the value or reach the end
    while (currentNode) {
      // If the value is less than the current node, move left
      if (value < currentNode.value) {
        currentNode = currentNode.left;
      }
      // If the value is greater than the current node, move right
      else if (value > currentNode.value) {
        currentNode = currentNode.right;
      } 
      // The only case left is the the item has been found if none of the cases above me so we return true
      else {
        return true;
      }
    }
    // If we didn't find the value, return false
    return false;
  }
}


// a hashing function that takes a string and computes a hash based upon the table size
function hashStringToInt(s, tableSize) {
  let hash = 17;

  for (let i = 0; i < s.length; i++) {
    hash = (13 * hash * s.charCodeAt(i)) % tableSize;
  }

  return hash;
}

// creating a hash table that is based upon an array 
class HashTable {
  table = new Array(3333); // 
  numItems = 0;

  resize = () => {
    const newTable = new Array(this.table.length * 2);
    this.table.forEach(item => {
      if (item) {
        item.forEach(([key, value]) => {
          const idx = hashStringToInt(key, newTable.length);
          if (newTable[idx]) {
            newTable[idx].push([key, value]);
          } else {
            newTable[idx] = [[key, value]];
          }
        });
      }
    });
    this.table = newTable;
  };

  setItem = (key, value) => {
    this.numItems++;
    const loadFactor = this.numItems / this.table.length;
    if (loadFactor > 0.8) {
      // resizing the hash table to avoid collisions
      this.resize();
    }

    const idx = hashStringToInt(key, this.table.length);
    if (this.table[idx]) {
      this.table[idx].push([key, value]);
    } else {
      this.table[idx] = [[key, value]];
    }
  };

  getItem = key => {
    const idx = hashStringToInt(key, this.table.length);

    if (!this.table[idx]) {
      return null;
    }

    // O(n) complexity
    return this.table[idx].find(x => x[0] === key)[1];
  };
}

// declaring constants to be used throughout the code 
const form = document.getElementById('form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const login = document.getElementById('login');

// creating an instance of a HashTable
const myTable = new HashTable();

// creating an instance of a Binary Search Tree
const userTree = new BinarySearchTree();
addTree();

// checking if user has clicked any button
form.addEventListener('submit', e => {
    e.preventDefault();
    validateInputs();
});

// changing the elements class name from success to error
const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

// changing the elements class name from error to success
const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

// for registration page
// checking if the username and password match the defined criteria
const validateInputs = () => {
    if(typeof(username) != 'undefined' && username != null){
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();
    const allSuccess = [];

    // username can not be left blank and should not be already taken
    if(usernameValue === '') {
        setError(username, 'Username is required');
        allSuccess.push("fail");
    } else if (userTree.find(usernameValue) === true) {
        setError(username, 'Username already exists')
        allSuccess.push("fail");
    } else {
        setSuccess(username);
        allSuccess.push("pass");
    }

    // password can not be left blank and must be atleast 8 characters long
    if(passwordValue === '') {
        setError(password, 'Password is required');
        allSuccess.push("fail");
    } else if (passwordValue.length < 8 ) {
        setError(password, 'Password must be at least 8 character.')
        allSuccess.push("fail");
    } else {
        setSuccess(password);
        allSuccess.push("pass");
    }

    // password confirmation can not be left blank and must match the inputted password
    if(password2Value === '') {
        setError(password2, 'Please confirm your password');
        allSuccess.push("fail");
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords doesn't match");
        allSuccess.push("fail");
    } else {
        setSuccess(password2);
        allSuccess.push("pass");
    }

    // ensuring that all issues are resolved before adding the username and password into database
    let count = 0;
    for (i = 0; i < allSuccess.length; i++) {
        if (allSuccess[i] == "pass") {
            count++;
        }
        if (count == allSuccess.length) {
            myTable.setItem(username.value.trim(),password.value.trim());
            console.log(myTable.table);
            confirm()
        }
      } 
    }
};