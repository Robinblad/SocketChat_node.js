const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function try1() {
	const socket = io("ws://localhost:11001");
	socket.on("message", (payload) => console.log("message", payload));
	socket.emit("join", {
		id: "user1",
	});
	await sleep(5000);
	socket.emit(
		"send",
		{
			to: "user1",
			message: "from first",
		},
		(payload) => {
			console.log("from send to user1", payload);
		}
	);
}

async function try2() {
	const socket = io("ws://localhost:11001");
	socket.on("message", (payload) => console.log("message", payload));
	socket.emit("join", {
		id: "user1",
	});
	socket.emit("join", {
		id: "user2",
	});
	await sleep(5000);
	socket.emit(
		"send",
		{
			to: "user2",
			message: "from second",
		},
		(payload) => {
			console.log("from send to user2", payload);
		}
	);
}

async function try3() {
	const socket = io("ws://localhost:11001");
	socket.on("message", (payload) => console.log("message", payload));
	socket.emit("join", {
		id: "user3",
	});
	await sleep(5000);
	socket.emit(
		"send",
		{
			to: "user2",
			message: "from third",
		},
		(payload) => {
			console.log("from send to user2", payload);
		}
	);
}
