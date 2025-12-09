const participants = [
    "Corali",
    "Marie",
    "Enid",
    "Joelli",
    "Samarie",
    "Elba",
    "Cecilio",
    "Bob",
    "Francis",
    "Paul",
    "Joel",
    "Kalvin",
    "Samantha"
];

const CHRISTMAS_DATE = 25122025;
/**
 *  djb2 hash function for strings.
 *  @param {string} str The input string.
 *  @returns {number} The generated hash value.
 */
function djb2(str) {
    let hash = 3; // Initial hash value (seed)
    for (let i = 0; i < str.length; i++) {
        // hash * 33 + char_code_at(i)
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        // In JavaScript, bitwise operations on 32-bit signed integers handle overflow naturally.
    }
    return Math.abs(hash);
}

function setCookie(cname, cvalue) {
    const now = new Date();
    now.setTime(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days in milliseconds
    const expires = "expires=" + now.toUTCString();

    // Set the cookie with a path attribute to make it available across the entire site
    document.cookie = `${cname}=${cvalue}; ${expires}; path=/`;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie); // Cookies are URL-encoded
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}

function generateItemList(items) {
    const itemBlocks = [];
    for(const item of items) {
        const itemBlock = document.createElement("div");
        itemBlock.className = "assignment-wishlist-item";

        const heading = document.createElement("span");
        heading.className = "subheading";
        heading.append(document.createTextNode(`Producto: `));
        itemBlock.append(heading);
        
        const itemName = document.createElement("span");
        itemName.append(document.createTextNode(item.name?? ""));
        itemBlock.append(itemName);

        const itemDescription = document.createElement("p");
        itemDescription.append(document.createTextNode(item.description?? ""));
        itemBlock.append(itemDescription);

        const itemLink = document.createElement("span");
        itemLink.append(document.createTextNode(item.link?? "No hay link disponible"));
        itemBlock.append(itemLink);

        itemBlocks.push(itemBlock);
    }
    return itemBlocks;
}

// SCOPED NAMESPACE
{
    const YEAR = 2025;

    let place = 0;
    const copyParticipants = participants.slice();
    const hashtable = {
        "": "Escoja su nombre"
    };
    const nameSelect = document.getElementById("username-select");
    while(copyParticipants.length > 0) {
        const participant = participants[place++];
        const filteredCopy = copyParticipants.filter(name => name != participant);
        hashtable[participant] = copyParticipants.splice(copyParticipants.indexOf(
            filteredCopy[ djb2(participant) % filteredCopy.length]
        ), 1)[0];

        const option = document.createElement("option");
        option.value = participant;
        option.append(document.createTextNode(participant));
        nameSelect.append(option);
    }
    const defaultValue = nameSelect.value; // getCookie("secretSantaUsername")??
    nameSelect.value = defaultValue;

    /**
     *  Setting the default value of the span
     */
    const assignmentName = document.getElementById("assignment-name");
    assignmentName.replaceChildren(document.createTextNode(hashtable[defaultValue]));

    /**
     *  Creating the event listener for when the selected name changes
     */
    nameSelect.addEventListener('input', (event) => {
        const username = event.target.value;
        const assignment = hashtable[username];
        assignmentName.replaceChildren(document.createTextNode(assignment));

        const assignmentWishlist = document.getElementById("assignment-wishlist");
        fetch(`https://s3.secret-santa.kalv.io/${YEAR}/${assignment}.json`, {method: "GET", cache: "no-cache"})
            .then(response => response.json())
            .then(json => {
                const itemBlocks = generateItemList(json.items);
                assignmentWishlist.replaceChildren(...itemBlocks);
            }).catch(() => assignmentWishlist.replaceChildren(document.createTextNode(`${assignment} no ha sobmetido su wishlist!`)));
        setCookie("secretSantaUsername", username);
    });

    // COOKIED VISIT
    const assignmentWishlist = document.getElementById("assignment-wishlist");
    fetch(`https://s3.secret-santa.kalv.io/${YEAR}/${hashtable[defaultValue]}.json`, {method: "GET", cache: "no-cache"})
        .then(response => response.json())
        .then(json => {
            const itemBlocks = generateItemList(json.items);
            assignmentWishlist.replaceChildren(...itemBlocks);
        }).catch(() => assignmentWishlist.replaceChildren(document.createTextNode(`${hashtable[defaultValue]} no ha sobmetido su wishlist!`)));
}