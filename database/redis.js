const { createClient } = require("redis"); // import the createClient method from the redis package

const localId =
	"#" +
	(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6) +
	(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6) +
	(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6);

// creating a new Redis client instance with default configuration
const client = createClient({
	url: "redis://redis:6379",
});
const pubClient = client.duplicate();
const subClient = client.duplicate();

client.connect();
pubClient.connect();
subClient.connect();

// The error and connect listeners respond to events created by the Redis client, such as when an error occurs or when a connection is successful.

client.on("error", (error) => {
	console.error("Error connecting to Redis:", error);
});

client.on("connect", () => {
	console.log("Connected to Redis");
});

// This is an immediately invoked function expression (IIFE) that is used to run asynchronous code. It tries to connect to the Redis server when running the script
(async () => {
	try {
		await client.connect();
	} catch (error) {
		console.error("Error connecting to Redis on startup:", error);
	}
})();

// This function gets the value associated with a key from Redis, parses it from JSON and returns
async function get(key, defaultValue) {
	const value = await client.get(key);
	return value || defaultValue || null;
}

// This function stores the value (after converting it to a JSON string) associated with a Redis key
async function set(key, value) {
	if (!value) {
		await client.del(key);
	} else await client.set(key, value);
}

async function pub(type, payload) {
	payload.publisher = localId;
	return pubClient.publish(type, JSON.stringify(payload));
}

async function sub(type, callback) {
	subClient.subscribe(type, (message) => {
		const payload = JSON.parse(message);
		if (payload.publisher == localId) return;
		callback(payload);
	});
}

// There are exports the get, set and del functions here, so they can be used in other parts of the application
module.exports = {
	get,
	set,
	del: client.del,
	pub,
	sub,
};

//const { createClient } = require("redis");

//const client = createClient();

//client.on("error", (error) => {
//  console.error("Error connecting to Redis:", error);
//});

//client.on("connect", () => {
//  console.log("Connected to Redis");
//});

//(async () => {
//  try {
//    await client.connect();
//  } catch (error) {
//    console.error("Error connecting to Redis on startup:", error);
//  }
//})();

//async function get(key) {
//  try {
//    const value = await client.get(key);
//    return value ? JSON.parse(value) : null;
//  } catch (error) {
//    console.error("Error retrieving value from Redis:", error);
//    throw error;
//  }
//}

//async function set(key, value) {
//  try {
//    await client.set(key, JSON.stringify(value));
//  } catch (error) {
//    console.error("Error setting value in Redis:", error);
//    throw error;
//  }
//}

//async function del(key) {
//  try {
//    await client.del(key);
//  } catch (error) {
//    console.error("Error deleting value from Redis:", error);
//    throw error;
//  }
//}

//module.exports = {
//  get,
//  set,
//  del,
//};
