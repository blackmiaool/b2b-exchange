import axios from "axios";
import config from "../config";
import { AnyMap } from "./types";

export function request({
    method,
    data,
    headers,
    responseType
}: {
    method: string;
    headers?: any;
    data?: AnyMap;
    responseType?: any;
}): Promise<any> {
    const origin = `http://${config.server}:${config.port}`;
    return axios({
        method: "POST",
        url: `${origin}/${method}`,
        headers,
        data,
        responseType
    }).then(result => {
        return result.data;
    });
}
