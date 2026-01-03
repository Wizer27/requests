import * as crypto from 'crypto';

// Более простой вариант - без интерфейсов
export function generateSignature(data: Record<string, any>): string {
    const KEY = process.env.SIGNATURE_KEY || '';

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


const data = {
    username:"ivan",
    age:17
}

const signature = generateSignature(data);
console.log(signature);



