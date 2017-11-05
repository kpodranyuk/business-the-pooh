export function sayHiUser() {
    alert("Hello, user!");
};

// По загрузке документа заполняем элементы, отображающие информацию о пользователе
$(document).ready(function(){
       // TODO установить информацию о пользователе
       // TODO сделать функцию для работы с localStorage
       var a = [];
       // Проверяем работу localStorage
       a = JSON.parse(localStorage.getItem('currentUser'));
       console.log(a.name);
});