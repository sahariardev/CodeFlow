import fs from 'fs';
import {spawn} from 'child_process';
import path from 'path';

export const executeCode = async (code) => {
    await cleanUpExistingCode('./');
    try {
        const className = extractClassName(code);
        const path = `${className}.java`;
        await writeClassName(path, code);
        return await run(path, className);

    } catch (error) {
        return error.toString();
    }
}

const cleanUpExistingCode = async (directory) => {
    try {
        const files = fs.readdirSync(directory, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(directory, file.name);

            // Check if it's a directory, recursively call the function
             if (file.isFile() && (file.name.endsWith('.class') || file.name.endsWith('.java'))) {
                // Delete .class or .java files
                fs.unlinkSync(fullPath);
                console.log(`Deleted: ${fullPath}`);
            }
        }
    } catch (error) {
        console.log(error);
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

const run = async (path, className, maxTimeToRun) => {
    return new Promise((resolve, reject) => {
        const javac = spawn('javac', [path]);

        javac.stderr.on('data', (error) => {
            reject(error.toString());
        })

        javac.on('close', (compileCode, err) => {
            if (compileCode !== 0) {
                reject('Java code compilation failed');
            }

            const java = spawn('java', ['-cp', './', className]);

            let isTimeoutReached = false;

            const timeout = setTimeout(() => {
                isTimeoutReached = true;
                java.kill(); // Kill the Java process if timeout is reached
                reject('Execution time limit exceeded');
            }, maxTimeToRun);

            let result = '';
            java.stdout.on('data', (data) => {
                result += data.toString();
            });

            java.stderr.on('data', (error) => {
                reject(error.toString());
            });

            java.on('close', (runCode) => {
                clearTimeout(timeout); // Clear the timeout if the process finishes

                if (isTimeoutReached) return;

                if (runCode !== 0) {
                    reject('Java code execution failed');
                }

                resolve(result);
            });
        });
    });
}