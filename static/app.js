document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');

    // Drag and drop visual effects
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    // Handle file selection
    dropZone.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    function handleFiles(files) {
        if (!files.length) return;
        Array.from(files).forEach(uploadFile);
    }

    function createFileElement(id, fileName) {
        const div = document.createElement('div');
        div.className = 'file-item';
        div.id = `file-${id}`;
        
        div.innerHTML = `
            <div class="file-header">
                <span class="file-name">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    ${fileName}
                </span>
                <span class="file-status processing">Processando áudio...</span>
            </div>
            <div class="progress-bar-bg" id="progress-bg-${id}">
                <div class="progress-bar" id="progress-${id}" style="width: 5%"></div>
            </div>
            <div class="result-area" id="result-${id}">
                <textarea class="transcription-result" readonly placeholder="A transcrição aparecerá aqui..."></textarea>
                <div class="actions">
                    <button class="copy-btn">Copiar</button>
                    <button class="download-btn">Baixar .txt</button>
                </div>
            </div>
        `;
        
        fileList.prepend(div);
        return div;
    }

    async function uploadFile(file) {
        const fileId = Math.random().toString(36).substring(2, 9);
        const fileEl = createFileElement(fileId, file.name);
        
        const statusEl = fileEl.querySelector('.file-status');
        const progressBar = fileEl.querySelector(`#progress-${fileId}`);
        const resultArea = fileEl.querySelector(`#result-${fileId}`);
        const textarea = fileEl.querySelector('textarea');
        const progressBg = fileEl.querySelector(`#progress-bg-${fileId}`);
        
        const copyBtn = fileEl.querySelector('.copy-btn');
        const downloadBtn = fileEl.querySelector('.download-btn');

        // Simulador visual de progresso (ia demora e não conseguimos stream direto do ffmpeg pro frontend sem sockets)
        let progress = 5;
        const interval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 2;
                progressBar.style.width = `${progress}%`;
            }
        }, 1500);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/transcribe', {
                method: 'POST',
                body: formData
            });

            clearInterval(interval);
            
            if (!response.ok) {
                let errorMsg = 'Erro na transcrição';
                try {
                    const errData = await response.json();
                    errorMsg = errData.error || errorMsg;
                } catch(e) {}
                throw new Error(errorMsg);
            }

            const data = await response.json();
            
            // Fim com Sucesso
            progressBar.style.width = '100%';
            setTimeout(() => progressBg.style.display = 'none', 500);
            
            statusEl.className = 'file-status success';
            statusEl.textContent = 'Transcrito com Sucesso';
            
            textarea.value = data.transcription;
            resultArea.classList.add('visible');
            
            // Botões de Interação
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(data.transcription);
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copiado!';
                setTimeout(() => copyBtn.textContent = originalText, 2000);
            };
            
            downloadBtn.onclick = () => {
                const blob = new Blob([data.transcription], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${file.name.split('.')[0]}_transcricao.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };

        } catch (error) {
            clearInterval(interval);
            progressBar.style.width = '100%';
            progressBar.style.background = 'var(--error-color)';
            
            statusEl.className = 'file-status error';
            statusEl.textContent = 'Erro: Falha no processamento';
            
            textarea.value = error.message + '\n\nCertifique-se de que enviou um vídeo ou áudio válido.';
            resultArea.classList.add('visible');
            copyBtn.style.display = 'none';
            downloadBtn.style.display = 'none';
        }
    }
});
