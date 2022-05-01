const imageSuffixMap = {
    jpg: true,
    jpeg: true,
    webp: true,
    png: true,
    gif: true
};
const textSuffixMap = {
    txt: true
};
function getSuffix(name) {
    if (!name.includes(".")) {
        return "";
    }
    return name.split(".").pop();
}
export function isImage(name) {
    const suffix = getSuffix(name);
    if (suffix && imageSuffixMap[suffix]) {
        return true;
    } else {
        return false;
    }
}
export function isText(name) {
    const suffix = getSuffix(name);
    if (suffix && textSuffixMap[suffix]) {
        return true;
    } else {
        return false;
    }
}

export function getBlobType(fileName: string): string {
    const suffix = fileName?.split(".")?.[1];
    if (!suffix) {
        return "";
    }
    let type = "";
    if (suffix === "jpg") {
        type = "jpeg";
    }
    if (suffix === "png" || suffix === "gif" || suffix === "jpeg") {
        type = suffix;
    }
    return type;
}
