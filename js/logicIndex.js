//Interface logic

const buttonKitchen = document.getElementById("buttonKitchen");
const buttonMoney = document.getElementById("buttonMoney");

if (buttonKitchen) {
    buttonKitchen.addEventListener("click", () => {
        window.location.href = "kitchen.html";
    });
}

if (buttonMoney) {
    buttonMoney.addEventListener("click", () => {
        window.location.href = "money.html";
    });
}