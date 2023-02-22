import { LogUtil } from "./log.util";

export namespace GenerateRandomNameUtil {
    let separator = '-';
    let dictionaries: string[][] = [
        ['Janet', 'Larry', 'Craig', 'Norma'],
        ['Door', 'Wall', 'Window', 'Table'],
        ['Blue', 'Red', 'Orange', 'Green'],
        ['Tiger', 'Shark', 'Mouse', 'Lion']
    ];
    const wordCount = (): number => {
        let total = 0;
        for (let index = 0; index < dictionaries.length; index++) {
            const dictionary = dictionaries[index];
            total += dictionary.length;
        }
        return total;
    }
    const getRndInteger = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    export const SetDictionaries = (_dictionaries: string[][]) => {
        dictionaries = _dictionaries;
    };
    export const SetSeparator = (_separator: string) => {
        separator = _separator;
    };
    export const RandomNameGenerator = (numberOfNames: number = 1, lowercase: boolean = true): string => {
        const total = wordCount();
        if (total < numberOfNames) {
            LogUtil.warn('numberOfNames is higher than dictionaries total items', total);
            return '';
        }
        let randomName = '';
        let countNames = 0;

        while (countNames < numberOfNames) {
            const randomNumberDictionaries = getRndInteger(0, dictionaries.length - 1);
            const dictionary = dictionaries[randomNumberDictionaries];
            const randomNumber = getRndInteger(0, dictionary.length - 1);
            const word = dictionary[randomNumber];
            if (!word) {
                continue
            }
            if (randomName.includes(word)) {
                continue;
            }
            if (countNames < numberOfNames) {
                countNames++;
                randomName += lowercase ? word.toLowerCase() : word;
                if (countNames !== numberOfNames) {
                    randomName += separator;
                }
            } else {
                break;
            }
        }
        return randomName;
    }

}