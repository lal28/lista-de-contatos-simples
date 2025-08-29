//criação da classe
class Contato {
  constructor(nome, email, telefone) {
    this.nome = nome;       // chama o setter
    this.email = email;     // chama o setter
    this.telefone = telefone; // chama o setter
  }

  get nome() { return this._nome; }
  set nome(valor) {
    if (valor.length > 0) {
      this._nome = valor;
    } else {
      throw new Error("Nome inválido!");
    }
  }

  get email() { return this._email; }
  set email(valor) {
    if (valor.includes("@")) {
      this._email = valor;
    } else {
      throw new Error("E-mail inválido!");
    }
  }

  get telefone() { return this._telefone; }
  set telefone(valor) {
    // remove tudo que não é número
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length >= 8) {
      this._telefone = numeros;
    } else {
      throw new Error("Telefone inválido!");
    }
  }
}


const form = document.getElementById("form-contato");
const tabelaBody = document.querySelector("#tabela-contatos tbody");

const erroNome = document.getElementById("erro-nome");
const erroEmail = document.getElementById("erro-email");
const erroTelefone = document.getElementById("erro-telefone");

let listaContatos = [];


//salvar no local storage
function salvarLocalStorage() {
  localStorage.setItem("contatos", JSON.stringify(listaContatos));
}

function carregarLocalStorage() {
  const dados = localStorage.getItem("contatos");
  if (dados) {
    const contatosParse = JSON.parse(dados);
    listaContatos = contatosParse.map(c => new Contato(c._nome, c._email, c._telefone));
  }
}

//mostrar a lista
function renderizarLista() {
  tabelaBody.innerHTML = "";
  listaContatos.forEach(c => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${c.nome}</td>
        <td>${c.email}</td>
        <td>${c.telefone}</td>
        <td><button class="remover">Remover</button></td>
      `;

    tr.querySelector("button").addEventListener("click", () => removerContato(c.email));
    tabelaBody.appendChild(tr);
  });
}

function adicionarContato(contato) {
  listaContatos.push(contato);
  renderizarLista();
  salvarLocalStorage();
}

function removerContato(email) {
  listaContatos = listaContatos.filter(c => c.email !== email);
  renderizarLista();
  salvarLocalStorage();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Resetar mensagens de erro
  erroNome.textContent = "";
  erroEmail.textContent = "";
  erroTelefone.textContent = "";

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  try {
    const novoContato = new Contato(nome, email, telefone);
    adicionarContato(novoContato);
    form.reset();
    document.getElementById("nome").focus();
  } catch (error) {
    // Mostrar mensagens de erro
    if (error.message.includes("Nome")) erroNome.textContent = error.message;
    if (error.message.includes("E-mail")) erroEmail.textContent = error.message;
    if (error.message.includes("Telefone")) erroTelefone.textContent = error.message;
  }
});

// Inicializar
carregarLocalStorage();
renderizarLista();
