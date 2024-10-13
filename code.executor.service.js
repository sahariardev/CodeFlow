import {executeCode as execute} from "./java.code.executor.service.js";

const executeCode = (code, language) => {
    if (language && language.toLowerCase() === 'JAVA'.toLowerCase()) {
        return execute(code);
    } else {
        throw Error(`Language not supported ${language}`);
    }
}

export default executeCode;