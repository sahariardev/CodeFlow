
function initializeCodeFlow(codeContainerId) {
    const container = document.createElement("div");
    container.classList.add();

    const textAreaElem = document.getElementById(codeContainerId);
    const newTextArea = textAreaElem.cloneNode(true);
    container.append(newTextArea);

    const codeExecutorBody =
        `
            <button class="play-button" >Run</button>
            <textarea class="result" readonly></textarea>
        `;

    const codeExecutorContainer = document.createElement('div');
    codeExecutorContainer.classList.add('code-executor-container');
    codeExecutorContainer.innerHTML = codeExecutorBody;

    container.append(codeExecutorContainer);
    textAreaElem.parentElement.replaceChild(container, textAreaElem);
    const code = textAreaElem.innerHTML;

    var editor = CodeMirror.fromTextArea(newTextArea, {
        lineNumbers: true,
        mode: "text/x-java",
        theme: "dracula",
        indentUnit: 4,
        tabSize: 4,
        matchBrackets: true
    });

    editor.setValue(code);

    const playBtnElem = codeExecutorContainer.querySelector('.play-button');
    const outPutElem = codeExecutorContainer.querySelector('.result');

    playBtnElem.addEventListener('click', (e) => {
        const url = 'https://codeflow-latest.onrender.com/run';
        const data = {
            code: editor.getValue()
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                outPutElem.innerHTML = data.message;
            })
            .catch((error) => {
                console.log(error)
                outPutElem.innerHTML = error.message.toString();
            });
    });
}
