/*
        // THIS IS MODIFIED FROM THE GUIDE BELOW TO USE CATBOX INSTEAD OF IMGUR BECAUSE IMGUR'S API SEEMS TO BE BROKEN?
        FILL IN THESE VARIABLES BASED ON THE GUIDE AT https://drawbox.nekoweb.org
        
        
				      /`·.¸
				     /¸...¸`:·
				 ¸.·´  ¸   `·.¸.·´)
				: © ):´;      ¸  {
				 `·.¸ `·  ¸.·´\`·¸)
				     `\\´´\¸.·´
        
*/

const GOOGLE_FORM_ID = "1FAIpQLSfyZr76-7Is__1EJvgdjch0erwJFTJ1qbFGTKBCLHnjyK4w9w";
const ENTRY_ID = "entry.1582693999";
const GOOGLE_SHEET_ID = "1PTwc0vsYHr296ycg0H76b4QWdgvCkN-oz_1co_rqO-c";
const DISPLAY_IMAGES = true;

/*
        
        DONT EDIT BELOW THIS POINT IF YOU DONT KNOW WHAT YOU ARE DOING.
        
*/

function eO(input) {
  if (typeof input !== "string") {
    throw new TypeError("eO: input must be a string");
  }

  const rvd = Array.from(input).reverse().join("");
  const bytes = new TextEncoder().encode(rvd);

  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }

  return btoa(hex);
}

function dO(encoded) {
  if (typeof encoded !== "string") {
    throw new TypeError("dO: encoded must be a string");
  }

  let hex;
  try {
    hex = atob(encoded);
  } catch {
    throw new Error("dO: invalid base64 input");
  }

  if (hex.length % 2 !== 0 || /[^0-9a-fA-F]/.test(hex)) {
    throw new Error("dO: decoded base64 is not valid hex");
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0, j = 0; i < hex.length; i += 2, j++) {
    bytes[j] = parseInt(hex.slice(i, i + 2), 16);
  }

  const rvd = new TextDecoder().decode(bytes);

  return Array.from(rvd).reverse().join("");
}

const IMG_MODE = "IMGBB"; // "CATBOX" | "IMGBB" | "IMGUR"
const IMGBBAPIK = "NjUzMzMzMzY2MjMyMzYzNjY2MzYzNjMyNjIzNDMxMzczNzM0NjQzMjM1NjYzMzY1MzAzMjM3Mzg2MTM3NjIzMg=="
const CATBOX_UH = "MzgzNDM0MzEzMDY0Mzk2MzM3MzA2MTM0MzUzODMyMzgzMDMwMzE2MjY0MzkzOTMyMzI=";
const CLIENT_ID = "b4fb95e0edc434c";
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/" + GOOGLE_SHEET_ID + "/export?format=csv";
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/" + GOOGLE_FORM_ID + "/formResponse";

let canvas = document.getElementById("drawboxcanvas");
let context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

let restore_array = [];
let start_index = -1;
let stroke_color = "black";
let stroke_width = "2";
let is_drawing = false;

function change_color(element) {
  stroke_color = element.style.background;
}

function start(event) {
  is_drawing = true;
  context.beginPath();
  context.moveTo(getX(event), getY(event));
  event.preventDefault();
}

function draw(event) {
  if (!is_drawing) return;
  context.lineTo(getX(event), getY(event));
  context.strokeStyle = stroke_color;
  context.lineWidth = stroke_width;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();
  event.preventDefault();
}

function stop(event) {
  if (!is_drawing) return;
  context.stroke();
  context.closePath();
  is_drawing = false;
  restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
  start_index++;
  event.preventDefault();
}

function getX(event) {
  return event.pageX
    ? event.pageX - canvas.offsetLeft
    : event.targetTouches[0].pageX - canvas.offsetLeft;
}

function getY(event) {
  return event.pageY
    ? event.pageY - canvas.offsetTop
    : event.targetTouches[0].pageY - canvas.offsetTop;
}

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

function Restore() {
  if (start_index <= 0) {
    Clear();
  } else {
    start_index--;
    restore_array.pop();
    context.putImageData(restore_array[start_index], 0, 0);
  }
}

function Clear() {
  context.fillStyle = "white";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);
  restore_array = [];
  start_index = -1;
}

context.drawImage = function() {
	console.warn("noo >:(");
};

document.getElementById("submit").addEventListener("click", async function () {
  const submitButton = document.getElementById("submit");
  const statusText = document.getElementById("status");

  submitButton.disabled = true;
  statusText.textContent = "Uploading...";

  const imageData = canvas.toDataURL("image/png");
  const blob = await (await fetch(imageData)).blob();
  const formData = new FormData();
  
  let response;
  try {
    if (IMG_MODE === "IMGUR") {
      formData.append("image", blob, "drawing.png");
      response = await fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: { Authorization: `Client-ID ${CLIENT_ID}` },
        body: formData,
      });
    } else if (IMG_MODE === "CATBOX") {
      formData.append("fileToUpload", blob, "drawing.png");
      formData.append("userhash", dO(CATBOX_UH));
      formData.append("reqtype", 'fileupload');
      response = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: formData,
        mode: 'no-cors',
      });
    } else if (IMG_MODE === "IMGBB") { 
      formData.append("image", blob, "drawing.png");
      response = await fetch(`https://api.imgbb.com/1/upload?key=${dO(IMGBBAPIK)}`, {
        method: "POST",
        body: formData,
      });
    } else {
      throw Error("Invalid image mode!")
    }

    let data;
    if (IMG_MODE === "IMGUR") {
      data = await response.json();
      if (!data.success) throw new Error("upload failed");
    } else if(IMG_MODE === "CATBOX") {
      data = await response.text();
      console.log(`DBG: ${data}`)
    } else if (IMG_MODE === "IMGBB") {
      data = await response.json();
      if (!data.success) throw new Error("upload failed");
    }

    const imageUrl = IMG_MODE === "IMGUR" ? data.data.link : IMG_MODE === "IMGBB" ? data.data.url : data;
    console.log("Uploaded image URL:", imageUrl);

    const googleFormData = new FormData();
    googleFormData.append(ENTRY_ID, imageUrl);

    await fetch(GOOGLE_FORM_URL, {
      method: "POST",
      body: googleFormData,
      mode: "no-cors",
    });

    statusText.textContent = "Upload successful!";
    alert("Image uploaded and submitted successfully ☻");
    location.reload();
  } catch (error) {
    console.error(error);
    statusText.textContent = "Error uploading image.";
    alert("Error uploading image or submitting to Google Form.");
  } finally {
    submitButton.disabled = false;
  }
});

async function fetchImages() {
  if (!DISPLAY_IMAGES) {
    console.log("Image display is disabled.");
    return;
  }

  try {
    const response = await fetch(GOOGLE_SHEET_URL);
    const csvText = await response.text();
    const rows = csvText.split("\n").slice(1);

    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    rows.reverse().forEach((row) => {
      const columns = row.split(",");
      if (columns.length < 2) return;

      const timestamp = columns[0].trim();
      const imgUrl = columns[1].trim().replace(/"/g, "");

      if (imgUrl.startsWith("http")) {
        const div = document.createElement("div");
        div.classList.add("image-container");

        div.innerHTML = `
                    <img src="${imgUrl}" alt="drawing">
                    <p>${timestamp}</p>
                `;
        gallery.appendChild(div);
      }
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    document.getElementById("gallery").textContent = "Failed to load images.";
  }
}

fetchImages();
