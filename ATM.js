const prompt = require("prompt-sync")({sigint:true});
const fs = require('fs');
const readline = require('readline-sync');

const customersDataFile = 'customers.json';

// Load customers' data from JSON file
let customersData = [];
try {
  const data = fs.readFileSync(customersDataFile, 'utf8');
  customersData = JSON.parse(data);
} catch (err) {
  console.log('Error reading customers data file:', err.message);
}

// Function to save customers' data to JSON file
function saveCustomersData() {
  try {
    const data = JSON.stringify(customersData, null, 2);
    fs.writeFileSync(customersDataFile, data);
  } catch (err) {
    console.log('Error saving customers data:', err.message);
  }
}

// Function to generate a random customer ID
function generateCustomerId() {
  return Math.floor(Math.random() * 1000000);
}

// Function to log in a customer
function logIn() {
  console.log('\n=== Log In ===');
  const customerId = parseInt(readline.question('Enter your customer ID: '));
  const pin = parseInt(readline.question('Enter your PIN: '));

  const customer = customersData.find((c) => c.id === customerId && c.pin === pin);
  if (customer) {
    console.log(`\nWelcome, ${customer.name}!`);
    return customer;
  } else {
    console.log('\nInvalid customer ID or PIN. Please try again.');
    return null;
  }
}

// Function to log out the current customer
function logOut() {
  console.log('\nLogged out successfully.');
}

// Function to withdraw money
function withdrawMoney(customer) {
  console.log('\n=== Withdraw Money ===');
  const amount = parseFloat(readline.question('Enter the amount to withdraw: '));
  if (isNaN(amount) || amount <= 0) {
    console.log('\nInvalid amount. Please try again.');
    return;
  }
  if (amount > customer.balance) {
    console.log('\nInsufficient balance.');
    return;
  }
  customer.balance -= amount;
  saveCustomersData();
  console.log(`\nWithdrawal of ${amount} Naira successful.`);
  console.log(`Remaining balance: ${customer.balance} Naira.`);
  printReceipt(customer, 'Withdrawal', amount);
}

// Function to deposit money
function depositMoney(customer) {
  console.log('\n=== Deposit Money ===');
  const amount = parseFloat(readline.question('Enter the amount to deposit: '));
  if (isNaN(amount) || amount <= 0) {
    console.log('\nInvalid amount. Please try again.');
    return;
  }
  customer.balance += amount;
  saveCustomersData();
  console.log(`\nDeposit of ${amount} Naira successful.`);
  console.log(`Remaining balance: ${customer.balance} Naira.`);
  printReceipt(customer, 'Deposit', amount);
}

// Function to transfer airtime
function transferAirtime(customer) {
  console.log('\n=== Transfer Airtime ===');
  const provider = readline.question(
    'Select the mobile network provider (MTN, AIRTEL, 9 Mobile, GLO): '
  );
  const amount = parseFloat(readline.question('Enter the airtime amount: '));
  if (isNaN(amount) || amount <= 0) {
    console.log('\nInvalid amount. Please try again.');
    return;
  }
  if (amount > customer.balance) {
    console.log('\nInsufficient balance.');
    return;
  }
  customer.balance -= amount;
  saveCustomersData();
  console.log(`\nAirtime transfer of ${amount} Naira to ${provider} successful.`);
  console.log(`Remaining balance: ${customer.balance} Naira.`);
  printReceipt(customer, 'Airtime Transfer', amount);
}

// Function to transfer money
function transferMoney(customer) {
  console.log('\n=== Transfer Money ===');
  const bankName = readline.question(
    'Enter the recipient bank name (First Bank, Zenith Bank, Access Bank, Gtb Bank, Opay, PalmPay, Fcmb): '
  );
  const amount = parseFloat(readline.question('Enter the transfer amount: '));
  if (isNaN(amount) || amount <= 0) {
    console.log('\nInvalid amount. Please try again.');
    return;
  }
  if (amount > customer.balance) {
    console.log('\nInsufficient balance.');
    return;
  }
  customer.balance -= amount;
  saveCustomersData();
  console.log(`\nMoney transfer of ${amount} Naira to ${bankName} successful.`);
  console.log(`Remaining balance: ${customer.balance} Naira.`);
  printReceipt(customer, 'Money Transfer', amount);
}

// Function to create or change the bank PIN
function changePin(customer) {
  console.log('\n=== Change Bank PIN ===');
  const oldPin = parseInt(readline.question('Enter your current PIN: '));
  if (oldPin !== customer.pin) {
    console.log('\nInvalid PIN. Please try again.');
    return;
  }
  const newPin = parseInt(readline.question('Enter your new PIN: '));
  const confirmNewPin = parseInt(readline.question('Confirm your new PIN: '));
  if (newPin !== confirmNewPin) {
    console.log('\nPIN confirmation does not match. PIN change aborted.');
    return;
  }
  customer.pin = newPin;
  saveCustomersData();
  console.log('\nPIN change successful.');
}

// Function to print a receipt
function printReceipt(customer, transactionType, amount) {
  console.log('\nPrinting receipt...');
  console.log('========================================');
  console.log('              TRANSACTION RECEIPT');
  console.log('========================================');
  console.log(`Customer ID: ${customer.id}`);
  console.log(`Name: ${customer.name}`);
  console.log(`Transaction Type: ${transactionType}`);
  console.log(`Amount: ${amount} Naira`);
  console.log(`Remaining Balance: ${customer.balance} Naira`);
  console.log('========================================');
}

// Function to create a new bank account
function createBankAccount() {
  console.log('\n=== Create Bank Account ===');
  const name = readline.question('Enter your full name: ');
  const bank = readline.question(
    'Enter the bank name (GTB Bank, Zenith Bank, First Bank, Access Bank, Opay, Palmpay, Fidelity, Fcmb): '
  );
  const depositAmount = parseFloat(
    readline.question('Enter the initial deposit amount (minimum 20,000 Naira): ')
  );
  if (isNaN(depositAmount) || depositAmount < 20000) {
    console.log('\nInvalid deposit amount. Minimum deposit amount is 20,000 Naira.');
    return;
  }

  const customerId = generateCustomerId();
  const pin = parseInt(readline.question('Create a PIN for your bank account: '));

  const newCustomer = {
    id: customerId,
    name: name,
    bank: bank,
    balance: depositAmount,
    pin: pin
  };

  customersData.push(newCustomer);
  saveCustomersData();
  console.log('\nBank account created successfully.');
  console.log(`Your Customer ID: ${customerId}`);
}

// Function to display the main menu
function displayMainMenu() {
  console.log('\n=== Main Menu ===');
  console.log('1. Log In');
  console.log('2. Create Bank Account');
  console.log('3. Exit');
  const choice = parseInt(readline.question('Enter your choice: '));

  switch (choice) {
    case 1:
      const customer = logIn();
      if (customer) {
        displayCustomerMenu(customer);
      } else {
        displayMainMenu();
      }
      break;
    case 2:
      createBankAccount();
      displayMainMenu();
      break;
    case 3:
      console.log('\nThank you for using the ATM. Goodbye!');
      break;
    default:
      console.log('\nInvalid choice. Please try again.');
      displayMainMenu();
      break;
  }
}

// Function to display the customer menu
function displayCustomerMenu(customer) {
  console.log('\n=== Customer Menu ===');
  console.log('1. Withdraw Money');
  console.log('2. Deposit Money');
  console.log('3. Transfer Airtime');
  console.log('4. Transfer Money');
  console.log('5. Change Bank PIN');
  console.log('6. Log Out');
  const choice = parseInt(readline.question('Enter your choice: '));

  switch (choice) {
    case 1:
      withdrawMoney(customer);
      displayCustomerMenu(customer);
      break;
    case 2:
      depositMoney(customer);
      displayCustomerMenu(customer);
      break;
    case 3:
      transferAirtime(customer);
      displayCustomerMenu(customer);
      break;
    case 4:
      transferMoney(customer);
      displayCustomerMenu(customer);
      break;
    case 5:
      changePin(customer);
      displayCustomerMenu(customer);
      break;
    case 6:
      logOut();
      displayMainMenu();
      break;
    default:
      console.log('\nInvalid choice. Please try again.');
      displayCustomerMenu(customer);
      break;
  }
}

// Start the ATM machine
console.log('=== Welcome to the ATM ===');
displayMainMenu();
