'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Stiven',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

////////////////////////// UserNames ///////////////////////

function userData(user) {
  accounts.forEach(function (accs) {
    accs.userName = accs.owner
      .toLocaleLowerCase()
      .split(` `)
      .map(function (name) {
        return name[0];
      })
      .join(``);
  });
}
userData(accounts);

//////////////////////////////////////////

function movementsData(movements) {
  containerMovements.innerHTML = ``;
  for (let i = 0; i < movements.length; i++) {
    let element = movements[i];
    const type = element > 0 ? `deposit` : `withdrawal`;
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}"> ${i + 1} ${
      ` ` + type
    }</div>
      <div class="movements__value">${element}€</div>
  </div>
    `;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  }
}

function calcPrintBalance(acc) {
  acc.balance = acc.movements.reduce(function (acc, move) {
    return acc + move;
  }, 0);
  labelBalance.textContent = `${acc.balance}€`;
}

function calcDisplaySummary(acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * (acc.interestRate / 100))
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
}

//////////////
function uiDisplay(acc) {
  movementsData(acc.movements);
  /// Balance Label
  calcPrintBalance(acc);
  /// Summary Label
  calcDisplaySummary(acc);

  document.querySelector(`.users`).style.opacity = 0;
}
/*
const deposits = account1.movements.filter(function (dep) {
  return dep > 0;
});
console.log(deposits);

const withdrawals = account1.movements.filter(function (wit) {
  return wit < 0;
});
console.log(withdrawals);



function calcAverageHumanAge(ages) {
  const humanAges = ages.map(function (as) {
    return as <= 2 ? 2 * as : 16 + as * 4;
  });
  const adultDogs = humanAges.filter(function (as) {
    return as >= 18;
  });
  const average = adultDogs.reduce(function (acc, as) {
    const result = acc + as / adultDogs.length;
    return result;
  }, 0);
  console.log(humanAges);
  console.log(adultDogs);
  console.log(average);
}

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

function eurToUsd(movements) {
  const eurToUsd = 1.1;
  const totalDepisitsUSD = movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (mov) {
      return mov * eurToUsd;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);
  console.log(totalDepisitsUSD);
}

eurToUsd(account2.movements);
*/
let currentAccount;

btnLogin.addEventListener(`click`, function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (currentAccount.pin === Number(inputLoginPin.value)) {
    ///Welcome Label

    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(` `)[0]
    }`;
    /// Opacity
    containerApp.style.opacity = 100;

    ///Clear input fields
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur();
    ///Movment Label

    uiDisplay(currentAccount);
  } else if (currentAccount.pin != Number(inputLoginPin.value)) {
  }
});

///// Transfer
btnTransfer.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(function (acc) {
    return acc.userName === inputTransferTo.value;
  });
  inputTransferTo.value = inputTransferAmount.value = ``;
  inputTransferAmount.blur();
  if (currentAccount.balance > amount && amount > 0) {
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    uiDisplay(currentAccount);
  }
});

btnClose.addEventListener(`click`, function (e) {
  e.preventDefault();
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.userName === currentAccount.userName;
    });
    containerApp.style.opacity = 0;
    accounts.splice(index, 1);
  }
  inputCloseUsername.value = inputClosePin.value = ``;
  inputClosePin.blur();
});

btnLoan.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(function (mov) {
      return mov >= amount * 0.1;
    })
  ) {
    currentAccount.movements.push(amount);
    uiDisplay(currentAccount);
  }
  inputLoanAmount.value = ``;
  inputLoanAmount.blur();
});
