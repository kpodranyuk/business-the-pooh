var acc_bttn = document.querySelector("#cont");
console.log(acc_bttn)
acc_bttn.onclick=function(event){
    $('#pills a[href="#trueAcc"]').tab('show')
}