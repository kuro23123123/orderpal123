const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");

const port = Number(process.env.PORT || process.argv[2] || 5173);
const host = process.env.HOST || "0.0.0.0";
const root = __dirname;
const dataFile = process.env.SHOP_DATA_FILE || path.join(root, "shop-data.json");

const menuPrices = {
  m_phin_den_da: { S: 16, M: 20 },
  m_phin_sua_da: { S: 18, M: 22 },
  m_phin_bac_xiu: { S: 18, M: 22 },
  m_phin_sua_tuoi: { S: 19, M: 23 },
  m_phin_sua_ca_cao: { S: 22, M: 27 },
  m_cold_brew_truyen_thong: { S: 20, M: 25 },
  m_cold_brew_chanh: { M: 25 },
  m_cold_brew_sua_tuoi: { M: 25 },
  m_cafe_muoi: { S: 20, M: 25 },
  m_capuchino: { S: 22, M: 27 },
  m_latte_hanh_nhan: { S: 22, M: 27 },
  m_latte_hat_phi: { S: 22, M: 27 },
  m_latte_caramel: { S: 22, M: 27 },
  m_latte_chocolate: { S: 22, M: 27 },
  m_machiato_latte: { S: 22, M: 27 },
  m_machiato_caramel: { S: 22, M: 27 },
  m_machiato_la_dua: { S: 22, M: 27 },
  m_latte_latte_sua_yen_mach: { M: 27 },
  m_cacao_sua_da: { S: 20, M: 25 },
  m_cacao_sua_tuoi: { S: 20, M: 25 },
  m_cacao_bac_ha: { M: 27 },
  m_tra_sua_trams: { L: 22 },
  m_hong_tra_sua: { L: 22 },
  m_oolong_sua: { L: 22 },
  m_oolong_chanh_mat_ong: { M: 22, L: 25 },
  m_hong_tra_dao: { M: 25 },
  m_hong_tra_thao_moc: { M: 27 },
  m_tra_lai_vai: { M: 27 },
  m_tra_lai_dac_thom: { M: 27 },
  m_tra_lai_cam_dac: { M: 27 },
  m_tra_sen_cold_brew_tao: { M: 25 },
  m_tra_oolong_cold_brew_mo_dao: { L: 28 }
};

const menuSizeOptions = {
  m_phin_den_da: ["S", "M"],
  m_phin_sua_da: ["S", "M"],
  m_phin_bac_xiu: ["S", "M"],
  m_phin_sua_tuoi: ["S", "M"],
  m_phin_sua_ca_cao: ["S", "M"],
  m_cold_brew_truyen_thong: ["S", "M"],
  m_cafe_muoi: ["S", "M"],
  m_capuchino: ["S", "M"],
  m_latte_hanh_nhan: ["S", "M"],
  m_latte_hat_phi: ["S", "M"],
  m_latte_caramel: ["S", "M"],
  m_latte_chocolate: ["S", "M"],
  m_machiato_latte: ["S", "M"],
  m_machiato_caramel: ["S", "M"],
  m_machiato_la_dua: ["S", "M"],
  m_cacao_sua_da: ["S", "M"],
  m_cacao_sua_tuoi: ["S", "M"],
  m_cacao_bac_ha: ["S", "M"],
  m_cold_brew_chanh: ["M"],
  m_cold_brew_sua_tuoi: ["M"],
  m_latte_latte_sua_yen_mach: ["M"],
  m_tra_sua_trams: ["L"],
  m_hong_tra_sua: ["L"],
  m_oolong_sua: ["L"],
  m_oolong_chanh_mat_ong: ["M", "L"],
  m_hong_tra_dao: ["M"],
  m_hong_tra_thao_moc: ["M"],
  m_tra_lai_vai: ["M"],
  m_tra_lai_dac_thom: ["M"],
  m_tra_lai_cam_dac: ["M"],
  m_tra_sen_cold_brew_tao: ["M"],
  m_tra_oolong_cold_brew_mo_dao: ["L"]
};

const defaultVoiceCommands = {
  split: ["xong"],
  send: ["gửi bếp", "gui bep", "gửi", "gui", "ok", "okay", "ô kê", "o ke"],
  increase: ["tăng số", "tang so", "tăng", "tang", "cộng", "cong"],
  decrease: ["giảm số", "giam so", "giảm", "giam", "bớt", "bot", "trừ", "tru"],
  remove: ["xóa món", "xoa mon", "xoá món", "xóa", "xoa", "xoá", "bỏ", "bo"],
  add: ["thêm món", "them mon", "thêm", "them"],
  replace: ["đổi", "doi", "đổi món", "doi mon", "thay", "thay món", "thay mon"]
};

const defaultData = {
  sequence: 0,
  menu: applyMenuPrices([
    { id: "m_phin_den_da", name: "Phin Đen Đá", aliases: ["phin den da", "đen đá", "den da", "đen", "den", "cafe đen", "cafe phin đen đá", "cà phê phin đen đá"], active: true },
    { id: "m_phin_sua_da", name: "Phin Sữa Đá", aliases: ["phin sua da", "sữa", "sua", "sữa đá", "sua da", "cafe sữa", "cafe sua", "cà phê sữa", "ca phe sua", "cà phê sữa đá", "ca phe sua da", "cafe phin sữa đá", "cà phê phin sữa đá"], active: true },
    { id: "m_phin_bac_xiu", name: "Phin Bạc Xỉu", aliases: ["phin bac xiu", "bạc xỉu", "bac xiu"], active: true },
    { id: "m_phin_sua_tuoi", name: "Phin Sữa Tươi", aliases: ["phin sua tuoi", "cà phê sữa tươi", "cafe sữa tươi"], active: true },
    { id: "m_phin_sua_ca_cao", name: "Phin Sữa Ca Cao", aliases: ["phin sua ca cao", "cà phê sữa ca cao", "cafe sữa cacao"], active: true },
    { id: "m_cold_brew_truyen_thong", name: "Cold Brew Truyền Thống", aliases: ["cold brew truyen thong", "cold brew thường", "cold brew"], active: true },
    { id: "m_cold_brew_chanh", name: "Cold Brew Chanh", aliases: ["cold brew chanh"], active: true },
    { id: "m_cold_brew_sua_tuoi", name: "Cold Brew Sữa Tươi", aliases: ["cold brew sua tuoi", "cold brew sữa"], active: true },
    { id: "m_cafe_muoi", name: "Cafe Muối", aliases: ["cafe muoi", "muối", "muoi", "cà phê muối", "ca phe muoi"], active: true },
    { id: "m_capuchino", name: "Capuchino", aliases: ["capuchino", "cappuccino", "ca pu chi no"], active: true },
    { id: "m_latte_hanh_nhan", name: "Latte Vị Hạnh Nhân", aliases: ["latte hạnh nhân", "latte hanh nhan", "la tê hạnh nhân"], active: true },
    { id: "m_latte_hat_phi", name: "Latte Vị Hạt Phỉ", aliases: ["latte hạt phỉ", "latte hat phi", "la tê hạt phỉ"], active: true },
    { id: "m_latte_caramel", name: "Latte Vị Caramel", aliases: ["latte caramel", "la tê caramel"], active: true },
    { id: "m_latte_chocolate", name: "Latte Vị Chocolate", aliases: ["latte chocolate", "latte socola", "la tê chocolate"], active: true },
    { id: "m_machiato_latte", name: "Machiato Latte", aliases: ["macchiato latte", "machiato la tê", "macchiato la tê"], active: true },
    { id: "m_machiato_caramel", name: "Machiato Caramel", aliases: ["macchiato caramel"], active: true },
    { id: "m_machiato_la_dua", name: "Machiato Lá Dứa", aliases: ["macchiato lá dứa", "machiato la dua", "macchiato la dua"], active: true },
    { id: "m_latte_latte_sua_yen_mach", name: "Latte Latte Sữa Yến Mạch", aliases: ["latte latte", "latte sữa yến mạch", "latte sua yen mach"], active: true },
    { id: "m_cacao_sua_da", name: "Cacao Sữa Đá", aliases: ["cacao sua da", "ca cao sữa đá"], active: true },
    { id: "m_cacao_sua_tuoi", name: "Cacao Sữa Tươi", aliases: ["cacao sua tuoi", "ca cao sữa tươi"], active: true },
    { id: "m_cacao_bac_ha", name: "Cacao Bạc Hà", aliases: ["cacao bac ha", "ca cao bạc hà"], active: true },
    { id: "m_tra_sua_trams", name: "Trà Sữa Trạm's", aliases: ["tra sua tram", "trà sữa trạm", "tra sua trams"], active: true },
    { id: "m_hong_tra_sua", name: "Hồng Trà Sữa", aliases: ["hong tra sua"], active: true },
    { id: "m_oolong_sua", name: "Oolong Sữa", aliases: ["oolong sua", "ô long sữa"], active: true },
    { id: "m_oolong_chanh_mat_ong", name: "Oolong Chanh Mật Ong", aliases: ["oolong chanh mat ong", "ô long chanh mật ong"], active: true },
    { id: "m_hong_tra_dao", name: "Hồng Trà Đào", aliases: ["hong tra dao", "trà đào"], active: true },
    { id: "m_hong_tra_thao_moc", name: "Hồng Trà Thảo Mộc", aliases: ["hong tra thao moc"], active: true },
    { id: "m_tra_lai_vai", name: "Trà Lài Vải", aliases: ["tra lai vai", "trà vải", "tra vai", "lài vải", "lai vai", "trà lài", "tra lai", "trà lài vải"], active: true },
    { id: "m_tra_lai_dac_thom", name: "Trà Lài Đác Thơm", aliases: ["tra lai dac thom", "đác thơm", "dac thom", "trà lài đắc thơm"], active: true },
    { id: "m_tra_lai_cam_dac", name: "Trà Lài Cam Đác", aliases: ["tra lai cam dac", "trà lài cam đắc"], active: true },
    { id: "m_tra_sen_cold_brew_tao", name: "Trà Sen Cold Brew Vị Táo", aliases: ["tra sen cold brew vi tao", "trà sen cold brew táo"], active: true },
    { id: "m_tra_oolong_cold_brew_mo_dao", name: "Trà Oolong Cold Brew Vị Mơ Đào", aliases: ["tra oolong cold brew vi mo dao", "oolong cold brew mơ đào"], active: true }
  ]),
  voiceCommands: defaultVoiceCommands,
  orders: []
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (requestUrl.pathname.startsWith("/api/")) {
    await handleApi(request, response, requestUrl);
    return;
  }

  const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const safePath = path
    .normalize(decodeURIComponent(pathname))
    .replace(/^(\.\.[/\\])+/, "")
    .replace(/^[/\\]+/, "");

  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root) || path.basename(filePath) === "shop-data.json" || filePath === dataFile) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream"
    });
    response.end(data);
  });
});

async function handleApi(request, response, requestUrl) {
  try {
    const data = readData();
    const method = request.method;
    const pathname = requestUrl.pathname;

    if (method === "GET" && pathname === "/api/state") {
      sendJson(response, 200, {
        mode: "local-server",
        menu: data.menu,
        voiceCommands: data.voiceCommands,
        orders: data.orders
      });
      return;
    }

    if (method === "GET" && pathname === "/api/health") {
      sendJson(response, 200, {
        ok: true,
        mode: "cloud-ready",
        dataFile: dataFile === path.join(root, "shop-data.json") ? "local-file" : "external-file"
      });
      return;
    }

    if (method === "POST" && pathname === "/api/orders") {
      const body = await readJsonBody(request);
      const items = Array.isArray(body.items) ? body.items : [];

      if (!items.length) {
        sendJson(response, 400, { error: "Order requires at least one item." });
        return;
      }

      data.sequence += 1;
      const createdAt = new Date().toISOString();
      const order = {
        id: `ORD-${String(data.sequence).padStart(4, "0")}`,
        createdAt,
        createdBy: cleanText(body.createdBy) || "Máy nhân viên",
        label: cleanText(body.label),
        businessDate: cleanDateKey(body.businessDate) || dateKeyFromValue(createdAt),
        status: "new",
        hiddenFromKitchen: false,
        note: cleanText(body.note),
        items: normalizeOrderItems(data.menu, items)
      };

      data.orders.unshift(order);
      writeData(data);
      sendJson(response, 201, order);
      return;
    }

    const orderStatusMatch = pathname.match(/^\/api\/orders\/([^/]+)$/);
    if (method === "PATCH" && orderStatusMatch) {
      const body = await readJsonBody(request);
      const order = data.orders.find((item) => item.id === orderStatusMatch[1]);
      if (!order) {
        sendJson(response, 404, { error: "Order not found." });
        return;
      }

      if (Object.prototype.hasOwnProperty.call(body, "status")) {
        const status = cleanText(body.status);
        const allowed = new Set(["new", "preparing", "done"]);

        if (!allowed.has(status)) {
          sendJson(response, 400, { error: "Unsupported order status." });
          return;
        }

        order.status = status;
      }

      if (Array.isArray(body.items)) {
        if (!body.items.length) {
          sendJson(response, 400, { error: "Order requires at least one item." });
          return;
        }

        order.label = cleanText(body.label);
        order.businessDate = cleanDateKey(body.businessDate) || dateKeyFromValue(order.createdAt);
        order.note = cleanText(body.note);
        order.items = normalizeOrderItems(data.menu, body.items);
        order.status = "new";
        order.hiddenFromKitchen = false;
        order.updatedAt = new Date().toISOString();
        order.editedBy = cleanText(body.createdBy) || "Máy nhân viên";
      }

      writeData(data);
      sendJson(response, 200, order);
      return;
    }

    if (method === "DELETE" && pathname === "/api/orders/done") {
      data.orders.forEach((order) => {
        if (order.status === "done") {
          order.hiddenFromKitchen = true;
        }
      });
      writeData(data);
      sendJson(response, 200, { orders: data.orders });
      return;
    }

    if (method === "DELETE" && orderStatusMatch) {
      const orderId = orderStatusMatch[1];
      const beforeCount = data.orders.length;
      data.orders = data.orders.filter((order) => order.id !== orderId);

      if (data.orders.length === beforeCount) {
        sendJson(response, 404, { error: "Order not found." });
        return;
      }

      writeData(data);
      sendJson(response, 200, { deletedId: orderId, orders: data.orders });
      return;
    }

    if (method === "POST" && pathname === "/api/menu") {
      const body = await readJsonBody(request);
      const name = cleanText(body.name);

      if (!name) {
        sendJson(response, 400, { error: "Menu item name is required." });
        return;
      }

      const item = {
        id: `m_${slugify(name)}_${Date.now().toString(36)}`,
        name,
        aliases: Array.isArray(body.aliases) ? body.aliases.map(cleanText).filter(Boolean) : [],
        active: true
      };

      data.menu.push(item);
      writeData(data);
      sendJson(response, 201, item);
      return;
    }

    const menuMatch = pathname.match(/^\/api\/menu\/([^/]+)$/);
    if (menuMatch && method === "PATCH") {
      const body = await readJsonBody(request);
      const item = data.menu.find((entry) => entry.id === menuMatch[1]);

      if (!item) {
        sendJson(response, 404, { error: "Menu item not found." });
        return;
      }

      if (typeof body.active === "boolean") {
        item.active = body.active;
      }

      if (Array.isArray(body.aliases)) {
        item.aliases = normalizeAliasList(body.aliases);
      }

      writeData(data);
      sendJson(response, 200, item);
      return;
    }

    if (menuMatch && method === "DELETE") {
      data.menu = data.menu.filter((entry) => entry.id !== menuMatch[1]);
      writeData(data);
      sendJson(response, 200, { menu: data.menu });
      return;
    }

    if (method === "PATCH" && pathname === "/api/voice-commands") {
      const body = await readJsonBody(request);
      data.voiceCommands = normalizeVoiceCommands(body.voiceCommands || body);
      writeData(data);
      sendJson(response, 200, { voiceCommands: data.voiceCommands });
      return;
    }

    sendJson(response, 404, { error: "Not found." });
  } catch (error) {
    sendJson(response, 500, { error: error.message || "Server error." });
  }
}

function readData() {
  if (!fs.existsSync(dataFile)) {
    writeData(clone(defaultData));
  }

  try {
    const raw = fs.readFileSync(dataFile, "utf8");
    const data = JSON.parse(raw);
    return {
      sequence: Number(data.sequence) || 0,
      menu: applyMenuPrices(Array.isArray(data.menu) ? data.menu : clone(defaultData.menu)),
      voiceCommands: normalizeVoiceCommands(data.voiceCommands),
      orders: Array.isArray(data.orders) ? data.orders : []
    };
  } catch (error) {
    return clone(defaultData);
  }
}

function writeData(data) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        request.destroy();
        reject(new Error("Request body too large."));
      }
    });
    request.on("end", () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error("Invalid JSON body."));
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(body));
}

function cleanText(value) {
  return String(value || "").trim();
}

function cleanDateKey(value) {
  const text = cleanText(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
}

function dateKeyFromValue(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function normalizeOrderItems(menu, items) {
  return items.map((item) => {
    const normalizedItem = {
      id: cleanText(item.id),
      name: cleanText(item.name),
      quantity: Math.max(1, Number(item.quantity) || 1),
      size: cleanText(item.size) || "M",
      taste: cleanText(item.taste) || cleanText(item.note) || "vừa",
      ice: cleanText(item.ice) || "vừa",
      prep: cleanText(item.prep),
      ownBottle: Boolean(item.ownBottle) || cleanText(item.container) === "bình riêng",
      container: Boolean(item.ownBottle) || cleanText(item.container) === "bình riêng" ? "bình riêng" : "",
      note: cleanText(item.taste) || cleanText(item.note) || "vừa"
    };

    const menuItem = findMenuItemForOrderItem(menu, normalizedItem);
    normalizedItem.size = normalizeSizeForMenuItem(menuItem, normalizedItem.size);
    normalizedItem.unitPrice = menuPriceForSize(menuItem, normalizedItem.size) || Math.max(0, Number(item.unitPrice) || 0);
    return normalizedItem;
  });
}

function normalizeAliasList(values) {
  const seen = new Set();
  return (values || [])
    .map(cleanText)
    .filter((alias) => {
      const key = normalizeText(alias);
      if (!key || seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

function normalizeVoiceCommands(commands) {
  const normalized = clone(defaultVoiceCommands);
  Object.keys(commands || {}).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(defaultVoiceCommands, key)) {
      return;
    }
    const values = Array.isArray(commands[key]) ? commands[key] : String(commands[key] || "").split(/,|\n/);
    const aliases = normalizeAliasList(values);
    if (aliases.length) {
      normalized[key] = aliases;
    }
  });
  return normalized;
}

function normalizeText(value) {
  return cleanText(value)
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N} ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function applyMenuPrices(menu) {
  return (menu || []).map((item) => {
    const defaultPrices = menuPrices[item.id];
    if (!defaultPrices) {
      return item;
    }

    return {
      ...item,
      prices: {
        ...defaultPrices,
        ...(item.prices || {})
      }
    };
  });
}

function priceForItem(menu, item) {
  const menuItem = findMenuItemForOrderItem(menu, item);
  return menuPriceForSize(menuItem, normalizeSizeForMenuItem(menuItem, item.size));
}

function findMenuItemForOrderItem(menu, item) {
  if (!item) {
    return null;
  }

  const byId = menu.find((entry) => entry.id === item.id);
  if (byId) {
    return byId;
  }

  const itemName = foldText(item.name);
  return menu.find((entry) => foldText(entry.name) === itemName) || null;
}

function menuPriceForSize(menuItem, size) {
  if (!menuItem || !menuItem.prices) {
    return 0;
  }

  const prices = menuItem.prices;
  const requestedSize = cleanText(size || "M").toUpperCase();
  const directPrice = Number(prices[requestedSize]);
  if (directPrice > 0) {
    return directPrice;
  }

  for (const fallbackSize of ["M", "L", "S"]) {
    const fallbackPrice = Number(prices[fallbackSize]);
    if (fallbackPrice > 0) {
      return fallbackPrice;
    }
  }

  const firstSize = Object.keys(prices).find((key) => Number(prices[key]) > 0);
  return firstSize ? Number(prices[firstSize]) : 0;
}

function normalizeSizeForMenuItem(menuItem, requestedSize) {
  const supportedSizes = supportedSizesForMenuItem(menuItem);
  const size = cleanText(requestedSize || "M").toUpperCase();

  if (!supportedSizes.length) {
    return size;
  }

  if (supportedSizes.includes(size)) {
    return size;
  }

  if (size === "S") {
    return supportedSizes[0];
  }

  if (size === "L") {
    return supportedSizes[supportedSizes.length - 1];
  }

  if (supportedSizes.includes("M")) {
    return "M";
  }

  return supportedSizes[Math.min(1, supportedSizes.length - 1)];
}

function supportedSizesForMenuItem(menuItem) {
  if (!menuItem) {
    return [];
  }

  if (menuSizeOptions[menuItem.id]) {
    return menuSizeOptions[menuItem.id].slice();
  }

  if (!menuItem.prices) {
    return [];
  }

  return ["S", "M", "L"].filter((size) => Number(menuItem.prices[size]) > 0);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function slugify(value) {
  return foldText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "item";
}

function foldText(value) {
  return cleanText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

const keepAlive = setInterval(() => {}, 60 * 60 * 1000);

server.on("close", () => {
  clearInterval(keepAlive);
});

server.listen(port, host, () => {
  console.log(`Voice Kitchen MVP running locally at http://localhost:${port}`);
  getNetworkUrls(port).forEach((url) => {
    console.log(`Phone URL on same Wi-Fi: ${url}`);
  });
});

function getNetworkUrls(activePort) {
  const urls = [];
  const interfaces = os.networkInterfaces();

  Object.values(interfaces).forEach((entries) => {
    (entries || []).forEach((entry) => {
      if (entry.family === "IPv4" && !entry.internal) {
        urls.push(`http://${entry.address}:${activePort}`);
      }
    });
  });

  return urls;
}
