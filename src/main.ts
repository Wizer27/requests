import * as crypto from 'crypto';
import axios,{AxiosResponse} from 'axios';
import * as dotenv from 'dotenv';



const api_url:string = "http://0.0.0.0:8080";
dotenv.config();
export function generateSignature(data: Record<string, any>): string {
    const KEY = process.env.SIGNATURE || '';

    // Копируем объект и удаляем signature если есть
    const dataToVerify = { ...data };
    delete dataToVerify.signature;

    // Сортируем ключи как в Python
    const sortedKeys = Object.keys(dataToVerify).sort();
    const sortedObj: Record<string, any> = {};

    for (const key of sortedKeys) {
        sortedObj[key] = dataToVerify[key];
    }

    // JSON без пробелов (аналог separators=(',', ':'))
    const dataStr = JSON.stringify(sortedObj).replace(/\s+/g, '');

    // HMAC SHA256
    const hmac = crypto.createHmac('sha256', KEY);
    hmac.update(dataStr);
    return hmac.digest('hex');
}

type dict = { [key:string]:string};


async function register(username:string,hash_psw:string):Promise<boolean>{
    const data:dict = {
        "username":username,
        "hash_psw":hash_psw
    };
    const headers = {
        "X-Signature":generateSignature(data),
        "X-Timestamp":Date.now().toString(),
    }
    const response = await axios.post(api_url, headers);
    return response.status === 200;
}









