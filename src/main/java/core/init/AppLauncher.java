package core.init;

import core.cli.CliRunner;
import core.ui.pages.MenuPage;

import java.util.Arrays;

import static core.ui.configs.DisplayManager.clearTerminal;
import static core.ui.configs.TextConfigs.insertControlChars;

public class AppLauncher {
    public static void main(String[] args) {
        if (args.length > 0 && args[0].equals("--cli")) {
            CliRunner.run(Arrays.copyOfRange(args, 1, args.length));
            return;
        }
        clearTerminal();
        insertControlChars('n',1);
        MenuPage.displayMenu();
    }
}