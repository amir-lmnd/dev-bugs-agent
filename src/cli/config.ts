import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export interface CLIConfig {
  dataPath?: string;
  defaultFormat?: "prompt" | "json" | "summary";
  pullSource?: "fibery" | "all";
  tui?: {
    pageSize?: number;
    theme?: "default" | "compact";
  };
  output?: {
    colors?: boolean;
    emojis?: boolean;
  };
}

export class ConfigManager {
  private static readonly CONFIG_DIR = path.join(os.homedir(), ".dev-bugs");
  private static readonly CONFIG_FILE = path.join(
    ConfigManager.CONFIG_DIR,
    "config.json"
  );
  private static readonly DEFAULT_CONFIG: CLIConfig = {
    dataPath: path.join(process.cwd(), "data", "bug_cards.json"),
    defaultFormat: "prompt",
    pullSource: "all",
    tui: {
      pageSize: 20,
      theme: "default",
    },
    output: {
      colors: true,
      emojis: true,
    },
  };

  private static _config: CLIConfig | null = null;

  /**
   * Get the current configuration
   */
  static getConfig(): CLIConfig {
    if (!ConfigManager._config) {
      ConfigManager._config = ConfigManager.loadConfig();
    }
    return ConfigManager._config;
  }

  /**
   * Load configuration from file or create default
   */
  private static loadConfig(): CLIConfig {
    try {
      if (fs.existsSync(ConfigManager.CONFIG_FILE)) {
        const configData = fs.readFileSync(ConfigManager.CONFIG_FILE, "utf-8");
        const userConfig = JSON.parse(configData);
        return { ...ConfigManager.DEFAULT_CONFIG, ...userConfig };
      }
    } catch (error) {
      // If config file is corrupted, fall back to default
      console.warn("⚠️  Config file is corrupted, using defaults");
    }

    return ConfigManager.DEFAULT_CONFIG;
  }

  /**
   * Save configuration to file
   */
  static saveConfig(config: Partial<CLIConfig>): void {
    try {
      const currentConfig = ConfigManager.getConfig();
      const newConfig = { ...currentConfig, ...config };

      // Ensure config directory exists
      if (!fs.existsSync(ConfigManager.CONFIG_DIR)) {
        fs.mkdirSync(ConfigManager.CONFIG_DIR, { recursive: true });
      }

      fs.writeFileSync(
        ConfigManager.CONFIG_FILE,
        JSON.stringify(newConfig, null, 2)
      );
      ConfigManager._config = newConfig;
    } catch (error) {
      console.error(
        "❌ Failed to save config:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Reset configuration to defaults
   */
  static resetConfig(): void {
    try {
      if (fs.existsSync(ConfigManager.CONFIG_FILE)) {
        fs.unlinkSync(ConfigManager.CONFIG_FILE);
      }
      ConfigManager._config = ConfigManager.DEFAULT_CONFIG;
    } catch (error) {
      console.error(
        "❌ Failed to reset config:",
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Get configuration file path
   */
  static getConfigPath(): string {
    return ConfigManager.CONFIG_FILE;
  }

  /**
   * Check if configuration file exists
   */
  static configExists(): boolean {
    return fs.existsSync(ConfigManager.CONFIG_FILE);
  }

  /**
   * Get data file path based on config
   */
  static getDataPath(): string {
    const config = ConfigManager.getConfig();
    return config.dataPath || ConfigManager.DEFAULT_CONFIG.dataPath!;
  }

  /**
   * Get default format based on config
   */
  static getDefaultFormat(): "prompt" | "json" | "summary" {
    const config = ConfigManager.getConfig();
    return config.defaultFormat || ConfigManager.DEFAULT_CONFIG.defaultFormat!;
  }

  /**
   * Check if colors should be used
   */
  static shouldUseColors(): boolean {
    const config = ConfigManager.getConfig();
    return (
      config.output?.colors ?? ConfigManager.DEFAULT_CONFIG.output!.colors!
    );
  }

  /**
   * Check if emojis should be used
   */
  static shouldUseEmojis(): boolean {
    const config = ConfigManager.getConfig();
    return (
      config.output?.emojis ?? ConfigManager.DEFAULT_CONFIG.output!.emojis!
    );
  }
}
