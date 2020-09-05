'use strict';
const username = document.getElementById('username'),
    registerUser = document.getElementById('registerUser'),
    login = document.getElementById('login'),
    list = document.getElementById('list');

let removeBtn;

const writeData = (date) => {
  return date.toLocaleString('ru', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) + ', ' + date.toLocaleTimeString();
};

const getName = function() {
    const reg = /^([а-яё]+)\s([а-яё]+)$/ig;
    let userName;
    do {
      userName = prompt('Введите через пробел Имя и Фамилию пользователя');
      if (!userName) {
        return;
      }
    } while (!userName.match(reg));
    if (userName) {
      userName = userName.trim();
      return userName;
    }
};

class UserData {
  constructor() {
    this.user = [];
  }

  registerUser() {
    const name = getName();
    if (name) {
      const userName = name.split(' ');
      const date = new Date();
      let userLogin, userPass;
      do {
        userLogin = prompt('Введите логин');
      } while (userLogin.length === 0);
      do {
        userPass = prompt('Введите пароль');
      } while (userPass.length === 0);

      const newUser = {
        firstName: userName[0][0].toUpperCase() + userName[0].slice(1),
        lastName: userName[1][0].toUpperCase() + userName[1].slice(1),
        login: userLogin,
        password: userPass,
        regDate: writeData(date),
        key: this.generateKey()
      };

      this.user.push(newUser);
      this.saveUser();

      list.insertAdjacentHTML(
        'beforeend',
        `<li class="user-item" id = ${newUser.key}>
          <span>Имя: </span><span class = "first-name">${newUser.firstName}</span>
          <span>, фамилия: </span><span class = "last-name">${newUser.lastName}</span>
          <span>, зарегестрирован: </span><span class = "reg-date">${newUser.regDate}</span>
          <button class="delete-btn"><span class="fa fa-trash"></span></button>
          </li>`
      );
    }
  }

  generateKey() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  removeUser(target) {
    const elem = target.closest('.user-item');
    this.user.forEach((item, index) => {
      if (item.key === elem.id) {
        this.user.splice(index, 1);
      }
    });
    elem.remove();
    console.log(this.user);
    this.saveUser();
  }

  saveUser() {
    localStorage.clear();
    for (let key in this.user) {
      localStorage.setItem(key, JSON.stringify(this.user[key]));
    }
  }

  render() {
    for (let key in this.user) {
      list.insertAdjacentHTML(
        'beforeend',
        `<li class="user-item" id = ${this.user[key].key}>
          <span>Имя: </span><span class = "first-name">${this.user[key].firstName}</span>
          <span>, фамилия: </span><span class = "last-name">${this.user[key].lastName}</span>
          <span>, зарегестрирован: </span><span class = "reg-date">${this.user[key].regDate}</span>
          <button class="delete-btn"><span class="fa fa-trash"></span></button>
          </li>`
      );
    }
    this.saveUser();
  }

  getUser() {
    for (const key in Object.keys(localStorage)) {
      let item = JSON.parse(localStorage.getItem(key));
      if (item !== null && this.user.indexOf(item) === -1) {
        this.user.push(item);
      }
    }
  }

  userLogin() {
    let login = prompt('Введите логин'),
      password = prompt('Введите пароль');

    let isUser = false;

    this.user.forEach((item) => {
      if (item.login === login && item.password === password) {
        username.textContent = item.firstName;
        isUser = true;
      }
    });
    if (!isUser || this.user.length === 0) {
      alert('Такой пользователь не зарегестрирован');
    }
  }

  eventListeners() {
    registerUser.addEventListener('click', this.registerUser.bind(this));
    login.addEventListener('click', this.userLogin.bind(this));

    list.addEventListener('click', (event) => {
      const target = event.target;
      this.removeUser(target);
    });
  }
}

const userData = new UserData();
userData.getUser();
userData.render();
userData.eventListeners();

