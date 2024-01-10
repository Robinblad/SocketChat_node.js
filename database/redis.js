const { createClient } = require("redis"); // импортируем метод createClient из пакета redis

const localId =
	"#" +
	(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6) +
	(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6) +
	(Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6);

// создание нового экземпляр клиента Redis с конфигурацией по умолчанию
const client = createClient({
	url: "redis://redis:6379",
});
const pubClient = client.duplicate();
const subClient = client.duplicate();

client.connect();
pubClient.connect();
subClient.connect();

// Cлушатели "error" и "connect" реагируют на события, создаваемые клиентом Redis, например, при возникновении ошибки или при успешном подключении.

client.on("error", (error) => {
	console.error("Error connecting to Redis:", error);
});

client.on("connect", () => {
	console.log("Connected to Redis");
});

// Это немедленно вызываемое функциональное выражение (IIFE), которое используется для запуска асинхронного кода. Он пытается подключиться к серверу Redis при запуске сценария
(async () => {
	try {
		await client.connect();
	} catch (error) {
		console.error("Error connecting to Redis on startup:", error);
	}
})();

// Данная функция получает значение связанное с ключом из Redis, анализирует его из JSON и возвращает
async function get(key, defaultValue) {
	const value = await client.get(key);
	return value || defaultValue || null;
}

// Данная функция сохраняет значение (после преобразования его в строку JSON), связанное с ключом Redis
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

// Здесь экспортируется функции get, set и del, чтобы их можно было использовать в других частях приложения
module.exports = {
	get,
	set,
	del: client.del,
	pub,
	sub,
};

//const { createClient } = require("redis"); // импортируем метод createClient из пакета redis

//const client = createClient(); // создание нового экземпляр клиента Redis с конфигурацией по умолчанию

//// Cлушатели "error" и "connect" реагируют на события, создаваемые клиентом Redis, например, при возникновении ошибки или при успешном подключении.

//client.on("error", (error) => {
//  console.error("Error connecting to Redis:", error);
//});

//client.on("connect", () => {
//  console.log("Connected to Redis");
//});

//// Это немедленно вызываемое функциональное выражение (IIFE), которое используется для запуска асинхронного кода. Он пытается подключиться к серверу Redis при запуске сценария
//(async () => {
//  try {
//    await client.connect();
//  } catch (error) {
//    console.error("Error connecting to Redis on startup:", error);
//  }
//})();

//// Данная функция получает значение связанное с ключом из Redis, анализирует его из JSON и возвращает
//async function get(key) {
//  try {
//    const value = await client.get(key);
//    return value ? JSON.parse(value) : null;
//  } catch (error) {
//    console.error("Error retrieving value from Redis:", error);
//    throw error;
//  }
//}

//// Данная функция сохраняет значение (после преобразования его в строку JSON), связанное с ключом Redis
//async function set(key, value) {
//  try {
//    await client.set(key, JSON.stringify(value));
//  } catch (error) {
//    console.error("Error setting value in Redis:", error);
//    throw error;
//  }
//}

//// Эта функция удаляет ключ и связанное с ним значение из Redis
//async function del(key) {
//  try {
//    await client.del(key);
//  } catch (error) {
//    console.error("Error deleting value from Redis:", error);
//    throw error;
//  }
//}

//// Здесь экспортируется функции get, set и del, чтобы их можно было использовать в других частях приложения
//module.exports = {
//  get,
//  set,
//  del,
//};
