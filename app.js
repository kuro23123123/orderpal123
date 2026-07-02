(function () {
  "use strict";

  var STORAGE_KEYS = {
    menu: "voiceKitchen.menu.v1",
    orders: "voiceKitchen.orders.v1",
    sequence: "voiceKitchen.sequence.v1",
    deviceName: "voiceKitchen.deviceName.v1"
  };

  var PRIMARY_WAKE_PHRASE = "ghi món";
  var WAKE_PHRASES = ["ghi món", "ghi mon", "bếp ơi", "bep oi", "hey chef"];
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = null;
  var listeningMode = "idle";
  var activeTranscript = "";
  var voiceAutoFinishTimer = null;
  var lastVoiceParseText = "";

  var MENU_PRICES = {
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

  var MENU_SIZE_OPTIONS = {
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

  var defaultMenu = applyMenuPrices([
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
  ]);

  var numberWords = {
    zero: 0,
    one: 1,
    a: 1,
    an: 1,
    two: 2,
    to: 2,
    too: 2,
    three: 3,
    four: 4,
    for: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    ate: 8,
    nine: 9,
    ten: 10,
    mot: 1,
    một: 1,
    hai: 2,
    ba: 3,
    bon: 4,
    bốn: 4,
    tư: 4,
    tu: 4,
    nam: 5,
    năm: 5,
    lăm: 5,
    lam: 5,
    sau: 6,
    sáu: 6,
    bay: 7,
    bảy: 7,
    tam: 8,
    tám: 8,
    chin: 9,
    chín: 9,
    muoi: 10,
    mười: 10
  };

  var DEFAULT_TASTE_NOTE = "vừa";
  var DEFAULT_ICE_NOTE = "vừa";
  var DEFAULT_SIZE_NOTE = "M";
  var itemNoteRules = [
    { label: "không đường", phrases: ["không đường", "khong duong", "không ngọt", "khong ngot"] },
    { label: "ít ngọt", phrases: ["ít ngọt", "it ngot", "ít đường", "it duong", "bớt ngọt", "bot ngot"] },
    { label: "ngọt", phrases: ["ngọt", "ngot", "nhiều ngọt", "nhieu ngot", "nhiều đường", "nhieu duong"] },
    { label: "chua", phrases: ["chua", "hơi chua", "hoi chua", "chua nhiều", "chua nhieu"] },
    { label: "vừa", phrases: ["vừa", "vua", "bình thường", "binh thuong", "vừa ngọt", "vua ngot"] }
  ];
  var iceNoteRules = [
    { label: "ít đá", phrases: ["ít đá", "it da", "bớt đá", "bot da", "đá ít", "da it", "đá bớt", "da bot"] },
    { label: "nhiều đá", phrases: ["nhiều đá", "nhieu da", "thêm đá", "them da", "đá nhiều", "da nhieu", "đá thêm", "da them"] },
    { label: "vừa", phrases: ["đá vừa", "da vua", "vừa đá", "vua da", "bình thường", "binh thuong"] }
  ];
  var sizeNoteRules = [
    { label: "S", phrases: ["size s", "size ét", "size nhỏ", "size nho", "ly nhỏ", "ly nho", "cỡ nhỏ", "co nho", "nhỏ", "nho"] },
    { label: "M", phrases: ["size m", "size em", "size vừa", "size vua", "ly vừa", "ly vua", "cỡ vừa", "co vua"] },
    { label: "L", phrases: ["size l", "size eo", "size lớn", "size lon", "ly lớn", "ly lon", "cỡ lớn", "co lon", "lớn", "lon"] }
  ];
  var prepNoteRules = [
    { label: "đánh kem", phrases: ["đánh kem", "danh kem"] }
  ];
  var containerNoteRules = [
    { label: "bình riêng", phrases: ["bình cá nhân", "binh ca nhan", "bình riêng", "binh rieng", "đựng trong bình", "dung trong binh", "dô trong bình", "do trong binh", "vô trong bình", "vo trong binh", "trong bình", "trong binh"] }
  ];
  var speechStopWords = [
    "cho", "em", "anh", "chi", "chị", "co", "cô", "chu", "chú", "khach", "khách",
    "lay", "lấy", "goi", "gọi", "order", "them", "thêm", "voi", "với", "va", "và",
    "nha", "nhe", "nhé", "a", "ạ", "gium", "giùm", "dum", "dùm", "giup", "giúp",
    "mot", "một", "ly", "coc", "cốc"
  ];
  var UNCLEAR_UNKNOWN_MIN = 5;
  var UNCLEAR_UNKNOWN_RATIO = 0.55;

  var state = {
    menu: upgradeMenu(loadJson(STORAGE_KEYS.menu, defaultMenu)),
    orders: loadJson(STORAGE_KEYS.orders, []),
    draft: [],
    editingOrderId: null,
    serverMode: false
  };

  var els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheElements();
    bindEvents();
    setupSpeech();
    els.deviceName.value = localStorage.getItem(STORAGE_KEYS.deviceName) || "";
    els.orderDate.value = todayDateKey();
    els.revenueDate.value = todayDateKey();
    renderAll();
    refreshStateFromServer(true);
    window.setInterval(function () {
      refreshStateFromServer(false);
    }, 2500);
  }

  function cacheElements() {
    els.viewButtons = document.querySelectorAll("[data-view-button]");
    els.views = document.querySelectorAll("[data-view]");
    els.speechSupport = document.getElementById("speech-support");
    els.voiceState = document.getElementById("voice-state");
    els.meter = document.querySelector(".meter");
    els.syncBanner = document.getElementById("sync-banner");
    els.transcript = document.getElementById("transcript-input");
    els.startWake = document.getElementById("start-wake");
    els.directOrder = document.getElementById("direct-order");
    els.stopListening = document.getElementById("stop-listening");
    els.parseTranscript = document.getElementById("parse-transcript");
    els.clearDraft = document.getElementById("clear-draft");
    els.draftList = document.getElementById("draft-list");
    els.draftNotice = document.getElementById("draft-notice");
    els.draftCount = document.getElementById("draft-count");
    els.orderNote = document.getElementById("order-note");
    els.orderDate = document.getElementById("order-date");
    els.orderLabel = document.getElementById("order-label");
    els.deviceName = document.getElementById("device-name");
    els.postOrder = document.getElementById("post-order");
    els.deleteOrder = document.getElementById("delete-order");
    els.postFeedback = document.getElementById("post-feedback");
    els.kitchenBoard = document.getElementById("kitchen-board");
    els.menuForm = document.getElementById("menu-form");
    els.menuName = document.getElementById("menu-name");
    els.menuAliases = document.getElementById("menu-aliases");
    els.menuList = document.getElementById("menu-list");
    els.revenueDate = document.getElementById("revenue-date");
    els.revenueTotal = document.getElementById("revenue-total");
    els.revenueOrders = document.getElementById("revenue-orders");
    els.revenueItems = document.getElementById("revenue-items");
    els.revenueSizeS = document.getElementById("revenue-size-s");
    els.revenueSizeM = document.getElementById("revenue-size-m");
    els.revenueSizeL = document.getElementById("revenue-size-l");
    els.revenueOwnBottles = document.getElementById("revenue-own-bottles");
    els.revenueBreakdown = document.getElementById("revenue-breakdown");
    els.revenueEmpty = document.getElementById("revenue-empty");
  }

  function bindEvents() {
    els.viewButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setActiveView(button.dataset.viewButton);
      });
    });

    els.startWake.addEventListener("click", startWakeListening);
    els.directOrder.addEventListener("click", startOrderListening);
    els.stopListening.addEventListener("click", stopListening);
    els.parseTranscript.addEventListener("click", function () {
      parseAndSetDraft(els.transcript.value);
    });
    els.clearDraft.addEventListener("click", clearDraft);
    els.postOrder.addEventListener("click", postDraftOrder);
    els.deleteOrder.addEventListener("click", deleteEditingOrder);
    els.revenueDate.addEventListener("change", renderRevenue);
    els.deviceName.addEventListener("input", function () {
      localStorage.setItem(STORAGE_KEYS.deviceName, els.deviceName.value.trim());
    });

    els.menuForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addMenuItem();
    });

    window.addEventListener("storage", function (event) {
      if (event.key === STORAGE_KEYS.orders) {
        state.orders = loadJson(STORAGE_KEYS.orders, []);
        renderKitchen();
        renderRevenue();
      }
      if (event.key === STORAGE_KEYS.menu) {
        state.menu = upgradeMenu(loadJson(STORAGE_KEYS.menu, defaultMenu));
        if (!isEditingMenuAliases()) {
          renderMenu();
        }
        renderRevenue();
      }
    });
  }

  function refreshStateFromServer(showStatus) {
    apiRequest("/api/state")
      .then(function (data) {
        state.serverMode = true;
        state.menu = data.menu || state.menu;
        state.orders = data.orders || [];
        saveJson(STORAGE_KEYS.menu, state.menu);
        saveJson(STORAGE_KEYS.orders, state.orders);
        setSyncStatus("Đã đồng bộ với máy chủ local của quán.", "online");
        renderKitchen();
        if (!isEditingMenuAliases()) {
          renderMenu();
        }
        renderRevenue();
      })
      .catch(function () {
        state.serverMode = false;
        if (showStatus) {
          setSyncStatus("Chỉ lưu trên thiết bị này. Bật server local để điện thoại gửi món sang bếp.", "local");
        }
      });
  }

  function apiRequest(path, options) {
    return fetch(path, Object.assign({
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store"
    }, options || {})).then(function (response) {
      if (!response.ok) {
        return response.json().catch(function () {
          return {};
        }).then(function (body) {
          throw new Error(body.error || "Request failed.");
        });
      }
      return response.json();
    });
  }

  function setSyncStatus(message, mode) {
    els.syncBanner.textContent = message;
    els.syncBanner.classList.toggle("is-online", mode === "online");
    els.syncBanner.classList.toggle("is-local", mode === "local");
  }

  function setupSpeech() {
    if (!SpeechRecognition) {
      els.speechSupport.textContent = "Trình duyệt không hỗ trợ mic trực tiếp. Dùng ô nhập rồi bấm Tách món.";
      els.startWake.disabled = true;
      els.directOrder.disabled = true;
      els.stopListening.disabled = true;
      setVoiceState("Idle", "idle");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = function (event) {
      var finalText = "";
      var interimText = "";

      for (var i = event.resultIndex; i < event.results.length; i += 1) {
        var text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += " " + text;
        } else {
          interimText += " " + text;
        }
      }

      if (interimText.trim()) {
        els.transcript.value = (activeTranscript + " " + interimText.trim()).trim();
        scheduleVoiceAutoFinish(1000);
      }

      if (finalText.trim()) {
        handleFinalSpeech(finalText.trim());
      }
    };

    recognition.onerror = function (event) {
      setVoiceState("Lỗi mic", "processing");
      els.speechSupport.textContent = "Lỗi micro: " + event.error + ". Nếu điện thoại đang mở bằng HTTP và bị chặn mic, cần chạy bản HTTPS local.";
      stopListening(false);
      listeningMode = "idle";
      setVoiceButtons(false);
    };

    recognition.onend = function () {
      if (listeningMode === "wake") {
        try {
          recognition.start();
        } catch (error) {
          setVoiceState("Idle", "idle");
        }
        return;
      }

      if (listeningMode === "order") {
        if (!finishOrderSpeech(activeTranscript || els.transcript.value, false)) {
          listeningMode = "idle";
          setVoiceButtons(false);
          setVoiceState("Không nghe rõ", "idle");
          els.speechSupport.textContent = "Không nghe rõ. Bấm Nói món và nói lại.";
        }
      }
    };

    els.speechSupport.textContent = window.isSecureContext ? "Bấm Nói món rồi nói tên món." : "Bấm Nói món. Nếu trình duyệt chặn mic trên HTTP, cần chạy bản HTTPS local.";
    setVoiceState("Chờ", "idle");
    setVoiceButtons(false);
  }

  function startWakeListening() {
    if (!recognition) {
      return;
    }
    activeTranscript = "";
    lastVoiceParseText = "";
    clearVoiceAutoFinishTimer();
    els.transcript.value = "";
    listeningMode = "wake";
    setVoiceState("Đang chờ", "listening");
    els.speechSupport.textContent = "Đang chờ câu Ghi món.";
    startRecognition();
  }

  function startOrderListening() {
    if (!recognition) {
      els.speechSupport.textContent = "Trình duyệt không hỗ trợ mic trực tiếp. Dùng ô nhập rồi bấm Tách món.";
      return;
    }
    activeTranscript = "";
    els.transcript.value = "";
    listeningMode = "order";
    setVoiceState("Đang nghe", "listening");
    setVoiceButtons(true);
    els.speechSupport.textContent = "Đang nghe. Nói ngắn gọn: sữa nhỏ ngọt ít đá, hoặc 1 sữa nhỏ 1 trà lài.";
    startRecognition();
  }

  function startRecognition() {
    try {
      recognition.start();
    } catch (error) {
      recognition.stop();
      setTimeout(function () {
        try {
          recognition.start();
        } catch (innerError) {
          els.speechSupport.textContent = "Không mở được micro. Nhập hoặc dùng micro bàn phím rồi bấm Tách món.";
          setVoiceState("Chờ", "idle");
          setVoiceButtons(false);
        }
      }, 120);
    }
  }

  function stopListening(resetMode) {
    if (resetMode !== false) {
      listeningMode = "idle";
    }
    clearVoiceAutoFinishTimer();
    if (recognition) {
      try {
        recognition.stop();
      } catch (error) {
        // Browser already stopped recognition.
      }
    }
    if (listeningMode === "idle") {
      setVoiceState("Chờ", "idle");
      els.speechSupport.textContent = SpeechRecognition ? "Bấm Nói món rồi nói tên món." : els.speechSupport.textContent;
    }
    setVoiceButtons(false);
  }

  function setVoiceButtons(isListening) {
    if (!els.directOrder || !els.stopListening) {
      return;
    }

    els.directOrder.disabled = !recognition || isListening;
    els.stopListening.disabled = !recognition || !isListening;
  }

  function scheduleVoiceAutoFinish(delayMs) {
    if (listeningMode !== "order") {
      return;
    }

    clearVoiceAutoFinishTimer();
    voiceAutoFinishTimer = window.setTimeout(function () {
      finishOrderSpeech(els.transcript.value || activeTranscript, true);
    }, delayMs || 1000);
  }

  function clearVoiceAutoFinishTimer() {
    if (!voiceAutoFinishTimer) {
      return;
    }

    window.clearTimeout(voiceAutoFinishTimer);
    voiceAutoFinishTimer = null;
  }

  function finishOrderSpeech(rawText, stopMic) {
    clearVoiceAutoFinishTimer();
    var text = stripWakePhrase(rawText || "").trim();

    if (!text) {
      return false;
    }

    if (text === lastVoiceParseText) {
      listeningMode = "idle";
      setVoiceButtons(false);
      return true;
    }

    lastVoiceParseText = text;
    activeTranscript = text;
    els.transcript.value = text;

    if (containsCancelCommand(text)) {
      clearDraft();
      listeningMode = "idle";
      setVoiceButtons(false);
      return true;
    }

    parseAndSetDraft(text);
    listeningMode = "idle";
    setVoiceButtons(false);

    if (stopMic && recognition) {
      try {
        recognition.stop();
      } catch (error) {
        // Browser may already have stopped recognition.
      }
    }

    return true;
  }

  function handleFinalSpeech(text) {
    activeTranscript = (activeTranscript + " " + text).trim();

    if (containsCancelCommand(activeTranscript)) {
      clearDraft();
      stopListening();
      return;
    }

    if (listeningMode === "wake") {
      var wake = findWakePhrase(activeTranscript);
      if (!wake) {
        return;
      }

      var afterWake = stripWakePhrase(activeTranscript);
      if (afterWake.trim()) {
        els.transcript.value = afterWake.trim();
        parseAndSetDraft(afterWake);
        stopListening();
      } else {
        activeTranscript = "";
        els.transcript.value = "";
        listeningMode = "order";
        setVoiceState("Ghi món", "listening");
        els.speechSupport.textContent = "Đang nghe món.";
      }
      return;
    }

    if (listeningMode === "order") {
      finishOrderSpeech(activeTranscript, true);
    }
  }

  function parseAndSetDraft(rawText) {
    var text = stripWakePhrase(rawText || "");
    els.transcript.value = text;
    setVoiceState("Đang tách", "processing");

    window.setTimeout(function () {
      var result = parseOrder(text);
      if (result.tooUnclear) {
        if (!state.editingOrderId) {
          state.draft = [];
        }
        renderDraft(result);
        scrollDraftIntoView();
        setVoiceState("Không nghe rõ", "idle");
        els.speechSupport.textContent = "Không nghe rõ. Bấm Nói món và nói lại ngắn hơn.";
        return;
      }

      if (state.editingOrderId) {
        state.draft = mergeDraftItems(state.draft, result.items);
        result = Object.assign({}, result, {
          needsReview: result.needsReview,
          addedToExistingDraft: true
        });
      } else {
        state.draft = result.items;
      }
      renderDraft(result);
      scrollDraftIntoView();
      setVoiceState("Sẵn sàng", "idle");
      els.speechSupport.textContent = "Đã tách món. Kiểm tra Order nháp rồi bấm Gửi bếp.";
    }, 40);
  }

  function parseOrder(text) {
    var normalized = normalizeText(text);
    var folded = foldText(normalized);
    var foldedTokens = folded.split(" ").filter(Boolean);
    var matches = [];
    var occupied = [];
    var terms = buildMenuTerms();

    terms.forEach(function (term) {
      collectTermMatches(normalized, term.term, term, matches, occupied, 0);
      if (term.foldedTerm !== term.term) {
        collectTermMatches(folded, term.foldedTerm, term, matches, occupied, 0.03);
      }
    });

    if (!matches.length) {
      matches = fuzzyMatches(foldedTokens, terms);
    }

    attachItemNotes(matches, folded);
    var clarity = analyzeRecognitionClarity(foldedTokens, matches, terms);

    return {
      items: clarity.tooUnclear ? [] : combineMatches(matches),
      raw: text,
      needsReview: clarity.tooUnclear || matches.some(function (item) { return item.confidence < 0.9; }),
      tooUnclear: clarity.tooUnclear,
      unknownTokens: clarity.unknownTokens
    };
  }

  function buildMenuTerms() {
    var terms = [];
    state.menu
      .filter(function (item) { return item.active !== false; })
      .forEach(function (item) {
        addMenuTerm(terms, item.name, item, false);
        (item.aliases || []).forEach(function (alias) {
          if (alias.trim()) {
            addMenuTerm(terms, alias, item, true);
          }
        });
      });

    terms.sort(function (a, b) {
      return b.term.length - a.term.length;
    });
    return terms;
  }

  function addMenuTerm(terms, value, item, isAlias) {
    var term = normalizeText(value);
    if (!term) {
      return;
    }

    terms.push({
      term: term,
      foldedTerm: foldText(term),
      item: item,
      isAlias: isAlias
    });
  }

  function analyzeRecognitionClarity(tokens, matches, terms) {
    var knownTokens = buildKnownSpeechTokens(terms);
    var meaningfulTokens = tokens.filter(function (token) {
      return token && speechStopWords.indexOf(token) === -1;
    });
    var unknownTokens = meaningfulTokens.filter(function (token) {
      return !knownTokens[token] && !isQuantityToken(token) && !isCupClassifier(token);
    });
    var unknownRatio = meaningfulTokens.length ? unknownTokens.length / meaningfulTokens.length : 0;
    var noMenuMatch = !matches.length && meaningfulTokens.length >= 2;
    var tooManyUnknown = matches.length > 0 && unknownTokens.length >= UNCLEAR_UNKNOWN_MIN && unknownRatio >= UNCLEAR_UNKNOWN_RATIO;

    return {
      tooUnclear: noMenuMatch || tooManyUnknown,
      unknownTokens: unknownTokens
    };
  }

  function buildKnownSpeechTokens(terms) {
    var known = {};

    (terms || []).forEach(function (term) {
      term.foldedTerm.split(" ").filter(Boolean).forEach(function (token) {
        known[token] = true;
      });
    });

    [itemNoteRules, iceNoteRules, sizeNoteRules, prepNoteRules, containerNoteRules].forEach(function (ruleSet) {
      ruleSet.forEach(function (rule) {
        rule.phrases.forEach(function (phrase) {
          foldText(phrase).split(" ").filter(Boolean).forEach(function (token) {
            known[token] = true;
          });
        });
      });
    });

    speechStopWords.forEach(function (token) {
      known[token] = true;
    });

    return known;
  }

  function collectTermMatches(sourceText, queryTerm, term, matches, occupied, confidenceDrop) {
    if (!queryTerm) {
      return;
    }

    var pattern = escapeRegex(queryTerm).replace(/\s+/g, "\\s+");
    var regex = new RegExp("(^|[^\\p{L}\\p{N}])(" + pattern + ")(?=$|[^\\p{L}\\p{N}])", "gu");
    var match;

    while ((match = regex.exec(sourceText)) !== null) {
      var start = match.index + match[1].length;
      var end = start + match[2].length;
      if (hasOverlap(occupied, start, end)) {
        continue;
      }

      occupied.push([start, end]);
      matches.push({
        id: term.item.id,
        name: term.item.name,
        quantity: quantityBefore(sourceText, start),
        confidence: Math.max(0.72, (term.isAlias ? 0.88 : 0.96) - confidenceDrop),
        source: term.isAlias ? "tên gọi khác" : "khớp menu",
        position: start,
        end: end,
        hasCharRange: true,
        defaultSize: defaultSizeForMenuItem(term.item)
      });
    }
  }

  function fuzzyMatches(tokens, terms) {
    var results = [];
    var seen = {};

    terms.forEach(function (term) {
      var termTokens = term.foldedTerm.split(" ").filter(Boolean);
      if (!termTokens.length || tokens.length < termTokens.length) {
        return;
      }

      var bestScore = 0;
      var bestStart = 0;
      for (var i = 0; i <= tokens.length - termTokens.length; i += 1) {
        var phrase = tokens.slice(i, i + termTokens.length).join(" ");
        var score = similarity(phrase, term.foldedTerm);
        if (score > bestScore) {
          bestScore = score;
          bestStart = i;
        }
      }

      if (bestScore >= 0.74 && !seen[term.item.id]) {
        seen[term.item.id] = true;
        results.push({
          id: term.item.id,
          name: term.item.name,
          quantity: quantityFromTokens(tokens.slice(0, bestStart)),
          confidence: Math.min(0.86, Math.max(0.72, bestScore)),
          source: "cần kiểm tra",
          position: bestStart,
          end: bestStart,
          hasCharRange: false,
          defaultSize: defaultSizeForMenuItem(term.item)
        });
      }
    });

    return results.sort(function (a, b) {
      return b.confidence - a.confidence;
    }).slice(0, 3);
  }

  function attachItemNotes(matches, foldedText) {
    var orderedMatches = matches
      .filter(function (match) {
        return match.hasCharRange;
      })
      .sort(function (a, b) {
        return a.position - b.position;
      });

    orderedMatches.forEach(function (match, index) {
      var nextMatch = orderedMatches[index + 1];
      var segmentEnd = nextMatch ? nextMatch.position : foldedText.length;
      var noteSegment = foldedText.slice(match.end, segmentEnd);
      match.taste = extractTasteNote(noteSegment);
      match.ice = extractIceNote(noteSegment);
      match.size = extractSizeNote(noteSegment, match.defaultSize, match);
      match.prep = extractPrepNote(noteSegment);
      match.ownBottle = extractContainerNote(noteSegment) === "bình riêng";
    });
  }

  function extractTasteNote(segment) {
    return extractOptionLabel(segment, itemNoteRules, DEFAULT_TASTE_NOTE);
  }

  function extractIceNote(segment) {
    var matches = collectOptionMatches(segment, iceNoteRules);
    if (!matches.length) {
      return DEFAULT_ICE_NOTE;
    }

    matches.sort(function (a, b) {
      return a.position - b.position;
    });
    return matches[matches.length - 1].label;
  }

  function extractSizeNote(segment, fallback, itemLike) {
    var requestedSize = extractOptionLabel(segment, sizeNoteRules, fallback || DEFAULT_SIZE_NOTE);
    return normalizeSizeForMenuItem(itemLike, requestedSize);
  }

  function extractPrepNote(segment) {
    return extractAllOptionLabels(segment, prepNoteRules).join(", ");
  }

  function extractContainerNote(segment) {
    return extractOptionLabel(segment, containerNoteRules, "");
  }

  function extractOptionLabel(segment, rules, fallback) {
    var matches = collectOptionMatches(segment, rules);
    var bestMatch = matches.sort(function (a, b) {
      return a.position - b.position;
    })[0];

    return bestMatch ? bestMatch.label : fallback;
  }

  function collectOptionMatches(segment, rules) {
    var foldedSegment = foldText(segment);
    var matches = [];

    rules.forEach(function (rule) {
      rule.phrases.forEach(function (phrase) {
        var foldedPhrase = foldText(phrase);
        var regex = new RegExp("(^|[^\\p{L}\\p{N}])(" + escapeRegex(foldedPhrase).replace(/\s+/g, "\\s+") + ")(?=$|[^\\p{L}\\p{N}])", "gu");
        var match;

        while ((match = regex.exec(foldedSegment)) !== null) {
          matches.push({
            label: rule.label,
            position: match.index + match[1].length
          });
        }
      });
    });

    return matches;
  }

  function extractAllOptionLabels(segment, rules) {
    var foldedSegment = foldText(segment);
    var labels = [];

    rules.forEach(function (rule) {
      rule.phrases.some(function (phrase) {
        var foldedPhrase = foldText(phrase);
        var regex = new RegExp("(^|[^\\p{L}\\p{N}])(" + escapeRegex(foldedPhrase).replace(/\s+/g, "\\s+") + ")(?=$|[^\\p{L}\\p{N}])", "gu");
        if (regex.test(foldedSegment)) {
          labels.push(rule.label);
          return true;
        }
        return false;
      });
    });

    return labels;
  }

  function defaultSizeForMenuItem(item) {
    return normalizeSizeForMenuItem(item, DEFAULT_SIZE_NOTE);
  }

  function normalizeSizeForMenuItem(itemLike, requestedSize) {
    var supportedSizes = supportedSizesForMenuItem(itemLike);
    var size = String(requestedSize || DEFAULT_SIZE_NOTE).toUpperCase();

    if (!supportedSizes.length) {
      return size;
    }

    if (supportedSizes.indexOf(size) !== -1) {
      return size;
    }

    if (size === "S") {
      return supportedSizes[0];
    }

    if (size === "L") {
      return supportedSizes[supportedSizes.length - 1];
    }

    if (supportedSizes.indexOf(DEFAULT_SIZE_NOTE) !== -1) {
      return DEFAULT_SIZE_NOTE;
    }

    return supportedSizes[Math.min(1, supportedSizes.length - 1)];
  }

  function supportedSizesForMenuItem(itemLike) {
    var menuItem = findMenuItemForOrderItem(itemLike);
    var explicitSizes = explicitSizeOptionsForMenuItem(menuItem || itemLike);
    if (explicitSizes.length) {
      return explicitSizes;
    }

    var prices = menuItem && menuItem.prices;
    if (!prices && itemLike && itemLike.id) {
      prices = MENU_PRICES[itemLike.id];
    }

    if (!prices) {
      return [];
    }

    return ["S", "M", "L"].filter(function (size) {
      return Number(prices[size]) > 0;
    });
  }

  function explicitSizeOptionsForMenuItem(itemLike) {
    if (!itemLike) {
      return [];
    }

    if (itemLike.id && MENU_SIZE_OPTIONS[itemLike.id]) {
      return MENU_SIZE_OPTIONS[itemLike.id].slice();
    }

    var foldedName = foldText(itemLike.name);
    var foundId = Object.keys(MENU_SIZE_OPTIONS).find(function (id) {
      var menuItem = state.menu.find(function (entry) {
        return entry.id === id;
      });
      return menuItem && foldText(menuItem.name) === foldedName;
    });

    return foundId ? MENU_SIZE_OPTIONS[foundId].slice() : [];
  }

  function combineMatches(matches) {
    var combined = {};

    matches.forEach(function (match) {
      var itemTaste = match.taste || DEFAULT_TASTE_NOTE;
      var itemIce = match.ice || DEFAULT_ICE_NOTE;
      var itemSize = match.size || match.defaultSize || DEFAULT_SIZE_NOTE;
      var itemPrep = match.prep || "";
      var itemOwnBottle = Boolean(match.ownBottle);
      var combineKey = match.id + "::" + itemSize + "::" + itemTaste + "::" + itemIce + "::" + itemPrep + "::" + itemOwnBottle;

      if (!combined[combineKey]) {
        combined[combineKey] = {
          draftKey: combineKey,
          id: match.id,
          name: match.name,
          quantity: 0,
          confidence: match.confidence,
          source: match.source,
          position: match.position,
          size: itemSize,
          taste: itemTaste,
          ice: itemIce,
          prep: itemPrep,
          ownBottle: itemOwnBottle,
          container: itemOwnBottle ? "bình riêng" : "",
          note: itemTaste
        };
      }

      combined[combineKey].quantity += Math.max(1, match.quantity);
      combined[combineKey].confidence = Math.max(combined[combineKey].confidence, match.confidence);
      combined[combineKey].position = Math.min(combined[combineKey].position, match.position);
      if (match.source === "cần kiểm tra") {
        combined[combineKey].source = "cần kiểm tra";
      }
    });

    return Object.keys(combined).map(function (id) {
      return combined[id];
    }).sort(function (a, b) {
      return a.position - b.position;
    });
  }

  function quantityBefore(text, index) {
    var tokens = text.slice(0, index).trim().split(" ").filter(Boolean);
    if (!tokens.length) {
      return 1;
    }

    var last = tokens[tokens.length - 1];
    var previous = tokens[tokens.length - 2];
    if (isQuantityToken(last)) {
      return quantityTokenValue(last);
    }
    if (isCupClassifier(last) && isQuantityToken(previous)) {
      return quantityTokenValue(previous);
    }
    return 1;
  }

  function quantityFromTokens(tokens) {
    var useful = tokens.slice(-5);
    for (var i = useful.length - 1; i >= 0; i -= 1) {
      var token = useful[i];
      if (/^\d+$/.test(token)) {
        return parseInt(token, 10);
      }
      if (Object.prototype.hasOwnProperty.call(numberWords, token)) {
        return numberWords[token];
      }
    }
    return 1;
  }

  function isQuantityToken(token) {
    return /^\d+$/.test(token || "") || Object.prototype.hasOwnProperty.call(numberWords, token);
  }

  function quantityTokenValue(token) {
    if (/^\d+$/.test(token || "")) {
      return parseInt(token, 10);
    }
    return numberWords[token] || 1;
  }

  function isCupClassifier(token) {
    return ["ly", "cốc", "coc"].indexOf(token) !== -1;
  }

  function hasOverlap(ranges, start, end) {
    return ranges.some(function (range) {
      return start < range[1] && end > range[0];
    });
  }

  function renderAll() {
    renderDraft();
    renderKitchen();
    renderMenu();
    renderRevenue();
  }

  function renderDraft(parseResult) {
    els.draftList.innerHTML = "";
    var count = state.draft.reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);

    els.draftCount.textContent = count + " món";
    els.postOrder.disabled = state.draft.length === 0;
    updatePostOrderButtonLabel();

    if (!state.draft.length) {
      els.draftNotice.hidden = false;
      if (parseResult && parseResult.tooUnclear) {
        els.draftNotice.textContent = "Không nghe rõ. Nói lại tên món ngắn hơn, ví dụ: sữa nhỏ ngọt ít đá.";
      } else {
        els.draftNotice.textContent = state.editingOrderId ? "Đang sửa " + state.editingOrderId + ". Nhập lại order mới hoặc hủy để quay về tạo order mới." : (parseResult && parseResult.raw ? "Chưa tìm thấy món trong menu." : "Chưa có món nháp.");
      }
      els.draftNotice.classList.toggle("is-warning", Boolean(parseResult && parseResult.raw));
      return;
    }

    els.draftNotice.hidden = state.editingOrderId ? false : (parseResult ? !parseResult.needsReview : true);
    if (parseResult && parseResult.tooUnclear) {
      els.draftNotice.hidden = false;
      els.draftNotice.textContent = "Không nghe rõ phần vừa nói. Order nháp hiện tại được giữ nguyên, hãy nói lại.";
    } else {
      els.draftNotice.textContent = state.editingOrderId ? "Đang sửa " + state.editingOrderId + ". Kiểm tra lại trước khi cập nhật." : "Kiểm tra món gợi ý trước khi gửi bếp.";
    }
    els.draftNotice.classList.toggle("is-warning", Boolean(parseResult && parseResult.needsReview));

    state.draft.forEach(function (item) {
      var row = document.createElement("article");
      row.className = "draft-item";
      var itemSize = normalizeSizeForMenuItem(item, item.size || DEFAULT_SIZE_NOTE);
      var itemTaste = item.taste || item.note || DEFAULT_TASTE_NOTE;
      var itemIce = item.ice || DEFAULT_ICE_NOTE;
      var itemPrep = renderItemPrepNote(item);
      row.innerHTML =
        '<div>' +
          '<div class="order-item-pair">' +
            '<div class="order-item-cell order-item-name"><span>' + escapeHtml(item.name) + '</span><span class="size-badge">' + escapeHtml(itemSize) + '</span></div>' +
            '<div class="order-item-cell order-item-taste">' + escapeHtml(itemTaste) + '</div>' +
            '<div class="order-item-cell order-item-ice">' + escapeHtml(itemIce) + '</div>' +
          '</div>' +
          itemPrep +
          '<div class="item-subtext">' +
            escapeHtml(item.source) +
            ' · ' +
            Math.round(item.confidence * 100) + "% " + (item.confidence >= 0.9 ? "khớp" : "kiểm tra") +
          '</div>' +
        '</div>' +
        '<div class="qty-control">' +
          '<button type="button" data-draft-action="decrease" data-key="' + escapeHtml(item.draftKey) + '" aria-label="Giảm ' + escapeHtml(item.name) + '">-</button>' +
          '<span class="qty-value">' + item.quantity + '</span>' +
          '<button type="button" data-draft-action="increase" data-key="' + escapeHtml(item.draftKey) + '" aria-label="Tăng ' + escapeHtml(item.name) + '">+</button>' +
          '<button type="button" data-draft-action="remove" data-key="' + escapeHtml(item.draftKey) + '" aria-label="Xóa ' + escapeHtml(item.name) + '">x</button>' +
        '</div>';

      els.draftList.appendChild(row);
    });

    els.draftList.querySelectorAll("[data-draft-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        updateDraftItem(button.dataset.key, button.dataset.draftAction);
      });
    });
  }

  function updateDraftItem(key, action) {
    state.draft = state.draft.reduce(function (items, item) {
      if (item.draftKey !== key) {
        items.push(item);
        return items;
      }

      if (action === "remove") {
        return items;
      }

      var next = Object.assign({}, item);
      if (action === "increase") {
        next.quantity += 1;
      }
      if (action === "decrease") {
        next.quantity -= 1;
      }
      if (next.quantity > 0) {
        items.push(next);
      }
      return items;
    }, []);
    renderDraft();
  }

  function scrollDraftIntoView() {
    var target = document.getElementById("draft-title");
    if (!target) {
      return;
    }

    window.setTimeout(function () {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 40);
  }

  function mergeDraftItems(existingItems, parsedItems) {
    var seen = {};
    var merged = (existingItems || []).map(function (item) {
      seen[draftItemDuplicateKey(item)] = true;
      return item;
    });

    (parsedItems || []).forEach(function (item) {
      var duplicateKey = draftItemDuplicateKey(item);
      if (seen[duplicateKey]) {
        return;
      }

      seen[duplicateKey] = true;
      var signature = draftItemSignature(item);
      merged.push(Object.assign({}, item, {
        draftKey: state.editingOrderId + "::added::" + Date.now().toString(36) + "::" + merged.length + "::" + signature,
        source: "món thêm"
      }));
    });

    return merged;
  }

  function draftItemDuplicateKey(item) {
    return item.id || foldText(item.name);
  }

  function draftItemSignature(item) {
    return [
      item.id || foldText(item.name),
      item.size || DEFAULT_SIZE_NOTE,
      item.taste || item.note || DEFAULT_TASTE_NOTE,
      item.ice || DEFAULT_ICE_NOTE,
      item.prep || "",
      isOwnBottleItem(item) ? "bình riêng" : ""
    ].join("::");
  }

  function updatePostOrderButtonLabel() {
    els.postOrder.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path d="M22 2 11 13"></path>' +
        '<path d="m22 2-7 20-4-9-9-4 20-7Z"></path>' +
      '</svg>' +
      (state.editingOrderId ? "Cập nhật order" : "Gửi bếp");
    els.deleteOrder.hidden = !state.editingOrderId;
    els.deleteOrder.disabled = !state.editingOrderId;
  }

  function clearDraft() {
    state.draft = [];
    activeTranscript = "";
    els.transcript.value = "";
    els.orderNote.value = "";
    els.orderDate.value = todayDateKey();
    els.orderLabel.value = "";
    els.postFeedback.textContent = "";
    state.editingOrderId = null;
    renderDraft();
  }

  function postDraftOrder() {
    if (!state.draft.length) {
      return;
    }

    var payload = buildOrderPayload();

    if (state.editingOrderId) {
      updateExistingOrder(payload);
      return;
    }

    if (state.serverMode) {
      els.postOrder.disabled = true;
      apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload)
      }).then(function (order) {
        state.orders.unshift(order);
        saveJson(STORAGE_KEYS.orders, state.orders);
        clearDraft();
        renderKitchen();
        els.postFeedback.textContent = "Đã gửi " + order.id + ".";
        setActiveView("kitchen");
      }).catch(function (error) {
        els.postOrder.disabled = false;
        els.postFeedback.textContent = error.message || "Không gửi được order.";
        setSyncStatus("Không kết nối được server. Order chưa được gửi sang bếp.", "local");
      });
      return;
    }

    var order = {
      id: nextOrderId(),
      createdAt: new Date().toISOString(),
      createdBy: payload.createdBy,
      label: payload.label,
      businessDate: payload.businessDate,
      status: "new",
      note: payload.note,
      items: payload.items
    };

    state.orders.unshift(order);
    saveJson(STORAGE_KEYS.orders, state.orders);
    clearDraft();
    renderKitchen();
    els.postFeedback.textContent = "Đã gửi " + order.id + ".";
    setActiveView("kitchen");
  }

  function buildOrderPayload() {
    return {
      createdBy: els.deviceName.value.trim() || "Máy nhân viên",
      label: els.orderLabel.value.trim(),
      businessDate: normalizeDateKey(els.orderDate.value) || todayDateKey(),
      note: els.orderNote.value.trim(),
      items: state.draft.map(function (item) {
        return {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          size: normalizeSizeForMenuItem(item, item.size || DEFAULT_SIZE_NOTE),
          taste: item.taste || item.note || DEFAULT_TASTE_NOTE,
          ice: item.ice || DEFAULT_ICE_NOTE,
          prep: item.prep || "",
          ownBottle: isOwnBottleItem(item),
          container: isOwnBottleItem(item) ? "bình riêng" : "",
          unitPrice: getItemUnitPrice(item),
          note: item.taste || item.note || DEFAULT_TASTE_NOTE
        };
      })
    };
  }

  function updateExistingOrder(payload) {
    var editingOrderId = state.editingOrderId;
    if (state.serverMode) {
      els.postOrder.disabled = true;
      apiRequest("/api/orders/" + encodeURIComponent(editingOrderId), {
        method: "PATCH",
        body: JSON.stringify(payload)
      }).then(function (updatedOrder) {
        state.orders = state.orders.map(function (order) {
          return order.id === updatedOrder.id ? updatedOrder : order;
        });
        saveJson(STORAGE_KEYS.orders, state.orders);
        clearDraft();
        renderKitchen();
        els.postFeedback.textContent = "Đã cập nhật " + updatedOrder.id + ".";
        setActiveView("kitchen");
      }).catch(function (error) {
        els.postOrder.disabled = false;
        els.postFeedback.textContent = error.message || "Không cập nhật được order.";
        setSyncStatus("Không kết nối được server. Order chưa được cập nhật.", "local");
      });
      return;
    }

    state.orders = state.orders.map(function (order) {
      if (order.id !== editingOrderId) {
        return order;
      }
      return Object.assign({}, order, {
        label: payload.label,
        businessDate: payload.businessDate,
        note: payload.note,
        items: payload.items,
        status: "new",
        hiddenFromKitchen: false,
        updatedAt: new Date().toISOString(),
        editedBy: payload.createdBy
      });
    });
    saveJson(STORAGE_KEYS.orders, state.orders);
    clearDraft();
    renderKitchen();
    els.postFeedback.textContent = "Đã cập nhật " + editingOrderId + ".";
    setActiveView("kitchen");
  }

  function deleteEditingOrder() {
    var editingOrderId = state.editingOrderId;
    if (!editingOrderId) {
      return;
    }

    if (!window.confirm("Xóa hoàn toàn " + editingOrderId + "? Order này sẽ mất khỏi bếp và doanh thu.")) {
      return;
    }

    els.deleteOrder.disabled = true;
    els.postOrder.disabled = true;

    if (state.serverMode) {
      apiRequest("/api/orders/" + encodeURIComponent(editingOrderId), {
        method: "DELETE"
      }).then(function (data) {
        state.orders = data.orders || state.orders.filter(function (order) {
          return order.id !== editingOrderId;
        });
        saveJson(STORAGE_KEYS.orders, state.orders);
        clearDraft();
        renderKitchen();
        renderRevenue();
        els.postFeedback.textContent = "Đã xóa " + editingOrderId + ".";
        setActiveView("kitchen");
      }).catch(function (error) {
        els.deleteOrder.disabled = false;
        els.postOrder.disabled = false;
        els.postFeedback.textContent = error.message || "Không xóa được order.";
        setSyncStatus("Không kết nối được server. Order chưa được xóa.", "local");
      });
      return;
    }

    state.orders = state.orders.filter(function (order) {
      return order.id !== editingOrderId;
    });
    saveJson(STORAGE_KEYS.orders, state.orders);
    clearDraft();
    renderKitchen();
    renderRevenue();
    els.postFeedback.textContent = "Đã xóa " + editingOrderId + ".";
    setActiveView("kitchen");
  }

  function renderKitchen() {
    var statuses = [
      { key: "new", label: "Mới" },
      { key: "done", label: "Xong" }
    ];

    els.kitchenBoard.innerHTML = "";

    statuses.forEach(function (status) {
      var orders = state.orders.filter(function (order) {
        return kitchenStatusKey(order) === status.key && !order.hiddenFromKitchen;
      }).sort(compareKitchenOrders);

      var column = document.createElement("section");
      column.className = "status-column status-column-" + status.key;
      column.innerHTML = (status.key === "done" ? clearDoneButtonHtml() : "") + statusColumnHeaderHtml(status, orders.length);

      if (!orders.length) {
        var empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "Chưa có order.";
        column.appendChild(empty);
      }

      orders.forEach(function (order) {
        column.appendChild(renderOrderCard(order));
      });

      els.kitchenBoard.appendChild(column);
    });

    var clearDoneButton = els.kitchenBoard.querySelector("#clear-done");
    if (clearDoneButton) {
      clearDoneButton.addEventListener("click", clearDoneOrders);
    }

    renderRevenue();
  }

  function statusColumnHeaderHtml(status, count) {
    return '' +
      '<div class="status-column-heading">' +
        '<h3>' + escapeHtml(status.label) + '</h3>' +
        '<span class="status-count">' + count + ' order</span>' +
      '</div>';
  }

  function clearDoneButtonHtml() {
    return '' +
      '<button class="clear-done-inline" type="button" id="clear-done">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M3 6h18"></path>' +
          '<path d="M8 6V4h8v2"></path>' +
          '<path d="m19 6-1 14H6L5 6"></path>' +
        '</svg>' +
        'Xóa món xong' +
      '</button>';
  }

  function compareKitchenOrders(a, b) {
    var numberA = orderNumber(a);
    var numberB = orderNumber(b);
    if (numberA !== numberB) {
      return numberA - numberB;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }

  function orderNumber(order) {
    var match = String(order && order.id || "").match(/\d+/);
    return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
  }

  function renderOrderCard(order) {
    var card = document.createElement("article");
    card.className = "order-card " + orderToneClass(order);

    var items = order.items.map(function (item) {
      var itemSize = normalizeSizeForMenuItem(item, item.size || DEFAULT_SIZE_NOTE);
      var itemTaste = item.taste || item.note || DEFAULT_TASTE_NOTE;
      var itemIce = item.ice || DEFAULT_ICE_NOTE;
      var itemPrep = renderItemPrepNote(item);
      return '<li>' +
        '<div class="order-item-pair">' +
          '<div class="order-item-cell order-item-name"><span>' + item.quantity + " " + escapeHtml(item.name) + '</span><span class="size-badge">' + escapeHtml(itemSize) + '</span></div>' +
          '<div class="order-item-cell order-item-taste">' + escapeHtml(itemTaste) + '</div>' +
          '<div class="order-item-cell order-item-ice">' + escapeHtml(itemIce) + '</div>' +
        '</div>' +
        itemPrep +
      '</li>';
    }).join("");

    var note = order.note ? '<div class="order-note">' + escapeHtml(order.note) + '</div>' : "";
    var label = order.label ? '<div class="order-label">' + escapeHtml(order.label) + '</div>' : "";
    var saleDate = orderBusinessDate(order);
    var saleDateInfo = saleDate ? '<div class="item-subtext">Ngày bán: ' + escapeHtml(saleDate) + '</div>' : "";
    var editedInfo = order.updatedAt ? '<div class="item-subtext">Đã sửa ' + formatTime(order.updatedAt) + '</div>' : "";

    card.innerHTML =
      '<div class="order-topline">' +
        '<div>' +
          '<div class="order-id">' + escapeHtml(order.id) + '</div>' +
          label +
          saleDateInfo +
          '<div class="item-subtext">' + escapeHtml(order.createdBy) + '</div>' +
          editedInfo +
        '</div>' +
        '<time class="order-time">' + formatTime(order.createdAt) + '</time>' +
      '</div>' +
      '<ul class="order-items">' + items + '</ul>' +
      note +
      '<div class="order-actions">' +
        '<button type="button" data-order-edit="' + escapeHtml(order.id) + '">Sửa</button>' +
        statusButton(order, "new", "Mới") +
        statusButton(order, "done", "Xong") +
      '</div>';

    card.querySelectorAll("[data-order-status]").forEach(function (button) {
      button.addEventListener("click", function () {
        setOrderStatus(order.id, button.dataset.orderStatus);
      });
    });
    card.querySelectorAll("[data-order-edit]").forEach(function (button) {
      button.addEventListener("click", function () {
        startEditingOrder(button.dataset.orderEdit);
      });
    });

    return card;
  }

  function orderToneClass(order) {
    var number = orderNumber(order);
    if (!Number.isFinite(number) || number === Number.MAX_SAFE_INTEGER) {
      return "order-card-tone-1";
    }

    return "order-card-tone-" + (((number - 1) % 6) + 1);
  }

  function startEditingOrder(orderId) {
    var order = state.orders.find(function (item) {
      return item.id === orderId;
    });

    if (!order) {
      setSyncStatus("Không tìm thấy order để sửa.", "local");
      return;
    }

    state.editingOrderId = order.id;
    state.draft = (order.items || []).map(function (item, index) {
      var itemTaste = item.taste || item.note || DEFAULT_TASTE_NOTE;
      var itemIce = item.ice || DEFAULT_ICE_NOTE;
      var itemSize = normalizeSizeForMenuItem(item, item.size || DEFAULT_SIZE_NOTE);
      var itemPrep = item.prep || "";
      var itemOwnBottle = isOwnBottleItem(item);
      return {
        draftKey: order.id + "::" + index + "::" + item.id + "::" + itemSize + "::" + itemTaste + "::" + itemIce + "::" + itemPrep + "::" + itemOwnBottle,
        id: item.id,
        name: item.name,
        quantity: Math.max(1, Number(item.quantity) || 1),
        confidence: 1,
        source: "order hiện tại",
        position: index,
        size: itemSize,
        taste: itemTaste,
        ice: itemIce,
        prep: itemPrep,
        ownBottle: itemOwnBottle,
        container: itemOwnBottle ? "bình riêng" : "",
        note: itemTaste
      };
    });

    els.orderNote.value = order.note || "";
    els.orderDate.value = orderBusinessDate(order) || todayDateKey();
    els.orderLabel.value = order.label || "";
    els.transcript.value = "";
    els.postFeedback.textContent = "Đang sửa " + order.id + ".";
    renderDraft();
    setActiveView("waiter");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderItemPrepNote(item) {
    var parts = [];
    if (item.prep) {
      parts.push(item.prep);
    }
    if (isOwnBottleItem(item)) {
      parts.push("bình riêng");
    }
    return parts.length ? '<div class="prep-note">Ghi chú: ' + escapeHtml(parts.join(", ")) + '</div>' : "";
  }

  function statusButton(order, status, label) {
    var active = kitchenStatusKey(order) === status ? " primary-action" : "";
    return '<button class="' + active.trim() + '" type="button" data-order-status="' + status + '">' + label + '</button>';
  }

  function kitchenStatusKey(order) {
    return order && order.status === "done" ? "done" : "new";
  }

  function setOrderStatus(orderId, status) {
    if (state.serverMode) {
      apiRequest("/api/orders/" + encodeURIComponent(orderId), {
        method: "PATCH",
        body: JSON.stringify({ status: status })
      }).then(function (updatedOrder) {
        state.orders = state.orders.map(function (order) {
          return order.id === updatedOrder.id ? updatedOrder : order;
        });
        saveJson(STORAGE_KEYS.orders, state.orders);
        renderKitchen();
      }).catch(function () {
        setSyncStatus("Không kết nối được server. Chưa đổi trạng thái.", "local");
      });
      return;
    }

    state.orders = state.orders.map(function (order) {
      if (order.id !== orderId) {
        return order;
      }
      return Object.assign({}, order, { status: status });
    });
    saveJson(STORAGE_KEYS.orders, state.orders);
    renderKitchen();
  }

  function clearDoneOrders() {
    if (state.serverMode) {
      apiRequest("/api/orders/done", {
        method: "DELETE"
      }).then(function (data) {
        state.orders = data.orders || [];
        saveJson(STORAGE_KEYS.orders, state.orders);
        renderKitchen();
      }).catch(function () {
        setSyncStatus("Không kết nối được server. Chưa xóa món đã xong.", "local");
      });
      return;
    }

    state.orders = state.orders.map(function (order) {
      if (order.status !== "done") {
        return order;
      }
      return Object.assign({}, order, { hiddenFromKitchen: true });
    });
    saveJson(STORAGE_KEYS.orders, state.orders);
    renderKitchen();
  }

  function renderMenu() {
    els.menuList.innerHTML = "";

    if (!state.menu.length) {
      var empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "Chưa có món trong menu.";
      els.menuList.appendChild(empty);
      return;
    }

    state.menu.forEach(function (item) {
      var row = document.createElement("article");
      row.className = "menu-item";
      row.innerHTML =
        '<div class="menu-main">' +
          '<div class="item-title">' + escapeHtml(item.name) + '</div>' +
          '<label class="alias-editor-label">' +
            '<span>Từ nhận diện món</span>' +
            '<textarea class="alias-editor" rows="2" spellcheck="false" data-menu-aliases data-id="' + escapeHtml(item.id) + '">' + escapeHtml((item.aliases || []).join(", ")) + '</textarea>' +
          '</label>' +
          '<div class="alias-help">Ngăn cách bằng dấu phẩy hoặc xuống dòng. Ví dụ: sữa, nâu đá, cf sữa</div>' +
        '</div>' +
        '<div class="menu-actions">' +
          '<button class="primary-action" type="button" data-menu-action="save-aliases" data-id="' + item.id + '">Lưu từ</button>' +
          '<button type="button" data-menu-action="toggle" data-id="' + item.id + '">' + (item.active === false ? "Bật" : "Tắt") + '</button>' +
          '<button class="danger" type="button" data-menu-action="delete" data-id="' + item.id + '">Xóa</button>' +
        '</div>';

      if (item.active === false) {
        row.style.opacity = "0.58";
      }

      els.menuList.appendChild(row);
    });

    els.menuList.querySelectorAll("[data-menu-action]").forEach(function (button) {
      button.addEventListener("click", function () {
        updateMenuItem(button.dataset.id, button.dataset.menuAction);
      });
    });
  }

  function renderRevenue() {
    if (!els.revenueBreakdown) {
      return;
    }

    var selectedDate = els.revenueDate.value || todayDateKey();
    var dailyOrders = state.orders.filter(function (order) {
      return orderBusinessDate(order) === selectedDate;
    });
    var grouped = {};
    var total = 0;
    var cupCount = 0;
    var ownBottleCount = 0;
    var sizeCounts = { S: 0, M: 0, L: 0 };

    dailyOrders.forEach(function (order) {
      (order.items || []).forEach(function (item) {
        var quantity = Math.max(1, Number(item.quantity) || 1);
        var unitPrice = getItemUnitPrice(item);
        var ownBottle = isOwnBottleItem(item);
        var effectiveUnitPrice = Math.max(0, unitPrice - (ownBottle ? 2 : 0));
        var itemTotal = effectiveUnitPrice * quantity;
        var size = normalizeSizeForMenuItem(item, item.size || DEFAULT_SIZE_NOTE);
        var key = (item.id || item.name) + "::" + size + "::" + effectiveUnitPrice + "::" + ownBottle;

        total += itemTotal;
        if (ownBottle) {
          ownBottleCount += quantity;
        } else {
          cupCount += quantity;
          if (Object.prototype.hasOwnProperty.call(sizeCounts, size)) {
            sizeCounts[size] += quantity;
          }
        }

        if (!grouped[key]) {
          grouped[key] = {
            name: item.name || "Món chưa đặt tên",
            size: size,
            quantity: 0,
            unitPrice: effectiveUnitPrice,
            originalUnitPrice: unitPrice,
            ownBottle: ownBottle,
            total: 0
          };
        }

        grouped[key].quantity += quantity;
        grouped[key].total += itemTotal;
      });
    });

    var rows = Object.keys(grouped).map(function (key) {
      return grouped[key];
    }).sort(function (a, b) {
      return b.total - a.total || a.name.localeCompare(b.name);
    });

    els.revenueTotal.textContent = formatMoney(total);
    els.revenueOrders.textContent = String(dailyOrders.length);
    els.revenueItems.textContent = String(cupCount);
    els.revenueSizeS.textContent = String(sizeCounts.S);
    els.revenueSizeM.textContent = String(sizeCounts.M);
    els.revenueSizeL.textContent = String(sizeCounts.L);
    els.revenueOwnBottles.textContent = String(ownBottleCount);
    els.revenueBreakdown.innerHTML = "";
    els.revenueEmpty.hidden = rows.length > 0;

    rows.forEach(function (row) {
      var article = document.createElement("article");
      article.className = "revenue-row";
      article.innerHTML =
        '<div>' +
          '<div class="item-title">' +
            '<span>' + escapeHtml(row.name) + '</span>' +
            '<span class="size-badge">' + escapeHtml(row.size) + '</span>' +
            (row.ownBottle ? '<span class="container-badge">bình riêng</span>' : '') +
          '</div>' +
          '<div class="item-subtext">' + row.quantity + ' x ' + formatMoney(row.unitPrice) + (row.ownBottle ? ' (đã trừ 2.000đ/ly)' : '') + '</div>' +
        '</div>' +
        '<strong>' + formatMoney(row.total) + '</strong>';
      els.revenueBreakdown.appendChild(article);
    });
  }

  function getItemUnitPrice(item) {
    var storedPrice = Number(item && item.unitPrice);
    if (storedPrice > 0) {
      return storedPrice;
    }

    return menuPriceForSize(findMenuItemForOrderItem(item), item && item.size);
  }

  function isOwnBottleItem(item) {
    if (!item) {
      return false;
    }
    return Boolean(item.ownBottle) || item.container === "bình riêng" || foldText(item.prep).indexOf("binh rieng") !== -1;
  }

  function findMenuItemForOrderItem(item) {
    if (!item) {
      return null;
    }

    var byId = state.menu.find(function (entry) {
      return entry.id === item.id;
    });

    if (byId) {
      return byId;
    }

    var itemName = foldText(item.name);
    return state.menu.find(function (entry) {
      return foldText(entry.name) === itemName;
    }) || null;
  }

  function menuPriceForSize(menuItem, size) {
    if (!menuItem || !menuItem.prices) {
      return 0;
    }

    var prices = menuItem.prices;
    var requestedSize = String(size || DEFAULT_SIZE_NOTE).toUpperCase();
    var directPrice = Number(prices[requestedSize]);
    if (directPrice > 0) {
      return directPrice;
    }

    var fallbackSizes = [DEFAULT_SIZE_NOTE, "L", "S"];
    for (var i = 0; i < fallbackSizes.length; i += 1) {
      var fallbackPrice = Number(prices[fallbackSizes[i]]);
      if (fallbackPrice > 0) {
        return fallbackPrice;
      }
    }

    var firstSize = Object.keys(prices).find(function (key) {
      return Number(prices[key]) > 0;
    });
    return firstSize ? Number(prices[firstSize]) : 0;
  }

  function formatMoney(thousandValue) {
    var amount = Math.round((Number(thousandValue) || 0) * 1000);
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  }

  function addMenuItem() {
    var name = els.menuName.value.trim();
    if (!name) {
      return;
    }

    var aliases = els.menuAliases.value
      .split(",")
      .map(function (alias) { return alias.trim(); })
      .filter(Boolean);

    var item = {
      id: "m_" + slugify(name) + "_" + Date.now().toString(36),
      name: name,
      aliases: aliases,
      active: true
    };

    if (state.serverMode) {
      apiRequest("/api/menu", {
        method: "POST",
        body: JSON.stringify({ name: name, aliases: aliases })
      }).then(function (createdItem) {
        state.menu.push(createdItem);
        saveJson(STORAGE_KEYS.menu, state.menu);
        els.menuName.value = "";
        els.menuAliases.value = "";
        renderMenu();
      }).catch(function () {
        setSyncStatus("Không kết nối được server. Món mới chưa được chia sẻ.", "local");
      });
      return;
    }

    state.menu.push(item);

    saveJson(STORAGE_KEYS.menu, state.menu);
    els.menuName.value = "";
    els.menuAliases.value = "";
    renderMenu();
  }

  function updateMenuItem(id, action) {
    var aliases = action === "save-aliases" ? readMenuAliases(id) : null;

    if (state.serverMode) {
      if (action === "delete") {
        apiRequest("/api/menu/" + encodeURIComponent(id), {
          method: "DELETE"
        }).then(function (data) {
          state.menu = data.menu || state.menu.filter(function (item) {
            return item.id !== id;
          });
          saveJson(STORAGE_KEYS.menu, state.menu);
          renderMenu();
        }).catch(function () {
          setSyncStatus("Không kết nối được server. Chưa xóa món.", "local");
        });
        return;
      }

      var existing = state.menu.find(function (item) {
        return item.id === id;
      });
      var patchBody = action === "save-aliases" ? { aliases: aliases } : { active: existing ? existing.active === false : true };

      apiRequest("/api/menu/" + encodeURIComponent(id), {
        method: "PATCH",
        body: JSON.stringify(patchBody)
      }).then(function (updatedItem) {
        state.menu = state.menu.map(function (item) {
          return item.id === updatedItem.id ? updatedItem : item;
        });
        saveJson(STORAGE_KEYS.menu, state.menu);
        renderMenu();
        if (action === "save-aliases") {
          setSyncStatus("Đã lưu từ nhận diện cho " + updatedItem.name + ".", "online");
        }
      }).catch(function () {
        setSyncStatus("Không kết nối được server. Chưa cập nhật món.", "local");
      });
      return;
    }

    if (action === "delete") {
      state.menu = state.menu.filter(function (item) {
        return item.id !== id;
      });
    }

    if (action === "toggle") {
      state.menu = state.menu.map(function (item) {
        if (item.id !== id) {
          return item;
        }
        return Object.assign({}, item, { active: item.active === false });
      });
    }

    if (action === "save-aliases") {
      state.menu = state.menu.map(function (item) {
        if (item.id !== id) {
          return item;
        }
        return Object.assign({}, item, { aliases: aliases });
      });
      setSyncStatus("Đã lưu từ nhận diện trên thiết bị này.", "local");
    }

    saveJson(STORAGE_KEYS.menu, state.menu);
    renderMenu();
  }

  function readMenuAliases(id) {
    var editor = Array.prototype.find.call(document.querySelectorAll("[data-menu-aliases]"), function (input) {
      return input.dataset.id === id;
    });

    return normalizeAliasList(editor ? editor.value : "");
  }

  function isEditingMenuAliases() {
    var active = document.activeElement;
    return Boolean(active && active.matches && active.matches("[data-menu-aliases]"));
  }

  function normalizeAliasList(value) {
    var seen = {};
    return String(value || "")
      .split(/[,;\n]+/)
      .map(function (alias) { return alias.trim(); })
      .filter(function (alias) {
        var key = normalizeText(alias);
        if (!key || seen[key]) {
          return false;
        }
        seen[key] = true;
        return true;
      });
  }

  function setActiveView(viewName) {
    els.viewButtons.forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.viewButton === viewName);
    });
    els.views.forEach(function (view) {
      view.classList.toggle("is-active", view.dataset.view === viewName);
    });
    if (viewName === "kitchen") {
      scrollPageToTop();
    }
  }

  function scrollPageToTop() {
    window.requestAnimationFrame(function () {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  }

  function setVoiceState(label, kind) {
    els.voiceState.textContent = label;
    els.voiceState.classList.toggle("is-listening", kind === "listening");
    els.voiceState.classList.toggle("is-processing", kind === "processing");
    els.meter.classList.toggle("is-active", kind === "listening" || kind === "processing");
  }

  function nextOrderId() {
    var sequence = parseInt(localStorage.getItem(STORAGE_KEYS.sequence) || "0", 10) + 1;
    localStorage.setItem(STORAGE_KEYS.sequence, String(sequence));
    return "ORD-" + String(sequence).padStart(4, "0");
  }

  function normalizeText(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFC")
      .replace(/[^\p{L}\p{N} ]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function foldText(text) {
    return normalizeText(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, " ")
      .trim();
  }

  function stripWakePhrase(text) {
    var normalized = normalizeText(text);
    var wake = findWakePhrase(normalized);
    if (!wake) {
      return String(text || "").trim();
    }
    return normalized.slice(wake.index + wake.length).trim();
  }

  function findWakePhrase(text) {
    var normalized = normalizeText(text);
    var folded = foldText(normalized);
    var best = null;

    WAKE_PHRASES.forEach(function (phrase) {
      var normalizedPhrase = normalizeText(phrase);
      var foldedPhrase = foldText(normalizedPhrase);
      var normalizedIndex = normalized.indexOf(normalizedPhrase);
      var foldedIndex = folded.indexOf(foldedPhrase);
      var index = normalizedIndex !== -1 ? normalizedIndex : foldedIndex;

      if (index !== -1 && (!best || index < best.index)) {
        best = {
          index: index,
          length: normalizedIndex !== -1 ? normalizedPhrase.length : foldedPhrase.length
        };
      }
    });

    return best;
  }

  function containsCancelCommand(text) {
    var folded = foldText(text);
    return [
      "huy mon",
      "huy order",
      "xoa mon",
      "bo mon",
      "cancel order"
    ].some(function (phrase) {
      return folded.indexOf(phrase) !== -1;
    });
  }

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function slugify(value) {
    return foldText(value).replace(/\s+/g, "_") || "item";
  }

  function upgradeMenu(menu) {
    menu = applyMenuPrices(menu);
    var names = (menu || []).map(function (item) {
      return foldText(item.name);
    });

    var hasTramCafeMenu = names.some(function (name) {
      return name === "phin den da" || name === "cafe muoi" || name === "tra sua tram s";
    });
    var hasStarterMenu = names.some(function (name) {
      return name === "iced coffee" || name === "hot coffee" || name === "ca phe sua da" || name === "bac xiu";
    });

    if (hasTramCafeMenu || !hasStarterMenu) {
      return menu;
    }

    saveJson(STORAGE_KEYS.menu, defaultMenu);
    return clone(defaultMenu);
  }

  function applyMenuPrices(menu) {
    return (menu || []).map(function (item) {
      var defaultPrices = MENU_PRICES[item.id];
      if (!defaultPrices) {
        return item;
      }

      return Object.assign({}, item, {
        prices: Object.assign({}, defaultPrices, item.prices || {})
      });
    });
  }

  function loadJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : clone(fallback);
    } catch (error) {
      return clone(fallback);
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function todayDateKey() {
    return dateKeyFromDate(new Date());
  }

  function orderBusinessDate(order) {
    return normalizeDateKey(order && order.businessDate) || dateKeyFromValue(order && order.createdAt);
  }

  function normalizeDateKey(value) {
    var text = String(value || "").trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      return text;
    }
    return "";
  }

  function dateKeyFromValue(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return dateKeyFromDate(date);
  }

  function dateKeyFromDate(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function formatTime(value) {
    return new Intl.DateTimeFormat([], {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  }

  function similarity(a, b) {
    var maxLength = Math.max(a.length, b.length);
    if (!maxLength) {
      return 1;
    }
    return 1 - levenshtein(a, b) / maxLength;
  }

  function levenshtein(a, b) {
    var matrix = [];
    var i;
    var j;

    for (i = 0; i <= b.length; i += 1) {
      matrix[i] = [i];
    }
    for (j = 0; j <= a.length; j += 1) {
      matrix[0][j] = j;
    }

    for (i = 1; i <= b.length; i += 1) {
      for (j = 1; j <= a.length; j += 1) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  window.voiceKitchenDebug = {
    parseOrder: parseOrder,
    mergeDraftItems: mergeDraftItems,
    stripWakePhrase: stripWakePhrase,
    normalizeText: normalizeText,
    foldText: foldText
  };
})();
