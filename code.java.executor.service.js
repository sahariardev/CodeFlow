import fs from 'fs';
import {spawn} from 'child_process';

export const executeCode = async (code) => {
    try {
        const className = extractClassName(code);
        const path = `${className}.java`;
        await writeClassName(path, code);
        const out = await run(path, className);

        return out;

    } catch (error) {
        console.log("error is " + error);
    }
}

const extractClassName = (code) => {
    const classNameRegex = /public\s+class\s+(\w+)/;
    const match = code.match(classNameRegex);

    if (!match) {
        throw Error("Invalid Java Class");
    }

    return match[1];
}

const writeClassName = async (path, code) => {
    await fs.writeFileSync(path, code);
}

const run = async (path, className) => {
    return new Promise((resolve, reject) => {
        const javac = spawn('javac', [path]);

        javac.stderr.on('data', (error) => {
            console.log(error.toString());
        })

        javac.on('close', (compileCode, err) => {
            if (compileCode !== 0) {
                reject('Java code compilation failed');
            }

            const java = spawn('java', ['-cp', './', className]);

            let result = '';
            java.stdout.on('data', (data) => {
                result += data.toString();
            });

            java.stderr.on('data', (error) => {
                reject(error.toString());
            });

            java.on('close', (runCode) => {
                if (runCode !== 0) {
                    reject('Java code execution failed');
                }

                resolve(result);
            });
        });
    });
}

const code = `
    public class AddTwoNumbers {
    public static void main(String[] args) {
        // Hardcoded values
        double firstNumber = 5.0;  // First number
        double secondNumber = 10.0 // Second number

        // Add the two numbers
        double sum = firstNumber + secondNumber;

        // Display the result
        System.out.println("The sum of " + firstNumber + " and " + secondNumber + " is: " + sum);
    }
}
`
console.log(await executeCode(code));