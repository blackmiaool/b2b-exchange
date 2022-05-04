import defaultConfig from "./config";
const config = defaultConfig;
const storageKey = "b2b-exchange-config";
try {
    const text = localStorage.getItem(storageKey);

    Object.assign(config, JSON.parse(text));
} catch (e) {
    console.log("no saved config");
}

export function saveConfig(configChange) {
    Object.assign(config, configChange);
    localStorage.setItem(storageKey, JSON.stringify(config));
}

export default config;
