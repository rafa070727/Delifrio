// Estoque inicial
let estoque = JSON.parse(localStorage.getItem('estoque')) || {
  "Coca-Cola 1 litro": 10,
  "Coca-Cola lata": 20,
  "Coca-Cola Zero lata": 15,
  "Coca-Cola 500ml": 12,
  "Coca-Cola 500ml Zero": 10,
  "Guarana lata": 18,
  "Guarana Zero lata": 15,
  "Guarana 1 litro": 12,
  "Fanta 1 litro": 10,
  "Fanta lata": 12,
  "Sprite lata": 10,
  "H2O limonete": 10,
  "H2O": 15,
  "Agua mineral": 20,
  "Agua com gas": 12,
  "Bolo no pote napolitano": 10,
  "Bolo no pote bem-casado": 10,
  "Bolo no pote chocolate": 10,
  "Fatia de torta chocolate": 10,
  "Fatia de torta bem-casado": 10,
  "Fatia de torta Red Velvet": 10,
  "Fatia de torta ninho com Nutella": 10,
  "Copo da felicidade ninho com Nutella": 10,
  "Copo da felicidade chocolate": 10,
  "Copo da felicidade bem-casado": 10,
  "Tortilete": 10,
  "Base de brownie": 10,
  "Croissant": 10,
  "Empanada de frango": 10,
  "Empanada de queijo": 10,
  "Empada de camarao": 10,
  "Empada de frango": 10,
  "Coxinha de frango": 10,
  "Coxinha de camarao": 10,
  "Coxinha de frango com requeijao": 10,
  "Empadao de frango": 10
};

// Salvar no localStorage
function salvarEstoque() {
  localStorage.setItem('estoque', JSON.stringify(estoque));
}

// Atualiza a tela
function atualizarTela() {
  for (let produto in estoque) {
    const el = document.getElementById(
      produto.replace(/\s/g, '-')
             .replace(/ç/g,'c')
             .replace(/ã/g,'a')
             .replace(/é/g,'e')
             .replace(/ó/g,'o')
    );
    if (el) el.innerText = `${produto}: ${estoque[produto]}`;
  }
}

// Adicionar produto
function adicionarProduto() {
  const nome = document.getElementById('produto-pesquisa').value;
  const qtd = parseInt(document.getElementById('quantidade').value);
  const mensagem = document.getElementById('mensagem');

  if (!nome || isNaN(qtd)) {
    mensagem.style.color = 'red';
    mensagem.innerText = "Preencha o produto e a quantidade corretamente!";
    return;
  }

  if (!estoque[nome]) estoque[nome] = 0;
  estoque[nome] += qtd;

  mensagem.style.color = 'green';
  mensagem.innerText = `Adicionado ${qtd} de ${nome}. Estoque atual: ${estoque[nome]}`;
  atualizarTela();
  salvarEstoque();
}

// Remover produto
function removerProduto() {
  const nome = document.getElementById('produto-pesquisa').value;
  const qtd = parseInt(document.getElementById('quantidade').value);
  const mensagem = document.getElementById('mensagem');

  if (!nome || isNaN(qtd)) {
    mensagem.style.color = 'red';
    mensagem.innerText = "Preencha o produto e a quantidade corretamente!";
    return;
  }

  if (!estoque[nome] || estoque[nome] < qtd) {
    mensagem.style.color = 'red';
    mensagem.innerText = `Quantidade insuficiente! Estoque atual: ${estoque[nome] || 0}`;
    return;
  }

  estoque[nome] -= qtd;
  mensagem.style.color = 'green';
  mensagem.innerText = `Removido ${qtd} de ${nome}. Estoque atual: ${estoque[nome]}`;
  atualizarTela();
  salvarEstoque();
}

// Remover acentos
function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Autocomplete
const inputProduto = document.getElementById('produto-pesquisa');
const sugestoesContainer = document.getElementById('sugestoes');

inputProduto.addEventListener('input', function(){
  const termo = removerAcentos(this.value);
  sugestoesContainer.innerHTML = '';
  if(termo === '') return;

  const resultados = Object.keys(estoque).filter(p => removerAcentos(p).includes(termo));
  resultados.forEach(produto => {
    const div = document.createElement('div');
    div.innerText = produto;
    div.addEventListener('click', function(){
      inputProduto.value = produto;
      sugestoesContainer.innerHTML = '';
    });
    sugestoesContainer.appendChild(div);
  });
});

document.addEventListener('click', e => {
  if(e.target !== inputProduto) sugestoesContainer.innerHTML = '';
});

// Compartilhar PDF
async function compartilharPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;
  doc.setFontSize(16);
  doc.text("Estoque Delifrio 2.0", 10, y);
  y += 10;

  for (let produto in estoque) {
    doc.setFontSize(12);
    doc.text(`${produto}: ${estoque[produto]}`, 10, y);
    y += 8;
    if (y > 280) { doc.addPage(); y = 10; }
  }

  const pdfBlob = doc.output('blob');
  const file = new File([pdfBlob], "estoque.pdf", { type: "application/pdf" });

  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Estoque Delifrio 2.0",
        text: "Segue o estoque atualizado."
      });
      alert("Compartilhado com sucesso!");
    } else {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = "estoque.pdf";
      a.click();
      URL.revokeObjectURL(url);
      alert("Seu navegador não suporta compartilhamento direto. O PDF foi baixado.");
    }
  } catch(err) {
    alert("Erro ao compartilhar: " + err);
  }
}

// Inicializa tela
atualizarTela();

// Registrar Service Worker
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js').then(() => console.log('Service Worker registrado'));
}
