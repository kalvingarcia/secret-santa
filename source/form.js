async function submit() {
    const urls = await fetch("/public/urls.json", {cache: "no-cache"}).then(response => response.json());
    const username = document.getElementById("username-select").value;
    const wishlist = {
        "name": username,
        "items": []
    };
    const wishlistItems = document.getElementsByClassName("wishlist-form-item");
    for(const item of wishlistItems) {
        wishlist.items.push({
            "name": item.getElementsByClassName("wishlist-form-item-name")[0].value,
            "description": item.getElementsByClassName("wishlist-form-item-description")[0].value,
            "link": item.getElementsByClassName("wishlist-form-item-link")[0].value
        });
    }

    console.log(wishlist);

    fetch(urls[username], {
        method: 'PUT',
        body: JSON.stringify(wishlist),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(() => {
        const wishlist = document.getElementById("wishlist");
        wishlist.className = wishlist.className.replace(" show", "");

        const assignment = document.getElementById("assignment");
        assignment.className += " show"
    }).catch(error => {
        prompt('Hubo un error! Contacta al administativo con estos detalles:', error);
    });
}

const itemList = document.getElementById("wishlist-form-items");
function addItem() {
    if(itemList.getElementsByClassName("wishlist-form-item").length >= 3)
        return;

    const item = document.createElement("div");
    item.className = "wishlist-form-item";

    const itemName = document.createElement("input");
    itemName.type = "text";
    itemName.className = "wishlist-form-item-name";
    itemName.placeholder = "Nombre de producto";
    item.append(itemName);

    const itemDescription = document.createElement("textarea");
    itemDescription.className = "wishlist-form-item-description";
    itemDescription.placeholder = "Descripción de producto y/o donde comprarlo";
    item.append(itemDescription);

    const itemLink = document.createElement("input");
    itemLink.type = "text";
    itemLink.className = "wishlist-form-item-link";
    itemLink.placeholder = "Link al producto";
    item.append(itemLink);

    itemList.append(item);
}
addItem();

// SCOPED NAME SPACE
{
    const YEAR = 2025;

    const nameSelect = document.getElementById("username-select");
    const defaultValue = nameSelect.value; //  getCookie("secretSantaUsername")??

    const username = document.getElementById("username"); // SLIDE 1
    const wishlist = document.getElementById("wishlist"); // SLIDE 2
    const assignment = document.getElementById("assignment"); // SLIDE 3

    document.getElementById("username-select").addEventListener("input", (event) => {
        const selectedUsername = event.target.value;
        username.className = username.className.replace(" show", "");

        fetch(`https://s3.secret-santa.kalv.io/${YEAR}/${selectedUsername}.json`, {method: "GET", cache: "no-cache"})
            .then(response => response.json())
            .then(() => assignment.className += " show")
            .catch(() =>  wishlist.className += " show");
    });

    // COOKIED VISIT
    if(defaultValue !== "") {
        username.className = username.className.replace(" show", "");
        fetch(`https://s3.secret-santa.kalv.io/${YEAR}/${defaultValue}.json`, {method: "GET", cache: "no-cache"})
            .then(response => response.json())
            .then(() => assignment.className += " show")
            .catch(() =>  wishlist.className += " show");
    }
}