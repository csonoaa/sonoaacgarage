// This script will compile TypeScript files in the browser
async function compileTypeScript(tsFile) {
    try {
        const response = await fetch(tsFile);
        const tsCode = await response.text();
        
        // Create a worker to compile TypeScript
        const worker = new Worker(URL.createObjectURL(new Blob([`
            self.onmessage = function(e) {
                try {
                    const result = ts.transpile(e.data);
                    self.postMessage({ success: true, code: result });
                } catch (error) {
                    self.postMessage({ success: false, error: error.message });
                }
            };
        `], { type: 'text/javascript' })));

        // Load TypeScript compiler
        const tsScript = document.createElement('script');
        tsScript.src = 'https://unpkg.com/typescript@latest/lib/typescript.js';
        document.head.appendChild(tsScript);

        return new Promise((resolve, reject) => {
            worker.onmessage = function(e) {
                if (e.data.success) {
                    resolve(e.data.code);
                } else {
                    reject(new Error(e.data.error));
                }
                worker.terminate();
            };
            worker.postMessage(tsCode);
        });
    } catch (error) {
        console.error('Error compiling TypeScript:', error);
        throw error;
    }
}

// Function to load and compile TypeScript files
async function loadTypeScriptFiles() {
    const tsFiles = [
        'ts/types.ts',
        'ts/data.ts',
        'ts/valuator.ts',
        'ts/sell.ts'
    ];

    for (const file of tsFiles) {
        try {
            const jsCode = await compileTypeScript(file);
            const script = document.createElement('script');
            script.textContent = jsCode;
            document.head.appendChild(script);
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }
}

// Load TypeScript files when the page loads
document.addEventListener('DOMContentLoaded', loadTypeScriptFiles); 