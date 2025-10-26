⸙ 𝙋𝙃𝙔𝙍𝙐𝙎 — 𝙒𝙃𝘼𝙏𝙎𝘼𝙋𝙋 𝘼𝙋𝙄 (PHYRUSBAILS)

<div align="center"><img src="https://ibb.co/QW1qwTr" width="100%"/>
<a href="https://wa.me/62881010520506"><img src="https://img.shields.io/badge/WhatsApp-Owner-brightgreen?style=for-the-badge"></a>
<a href="https://t.me/phyruss"><img src="https://img.shields.io/badge/Channel-Phyrus-green?style=for-the-badge"></a>
<a href="https://t.me/aboutpherus"><img src="https://img.shields.io/badge/Telegram-Team-blue?style=for-the-badge"></a>

</div>
---

⸙ Deskripsi

PHYRUSBAILS adalah engine WhatsApp API bergaya PHYRUS berbasis Baileys yang dioptimalkan untuk performa, stabilitas, dan keamanan tingkat produksi. Siap dipakai pada eekosistem PHYRUS (Telegram Bot, Panel, dan Gateway), mendukung multi-device, auto-reconnect, dan integrasi kontrol penuh.


---

⸙ Fitur Utama

⚙️ WebSocket native, multi-device, tanpa Selenium/Chromium

🔁 Auto reconnect, recovery state, sinkronisasi riwayat opsional

🧠 Integrasi ekosistem PHYRUS: Token, SenderLock, SessionPool, RateLimiter

🧩 Modular command: /deploy, /notif, /autonotif, /stopnotif, /track, /encjava, /aksesadp, /BugGroup

💬 Event lengkap: messages.upsert, groups.update, presence.update, connection.update

🔒 Hardening: anti-crash, anti-tamper, opsi ephemeral, mark-online control

📦 Store opsional (in-memory/FS/DB) + util unduh/unggah ulang media


> Gunakan secara bertanggung jawab. Patuhi kebijakan platform dan hukum yang berlaku.




---

⸙ Instalasi

GitHub (disarankan untuk repo privat PHYRUS):

yarn add github:PHYRUS-Bot/PHYRUSBAILS
# atau
yarn add https://github.com/PHYRUS-Bot/PHYRUSBAILS.git

Monorepo/Local path:

yarn add file:./packages/PHYRUSBAILS


---

⸙ Konfigurasi Yang Perlu Diganti

Buat .env atau environment variable sesuai panel/hosting kamu:

GITHUB_TOKEN=ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
PHYRUS_OWNER_ID=0000000000
PHYRUS_TELEGRAM_BOT_TOKEN=000:AAA
PHYRUS_PANEL_HOST=https://panel-kamu.tld
PHYRUS_SESSION_DIR=./data/auth/phyrus
PHYRUS_LOG_DIR=./logs
PHYRUS_SENDER_NUMBER=6285XXXXXXXX

Struktur repo yang direkomendasikan:

.
├─ src/
│  ├─ index.ts
│  ├─ phyrus.config.ts
│  └─ plugins/
├─ data/
│  └─ auth/
├─ logs/
├─ package.json
└─ tsconfig.json


---

⸙ Quickstart (Gaya PHYRUS)

TypeScript:

import makeWASocket, { DisconnectReason, useMultiFileAuthState, Browsers } from "@whiskeysockets/baileys"
import pino from "pino"

async function main() {
  const { state, saveCreds } = await useMultiFileAuthState(process.env.PHYRYS_SESSION_DIR || "./data/auth/phyrus")
  const sock = makeWASocket({
    auth: state,
    browser: Browsers.macOS("PHYRUS-Desktop"),
    printQRInTerminal: true,
    markOnlineOnConnect: false,
    logger: pino({ level: "silent" })
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const code = (lastDisconnect?.error as any)?.output?.statusCode
      if (code !== DisconnectReason.loggedOut) main()
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const m of messages) {
      const body = m.message?.conversation || m.message?.extendedTextMessage?.text || ""
      if (/^\/ping$/i.test(body)) await sock.sendMessage(m.key.remoteJid!, { text: "phyrus — pong" })
    }
  })
}

main()

Node.js (CommonJS):

const { default: makeWASocket, useMultiFileAuthState, Browsers, DisconnectReason } = require("@whiskeysockets/baileys")
const pino = require("pino")

async function main() {
  const { state, saveCreds } = await useMultiFileAuthState(process.env.PHYRUS_SESSION_DIR || "./data/auth/phyrus")
  const sock = makeWASocket({ auth: state, browser: Browsers.macOS("PHYRUS-Desktop"), printQRInTerminal: true, markOnlineOnConnect: false, logger: pino({ level: "silent" }) })
  sock.ev.on("creds.update", saveCreds)
  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "close") {
      const code = (lastDisconnect?.error || {}).output?.statusCode
      if (code !== DisconnectReason.loggedOut) main()
    }
  })
  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const m of messages) {
      const t = (m.message?.conversation || m.message?.extendedTextMessage?.text || "").trim()
      if (/^\/ping$/i.test(t)) await sock.sendMessage(m.key.remoteJid, { text: "phyrus — pong" })
    }
  })
}

main()


---

⸙ Pairing Code (Tanpa QR)

import makeWASocket from "@whiskeysockets/baileys"

async function pair() {
  const sock = makeWASocket({ printQRInTerminal: false })
  if (!sock.authState.creds.registered) {
    const number = process.env.PHYRUS_SENDER_NUMBER || "6285XXXXXXXX"
    const code = await sock.requestPairingCode(number)
    console.log("Pairing Code:", code)
  }
}

pair()


---

⸙ Rekomendasi Opsi Socket

markOnlineOnConnect: false untuk tetap menerima notifikasi di HP

syncFullHistory: true bila perlu riwayat lengkap (desktop emulation)

browser: Browsers.macOS("PHYRUS-Desktop") untuk scope history lebih luas

getMessage terhubung ke store untuk retry & decrypt poll votes



---

⸙ Store & Media Utility

import { makeInMemoryStore, downloadMediaMessage, getContentType } from "@whiskeysockets/baileys"
import { createWriteStream } from "fs"

const store = makeInMemoryStore({})

async function onImage(sock: any, m: any) {
  const t = getContentType(m.message)
  if (t === "imageMessage") {
    const stream = await downloadMediaMessage(m, "stream", {}, { reuploadRequest: sock.updateMediaMessage })
    stream.pipe(createWriteStream("./download.jpeg"))
  }
}


---

⸙ Integrasi Command PHYRUS

Contoh pola handler untuk Telegram/Panel yang memanggil fungsi WA:

export async function cmdNotifEnable(chatId: string, ownerId: string) {
  return { ok: true, message: "PHYRUS — Notifikasi aktif" }
}

export async function cmdTrackLink(userId: string) {
  return {
    label: "PHYRUS — TRACK",
    url: `${process.env.PHYRUS_PANEL_HOST}/track?u=${encodeURIComponent(userId)}`
  }
}


---

⸙ Praktik Keamanan

Simpan kredensial di luar repo (env/secret manager)

Hindari hardcode token atau nomor

Batasi akses per-peran (Owner/Admin/Staff/Reseller)

Terapkan rate limit pada endpoint webhook/panel



---

⸙ Lisensi & Atribusi

Berbasis pada proyek komunitas Baileys. Distribusi mengikuti lisensi MIT dari upstream. Gunakan secara etis dan sesuai ToS platform.


---

⸙ Dukungan

WhatsApp Owner: wa.me/62881010520506

Telegram Team: t.me/phyruss


