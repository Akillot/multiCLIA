package core.cli;

import core.ui.configs.AppearanceConfigs;
import tools.ai.AiPage;
import tools.cryptography.CryptographyPage;
import tools.generate_art.AsciiArtGenPage;
import tools.network.NetworkPage;
import tools.qr.QrPage;
import tools.terminal_emulation.TerminalPage;
import tools.time.TimePage;
import tools.translate.TranslatePage;
import tools.weather.WeatherPage;

import java.io.ByteArrayInputStream;
import java.io.PrintStream;
import java.io.ByteArrayOutputStream;

public class CliRunner {

    public static void run(String[] args) {
        if (args.length == 0) {
            System.err.println("Usage: --cli <tool> [args...]");
            System.exit(1);
        }

        AppearanceConfigs.loadConfig();

        String tool = args[0];
        String stdin = buildStdin(tool, args);

        if (stdin == null) {
            System.err.println("Unknown tool: " + tool);
            System.exit(1);
        }

        System.setIn(new ByteArrayInputStream(stdin.getBytes()));

        try {
            dispatch(tool);
        } catch (Exception ignored) {
            // Normal exit — stdin exhausted after tool finishes
        }

        System.exit(0);
    }

    private static void dispatch(String tool) {
        switch (tool) {
            case "weather"   -> new WeatherPage().displayMenu();
            case "ai"        -> new AiPage().displayMenu();
            case "translate" -> TranslatePage.displayTranslatePage();
            case "network"   -> new NetworkPage().displayMenu();
            case "crypt"     -> new CryptographyPage().displayMenu();
            case "genqr"     -> new QrPage().displayMenu();
            case "genart"    -> new AsciiArtGenPage().displayMenu();
            case "time"      -> new TimePage().displayMenu();
            case "terminal"  -> new TerminalPage().displayMenu();
        }
    }

    private static String buildStdin(String tool, String[] args) {
        return switch (tool) {

            // weather <city>   →  navigate to "direct weather", enter city, quit
            case "weather" -> args.length > 1
                    ? "dw\n" + join(args, 1) + "\nq\n"
                    : "lw\nq\n";

            // ai <prompt>   →  "a" to ask, prompt, empty Enter exits chat, "q" quits menu
            case "ai" -> args.length > 1
                    ? "a\n" + join(args, 1) + "\n\nq\n"
                    : "q\n";

            // translate <text> <lang>   →  text, language, "q" quits
            case "translate" -> args.length > 2
                    ? args[1] + "\n" + args[2] + "\nq\n"
                    : "q\n";

            // network ip | http <url> | ping <host> | trace <host> | dns <host> | ports | interfaces
            case "network" -> buildNetworkStdin(args);

            // crypt encrypt <text>  |  decrypt <enc> <key>  |  hash <text>  |  genpass <len> <complexity>
            case "crypt" -> buildCryptStdin(args);

            // genqr <url>   →  "qr" for ASCII QR, URL, quit
            case "genqr" -> args.length > 1
                    ? "qr\n" + join(args, 1) + "\nq\n"
                    : "q\n";

            // genart <text>   →  text, empty Enter exits, clearAndRestartApp throws on empty stdin
            case "genart" -> args.length > 1
                    ? join(args, 1) + "\n\n"
                    : "\n";

            // time current | calendar | timezone <tz>
            case "time" -> buildTimeStdin(args);

            // terminal <cmd>   →  "ec" enter command, cmd, "q" exits inner loop, "q" quits menu
            case "terminal" -> args.length > 1
                    ? "ec\n" + join(args, 1) + "\nq\nq\n"
                    : "q\n";

            default -> null;
        };
    }

    private static String buildNetworkStdin(String[] args) {
        if (args.length < 2) return "ip\nq\n";
        return switch (args[1]) {
            // IP address — no extra input needed
            case "ip" -> "ip\nq\n";

            // HTTP test: URL, method (GET=1), empty Enter (no headers), "n" (no repeat), back to menu, "q"
            case "http" -> args.length > 2
                    ? "hrt\n" + args[2] + "\n1\n\nn\nq\n"
                    : "q\n";

            // ping/trace/dns — processCommandWithHostInput reads one line (host)
            case "ping"  -> args.length > 2 ? "ph\n" + args[2] + "\nq\n" : "q\n";
            case "trace" -> args.length > 2 ? "tr\n" + args[2] + "\nq\n" : "q\n";
            case "dns"   -> args.length > 2 ? "lr\n" + args[2] + "\nq\n" : "q\n";

            // port scan — no host input, just runs
            case "ports"      -> "sp\nq\n";
            // network interfaces — no input
            case "interfaces" -> "ni\nq\n";

            default -> "ip\nq\n";
        };
    }

    private static String buildCryptStdin(String[] args) {
        if (args.length < 2) return "q\n";
        return switch (args[1]) {
            // encrypt AES (auto key): "en" → "aes" → plaintext → result → "q"
            case "encrypt" -> args.length > 2
                    ? "en\naes\n" + join(args, 2) + "\nq\n"
                    : "q\n";

            // decrypt AES: "de" → "aes" → encryptedText → base64Key → result → "q"
            case "decrypt" -> args.length > 4
                    ? "de\naes\n" + args[2] + "\n" + args[3] + "\nq\n"
                    : "q\n";

            // hash SHA256: "ha" → text → result → "q"
            case "hash" -> args.length > 2
                    ? "ha\n" + join(args, 2) + "\nq\n"
                    : "q\n";

            // generate password: "genpass" → length → complexity → "n" (no clipboard) → "q"
            case "genpass" -> {
                String len = args.length > 2 ? args[2] : "16";
                String complexity = args.length > 3 ? args[3] : "strong";
                yield "genpass\n" + len + "\n" + complexity + "\nn\nq\n";
            }

            default -> "q\n";
        };
    }

    private static String buildTimeStdin(String[] args) {
        if (args.length < 2) return "ct\nq\n";
        return switch (args[1]) {
            case "current"  -> "ct\nq\n";
            case "calendar" -> "c\nq\n";
            // timezone: "tz" → zone ID → "q" exits inner tz loop → "q" quits menu
            case "timezone" -> args.length > 2
                    ? "tz\n" + args[2] + "\nq\n"
                    : "tz\nq\nq\n";
            default -> "ct\nq\n";
        };
    }

    // Join args from startIndex onward with spaces
    private static String join(String[] args, int startIndex) {
        StringBuilder sb = new StringBuilder();
        for (int i = startIndex; i < args.length; i++) {
            if (i > startIndex) sb.append(" ");
            sb.append(args[i]);
        }
        return sb.toString();
    }
}
