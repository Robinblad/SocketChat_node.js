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

const messages = require("./database/inem");
const { pub, sub } = require("./database/redis");
const { Server } = require("socket.io");
module.exports = function (httpServer) {
	const wsServer = new Server(httpServer, {
		cors: "*",
	});

	sub("message", (payload) => {
		messages[payload.to] = messages[payload.to] || [];
		messages[payload.to].push(payload);
		wsServer.to(payload.to).emit("message", payload);
	});

	wsServer.on("connection", (socket) => {
		const userId = socket.id;
		console.log("a user connected");
		socket.on("join", (msg) => {
			socket.join(msg.id);
		});
		socket.on("leave", (msg) => {
			socket.leave(msg.id);
		});
		socket.on("send", (msg, reply) => {
			messages[msg.to] = messages[msg.to] || [];
			messages[msg.to].push(msg);
			msg.userId = userId;
			socket.to(msg.to).emit("message", msg);
			pub("message", msg);
			reply("ok");
		});
	});
};

//const { Server } = require("socket.io");
//module.exports = function (httpServer) {
//  const wsServer = new Server(httpServer, {
//    cors: "*",
//  });
//  let messages = [];

//  wsServer.on("connection", (socket) => {
//    console.log("a user connected");
//    socket.on("join", (msg) => {
//      socket.join(msg.id);
//    });
//    socket.on("leave", (msg) => {
//      socket.leave(msg.id);
//    });
//    socket.on("send", (msg, reply) => {
//      messages[msg.to] = messages[msg.to] || [];
//      messages[msg.to].push(msg);
//      reply("ok");
//      socket.to(msg.to).emit("message", msg);
//    });
//    socket.on("get", (msg, reply) => {
//      reply(messages[msg.to] || []);
//    });
//  });
//};

//const { Server } = require("socket.io");
//module.exports = function (httpServer) {
//  const wsServer = new Server(httpServer, {
//    cors: "*",
//  });
//  let message = [];

//  wsServer.on("connection", (socket) => {
//    console.log("a user connected");
//    socket.on("SEND_MESSAGE", (msg) => {
//      message.push(msg);
//      socket.emit("OK", true);
//    });
//    socket.on("GET_MESSAGES", (msg) => {
//      socket.emit("REC_MESSAGES", message);
//    });
//    socket.on("BROADCAST", (msg) => {
//      socket.broadcast.emit("hi", msg);
//    });
//  });
//};
