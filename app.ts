#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
//bank account interface
interface BankAccount {
  accountNumber: number;
  balance: number;
  withdraw(amount: number): void;
  deposite(amount: number): void;
  CheckBalance(): void;
}

//bank account class
class BankAccount implements BankAccount {
  accountNumber: number;
  balance: number;

  constructor(accountNumber: number, balance: number) {
    this.accountNumber = accountNumber;
    this.balance = balance;
  }
  //debit money
  withdraw(amount: number): void {
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log(chalk.yellowBright(
        `Withdrawl of $${amount} successful. Remaining balance: $${this.balance}`
      ));
    } else {
      console.log(chalk.redBright("Insufficient balance"));
    }
  }
  //credit money
  deposite(amount: number): void {
    if (amount > 100) {
      amount -= 1; //$1 fee charge if more than $100 is deposited.
    }
    this.balance += amount;
    console.log(chalk.yellowBright(
      `Deposite of $${amount} successful. Remaining balance: $${this.balance}`
    ));
  }
  //check balance
  CheckBalance(): void {
    console.log(chalk.yellowBright(`Current balance $${this.balance}`));
  }
}
//customer class
class Customer {
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  mobileNumber: number;
  account: BankAccount;
  constructor(
    firstName: string,
    lastName: string,
    gender: string,
    age: number,
    mobileNumber: number,
    account: BankAccount
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.age = age;
    this.mobileNumber = mobileNumber;
    this.account = account;
  }
}

//create bank accounts

const accounts: BankAccount[] = [
  new BankAccount(1001, 500),
  new BankAccount(1002, 1000),
  new BankAccount(1003, 2000),
];

//create costumers
const customers: Customer[] = [
  new Customer("Hamza", "Khan", "Male", 35, 3162223334, accounts[0]),
  new Customer("Hira", "ahsan", "Female", 25, 3097245039, accounts[1]),
  new Customer("fizza", "mohsin", "Female", 31, 3420970024, accounts[2]),
];

//function to interact with bank account
async function service() {
  do {
    const accountNumberInput = await inquirer.prompt({
      name: "accountNumber",
      type: "number",
      message:chalk.greenBright( "Enter your account Number:"),
    });

    const costumer = customers.find(
      (customer) =>
        customer.account.accountNumber === accountNumberInput.accountNumber
    );
    if (costumer) {
      console.log(chalk.magentaBright(`Welcome, ${costumer.firstName} ${costumer.lastName}!\n`));
      const ans = await inquirer.prompt([
        {
          name: "select",
          type: "list",
          message: chalk.greenBright("Select an operation"),
          choices: ["Deposite", "Withdraw", "Check Balance", "Exit"],
        },
      ]);

      switch (ans.select) {
        case "Deposite":
          const depositAmount = await inquirer.prompt({
            name: "amount",
            type: "number",
            message: chalk.greenBright("Enter the amount to deposit:"),
          });
          costumer.account.deposite(depositAmount.amount);
          break;
        case "Withdraw":
          const withdrawAmount = await inquirer.prompt({
            name: "amount",
            type: "number",
            message:chalk.greenBright( "Enter the amount to withdraw:"),
          });
          costumer.account.withdraw(withdrawAmount.amount);
          break;
        case "Check Balance":
          costumer.account.CheckBalance();
          break;
        case "Exit":
          console.log(chalk.redBright("Exiting bank program..."));
          console.log(chalk.blueBright(
            "\n Thank you for using our bank services. Have a great day!"
          ));
          return;
      }
    }else{
        console.log(chalk.redBright("Invalid account number. Please try again."));
        
    }
  } while (true);
}
service()