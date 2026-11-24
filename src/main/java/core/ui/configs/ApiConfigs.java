package core.ui.configs;

import io.github.cdimascio.dotenv.Dotenv;

import static core.CommandManager.apiKeyNames;
import static core.ui.configs.AppearanceConfigs.*;
import static core.ui.configs.TextConfigs.message;
import static java.lang.System.out;

public class ApiConfigs {

    public static void checkApiKeys() {
        Dotenv dotenv = Dotenv.load();
        message("API Status:", getLayoutColor(), getDefaultTextAlignment(), getDefaultDelay(), out::print);

        for (String name : apiKeyNames) {
            String value = dotenv.get(name);
            String statusMark;
            boolean present = value != null && !value.isBlank();

            if (present) {
                statusMark = "[" + getColor(getAcceptanceColor()) + "✓" + getColor(getLayoutColor()) + "]";
            } else {
                statusMark = "[" + getColor(getRejectionColor()) + "✗" + getColor(getLayoutColor()) + "]";
            }

            message(statusMark + " " + name,
                    getLayoutColor(),
                    getDefaultTextAlignment(),
                    getDefaultDelay(),
                    out::print);
        }
    }
}
