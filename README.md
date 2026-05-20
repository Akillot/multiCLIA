<p align="center">
  <img src="multiclia.png" width="750" height="800" />
</p>


<p align="center">
  <strong>A multifunctional CLI application that turns your terminal into a Swiss Army knife.</strong>
</p>

<p align="center">
  <a href="https://github.com/Akillot/MultiCLIA/releases/latest"><img src="https://img.shields.io/github/v/release/Akillot/MultiCLIA?style=flat-square&color=blue" alt="Release"></a>
  <a href="https://github.com/Akillot/MultiCLIA/blob/master/LICENSE"><img src="https://img.shields.io/github/license/Akillot/MultiCLIA?style=flat-square" alt="License"></a>
  <img src="https://img.shields.io/github/stars/Akillot/MultiCLIA?style=flat-square" alt="Stars">
  <img src="https://img.shields.io/github/commit-activity/t/Akillot/MultiCLIA?style=flat-square" alt="Commits">
  <img src="https://img.shields.io/badge/java-17+-orange?style=flat-square" alt="Java 17+">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-lightgrey?style=flat-square" alt="Platform">
</p>

---

## What is MultiCLIA?

MultiCLIA is a command-line application for macOS and Linux that bundles everyday developer tools into a single interactive interface. Instead of switching between browser tabs, scripts, and CLI utilities — you get one terminal app with a navigable menu system.

## Features

| Module | What it does |
|--------|-------------|
| **AI** | GPT-powered chat and code assistance (OpenAI API) |
| **Translate** | Text translation via DeepL API |
| **Cryptography** | Encryption/decryption utilities (BouncyCastle) |
| **QR Generator** | Create QR codes from text (ZXing) |
| **Network** | Network diagnostics and HTTP tools (OkHttp) |
| **Weather** | Weather data lookup |
| **Art Generator** | ASCII art generation (JFiglet) |
| **Terminal Emulation** | Terminal simulation tools |
| **Time** | Time and date utilities |

## Quick Start

### Requirements

- **Java 17** or higher
- macOS or Linux

### Install from source

```bash
git clone https://github.com/Akillot/MultiCLIA.git
cd MultiCLIA
./start.sh
```

### Install via Homebrew (macOS)

```bash
brew install akillot/multiclia/multiclia
multiclia
```

> **Note:** Homebrew formula may have issues on some setups. Contributions welcome.

## Project Structure

```
src/main/java/
├── core/                     # Application core
│   ├── init/                 # App launcher and bootstrapping
│   ├── commands/             # Command definitions
│   ├── ui/                   # Interactive menu and navigation
│   ├── CommandManager.java   # Command routing
│   └── Page.java             # Page model
└── tools/                    # Feature modules
    ├── ai/                   # OpenAI integration
    ├── cryptography/         # Encryption tools
    ├── generate_art/         # ASCII art
    ├── network/              # HTTP & network utils
    ├── qr/                   # QR code generation
    ├── terminal_emulation/   # Terminal tools
    ├── time/                 # Date/time utilities
    ├── translate/            # DeepL translation
    └── weather/              # Weather data
```

## Tech Stack

- **Java 17** — core language
- **Maven** — build system
- **JLine 3** — interactive terminal I/O
- **GraalVM JS** — JavaScript execution engine
- **OpenAI API** — AI chat capabilities
- **DeepL API** — translation
- **BouncyCastle** — cryptographic operations
- **ZXing** — QR code generation
- **OkHttp** — HTTP client
- **Gson / Jackson** — JSON processing

## Documentation

Detailed guides are available in the [`/documentation`](./documentation) directory:

- [API Guideline](./documentation/API_MultiCLIA_Guideline.md) — API integration reference
- [Extension Guideline](./documentation/Extension_Guideline.md) — how to build new modules
- [Reference Guideline](./documentation/Reference_Guideline.md) — general reference

## Contributing

Contributions are welcome. If you want to add a new tool module:

1. Fork the repo
2. Create a new package under `src/main/java/tools/`
3. Register the command in `CommandManager.java`
4. Submit a PR

## License

[MIT](./LICENSE) — use it however you want.

## Contact

**Nick Zozulia** — [nickzozulia@gmail.com](mailto:nickzozulia@gmail.com) — [@nickzozulia](https://x.com/nickzozulia)

---

## AI Bootstrap Prompt

> Copy and paste into Claude, Cursor, Codex, or GPT:

```text
You are working on MultiCLIA — a Java CLI app that bundles developer tools
(AI chat, cryptography, QR, translation, network, weather, ASCII art)
into one interactive terminal interface.

Stack: Java 17+, Maven, JLine 3, OpenAI API, DeepL API, BouncyCastle, ZXing, OkHttp, Gson/Jackson
Entry point: src/main/java/core/init/ (app bootstrapper)
Menu routing: src/main/java/core/CommandManager.java
Run: ./start.sh  OR  brew install akillot/multiclia/multiclia && multiclia

Non-obvious:
- Adding a new tool module: create a package under src/main/java/tools/,
  then register the command in CommandManager.java — that is the only wiring needed
- UI and navigation live in core/ui/; the page model is in core/Page.java
- API keys (OpenAI, DeepL) are set at runtime — check core/init/ for where they are read
- Each tool module is self-contained — no shared state through a service layer
- Detailed extension guide: documentation/Extension_Guideline.md
```
