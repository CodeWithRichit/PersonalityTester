document.getElementById("btn1").addEventListener("click",function(){
    localStorage.setItem("testType","16personalities");
    window.location.href="quiz.html";
})
document.getElementById("btn2").addEventListener("click",function(){
    localStorage.setItem("testType","big5")
    window.location.href="quiz.html";
})