const resultado = document.getElementById("resultado");
const loading = document.getElementById("loading");
const copiar = document.getElementById("copiar");
const pdfBtn = document.getElementById("pdf-btn");
const inputTema = document.getElementById("pergunta");

// Clique nos botões de temas
document.querySelectorAll(".tema-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        inputTema.value = btn.innerText;
    });
});

document.getElementById("btnGerar").addEventListener("click", async () => {
    const tema = inputTema.value.trim();
    if (!tema) return alert("Digite ou selecione um tema!");

    resultado.innerText = "";
    loading.style.display = "block";
    copiar.classList.add("hidden");
    pdfBtn.classList.add("hidden");
    pptBtn.classList.remove("hidden");

    const res = await fetch("/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ pergunta: tema })
    });

    const data = await res.json();
    loading.style.display = "none";
    resultado.innerText = data.resposta;
    copiar.classList.remove("hidden");
    pdfBtn.classList.remove("hidden");
});

// Copiar
copiar.addEventListener("click", () => {
    navigator.clipboard.writeText(resultado.innerText);
    copiar.innerText = "Copiado!";
    setTimeout(() => copiar.innerText = "Copiar", 1500);
});

// PDF
pdfBtn.addEventListener("click", async () => {
    const pergunta = inputTema.value.trim();
    const conteudo = resultado.innerText.trim();
    if (!conteudo) return alert("Clique em gerar plano antes!");

    const res = await fetch("/pdf", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ pergunta, conteudo })
    });

    if (!res.ok) return alert("Erro ao gerar PDF 😢");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url);
});

const pptBtn = document.getElementById("ppt-btn");

pptBtn.addEventListener("click", async () => {
    const pergunta = inputTema.value.trim();
    const conteudo = resultado.innerText.trim();

    if (!conteudo) return alert("Clique em Gerar Plano antes!");

    const res = await fetch("/ppt", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ pergunta, conteudo })
    });

    if (!res.ok) return alert("Erro ao gerar PPTX 😢");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Slides-UNISUL.pptx";
    a.click();
});
