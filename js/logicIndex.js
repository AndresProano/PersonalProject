//Interface logic

const buttonKitchen = document.getElementById("buttonKitchen");
const BotonLiving = document.getElementById("BotonLiving");

if (buttonKitchen) {
    buttonKitchen.addEventListener("click", () => {
        window.location.href = "kitchen.html";
    });
}

if (BotonLiving) {
    BotonLiving.addEventListener("click", () => {
        window.location.href = "living.html";
    });
}