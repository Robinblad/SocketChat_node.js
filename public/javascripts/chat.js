const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ul = document.getElementById("messages");
const room = document.getElementById("room");
const text = document.getElementById("input");
const sound = document.getElementById("message-sound");
const idColors = {};

function addMessage(isSelf, to, message, color) {
	let li = document.createElement("li");
	li.classList.add(isSelf ? "right" : "left");

	// Create a span element for the username and append it to `li`
	let userSpan = document.createElement("span");
	userSpan.textContent = to;
	userSpan.classList.add("username");
	li.appendChild(userSpan);

	// Create a span element for the message text
	let messageSpan = document.createElement("span");
	messageSpan.textContent = message;
	messageSpan.style.backgroundColor = color; // Apply the color to the background of the message
	messageSpan.classList.add("message");
	li.appendChild(messageSpan);

	ul.appendChild(li);
	ul.style.paddingBottom = "150px";
	if (isUserAtBottom()) {
		window.scrollTo({
			top: document.body.scrollHeight,
			behavior: "smooth",
		});
	}
	sound.play();
}

function isUserAtBottom() {
	// Distance in pixels from the bottom
	const position = ul.scrollTop + ul.offsetHeight;
	const height = ul.scrollHeight;
	return position >= height;
}

let socket;

function join(id) {
	if (!socket) return;
	socket.emit("join", { id });
	axios.get("http://localhost:11001/chat/get/" + id).then(function (response) {
		for (const message of response.data) {
			const isSelf = message.userId == socket.id;
			const color = getColorForId(isSelf ? socket.id : message.userId); // Get the color for the user
			addMessage(
				isSelf,
				id + (isSelf ? "" : "-" + message.userId),
				message.message,
				color // Add the message
			);
		}
	});
}

function getRandomColor() {
	let color = "#";
	for (let i = 0; i < 3; i++) {
		// Generate a random number between 128 and 255.
		// This prevents dark shades since every color component will be at least at the middle of its range.
		const component = Math.floor(Math.random() * (256 - 128) + 128);
		// Convert the component to a hexadecimal string and append it to the color.
		color += component.toString(16).padStart(2, "0");
	}
	return color;
}

// Function to get a color for a given id
function getColorForId(id) {
	if (!idColors[id]) {
		idColors[id] = getRandomColor();
	}
	return idColors[id];
}

function send(to, message) {
	if (!socket || !socket.connected) return;
	const color = getColorForId(socket.id);
	socket.emit(
		"send",
		{
			to,
			message,
		},
		(p) => {
			addMessage(true, to, message, color);
		}
	);
}

async function start() {
	updateBackground(); // Set initial background
	setInterval(updateBackground, 6000000); // Update every 60 minutes
	socket = io("ws://localhost:11001");
	socket.on("message", (payload) => {
		const isSelf = payload.userId == socket.id;
		const color = getColorForId(payload.userId);
		addMessage(
			isSelf,
			isSelf ? "You" : payload.userId, // Use "You" for self messages, or the user ID for others
			payload.message,
			color // Pass the color to addMessage
		);
	});
	join("user1");
	join("user2");
	join("user3");
}

document.getElementById("form").addEventListener("submit", (event) => {
	send(room.value, text.value);
	text.value = "";
	event.preventDefault();
	return false;
});

function getGradientByTime() {
	const hour = new Date().getHours();
	let gradient = "";

	if (hour >= 5 && hour < 6) {
		// Morning 5-6
		gradient = "linear-gradient(to top, #ADD8E6, #00008B)";
	} else if (hour >= 6 && hour < 7) {
		// Morning 6-7
		gradient = "linear-gradient(to top, #5E7BE5, #2342DD)";
	} else if (hour >= 7 && hour < 8) {
		// Morning 7-8
		gradient = "linear-gradient(to top, #7C92E2, #3361E0)";
	} else if (hour >= 8 && hour < 9) {
		// Morning 8-9
		gradient = "linear-gradient(to top, #9AADE0, #467DE2)";
	} else if (hour >= 9 && hour < 10) {
		// Morning 9-10
		gradient = "linear-gradient(to top, #99BBFF, #599AE5)";
	} else if (hour >= 10 && hour < 11) {
		// Day 10-11
		gradient = "linear-gradient(to top, #A8CFFF, #ADD8E6)";
	} else if (hour >= 11 && hour < 12) {
		// Day 11-12
		gradient = "linear-gradient(to top, #BFD5FF, #ADD8E6)";
	} else if (hour >= 12 && hour < 13) {
		// Day 12-13
		gradient = "linear-gradient(to top, #FFFFFF, #ADD8E6)";
	} else if (hour >= 13 && hour < 14) {
		// Day 13-14
		gradient = "linear-gradient(to top, #E8EAFF, #ADD8E6)";
	} else if (hour >= 14 && hour < 15) {
		// Day 14-15
		gradient = "linear-gradient(to top, #D3DDFF, #ADD8E6)";
	} else if (hour >= 15 && hour < 16) {
		// Day 15-16
		gradient = "linear-gradient(to top, #BFD5FF, #E5E0B0)";
	} else if (hour >= 16 && hour < 17) {
		// Day 16-17
		gradient = "linear-gradient(to top, #B2C1FF, #E2DC98)";
	} else if (hour >= 17 && hour < 18) {
		// Evening 17-18
		gradient = "linear-gradient(to top, #FFBB7F, #E0D97D)";
	} else if (hour >= 18 && hour < 19) {
		// Evening 18-19
		gradient = "linear-gradient(to top, #FFA354, #DBCC43)";
	} else if (hour >= 19 && hour < 20) {
		// Evening 19-20
		gradient = "linear-gradient(to top, #FF8C00, #FFD700)";
	} else if (hour >= 20 && hour < 21) {
		// Evening 20-21
		gradient = "linear-gradient(to top, #FF8C00, #54AFFF)";
	} else if (hour >= 21 && hour < 22) {
		// Evening 21-22
		gradient = "linear-gradient(to top, #DD6B00, #2885FF)";
	} else if (hour >= 22 && hour < 23) {
		// Evening 22-23
		gradient = "linear-gradient(to top, #9B3900, #2B28E2)";
	} else {
		// Night
		gradient = "linear-gradient(to top, #000000, #00008B)";
	}

	return gradient;
}

function updateBackground() {
	const gradient = getGradientByTime();
	document.body.style.background = gradient;
}

start();

//function isUserAtBottom() {
//	// Distance from the top of the element to the current scroll position
//	const currentPosition = ul.scrollTop + ul.clientHeight; // Total scrollable height
//	const totalHeight = ul.scrollHeight; // Return true if the user is at the bottom of the chat
//	return currentPosition >= totalHeight;
//}

//function addMessage(isSelf, to, message, color) {
//	let li = document.createElement("li");
//	li.classList.add(isSelf ? "right" : "left"); // Create a span element for the username and append it to `li`

//	let userSpan = document.createElement("span");
//	userSpan.textContent = to;
//	userSpan.classList.add("username");
//	li.appendChild(userSpan); // Create a span element for the message text

//	let messageSpan = document.createElement("span");
//	messageSpan.textContent = message;
//	messageSpan.style.backgroundColor = color; // Apply the color to the background of the message
//	messageSpan.classList.add("message");
//	li.appendChild(messageSpan);

//	ul.appendChild(li); // Check if the user is at the bottom of the chat before the new message was added

//	const shouldScroll = isUserAtBottom(); // Play sound only if the user is at the bottom of the chat
//	if (shouldScroll) {
//		sound.play();
//	} // Scroll to the bottom if the user was at the bottom before the message was added

//	if (shouldScroll) {
//		scrollToBottom();
//	}
//}

//function scrollToBottom() {
//	window.scrollTo({
//		top: document.documentElement.scrollHeight || document.body.scrollHeight,
//		behavior: "smooth",
//	});
//}
