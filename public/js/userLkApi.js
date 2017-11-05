export function sayHiUser() {
    alert("Hello, user!");
};

// По загрузке документа заполняем элементы, отображающие информацию о пользователе
$(document).ready(function(){
       // TODO установить информацию о пользователе
       // TODO сделать функцию для работы с localStorage
       var curUser = [];
       // Проверяем работу localStorage.currentUser
       curUser = JSON.parse(localStorage.currentUser);
       console.log(curUser.name);
       // userImage loginDropdown userTypeName productLabel honeyLabel
       // Устанавливаем изображение
       $("#userImage").attr("src",getUserImagePath(curUser.productType));
       // Устанавливаем логин
       $("#loginDropdown").text(curUser.login);
       // Устанавливаем тип пользователя и имя
       $("#userTypeName").text(translateTypeToString(curUser.productType)+" "+curUser.name);
       // Устанавливаем количество товара пользователя
       $("#productLabel").text(translateProductCountToRussian(curUser.productAmount, curUser.productType));
       // Устанавливаем количество меда пользователя
       $("#userTypeName").text(curUser.honeyAmount+" л меда");
});

function translateProductCountToRussian(count, userType){
    var countStr = count + '';
    var strlen = countStr.length;
    // 1 _
    // Если последняя цифра 1 и это не 11..
    if(countStr.charAt(countStr.length-1)==1 && countStr.endsWith("11")==false){
        if (userType == "B")
            return countStr+" шарик";
        if (userType == "P")
            return countStr+" горшочек";
        if (userType == "F")
            return countStr+" цветок";
    }
    // 2-4 а/чка/тка
    // Если последняя цифра 2-4 и это не 11-14..
    else if(countStr.charAt(countStr.length-1)==2 && countStr.endsWith("12")==false 
        || countStr.charAt(countStr.length-1)==3 && countStr.endsWith("13")==false
        || countStr.charAt(countStr.length-1)==4 && countStr.endsWith("14")==false){
        if (userType == "B")
            return countStr+" шарика";
        if (userType == "P")
            return countStr+" горшочка";
        if (userType == "F")
            return countStr+" цветка";
    }
    // 5-20 ов/чков/тков
    // Если последняя цифра 5-0...
    else{
        if (userType == "B")
            return countStr+" шариков";
        if (userType == "P")
            return countStr+" горшочков";
        if (userType == "F")
            return countStr+" цветков";
    }
}

function translateTypeToString(userType){
    if (userType == "B")
        return "Пятачок";
    if (userType == "P")
        return "Совунья";
    if (userType == "F")
        return "Кролик";
    if (userType == "H")
        return "Винни Пух";
}

function getUserImagePath(userType){
    if (userType == "B")
        return "images/users/pig.png";
    if (userType == "P")
        return "images/users/owl.png";
    if (userType == "F")
        return "images/users/rabbit.png";
    if (userType == "H")
        return "images/pooh.png";
}