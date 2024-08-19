let editarIndex = -1; // Variável para armazenar o índice da tarefa sendo editada

function adicionarClient(e) {
  const valor = document.getElementById('valor').value;
  const nome = document.getElementById('nome').value;
  const status = document.getElementById('status').value;
  const valorFormatado = parseFloat(valor.replace(',', '.')).toFixed(2);

  const newClient = { nome, status, valor: parseFloat(valorFormatado) };

  let clients = JSON.parse(localStorage.getItem('clients')) || [];
  
  if (editarIndex !== -1) { // Se estiver editando, atualiza a tarefa em vez de adicionar uma nova
    clients[editarIndex] = newClient;
    editarIndex = -1; // Reseta o índice de edição
  } else {
    clients.push(newClient);
  }

  if (nome == "" || valor == ""){
    alert("preencha os campos indicados");
  } else {
    localStorage.setItem('clients', JSON.stringify(clients));
    exibirClients();
    limparCampos();
  }

}

function authValue() {
  const valueInput = parseFloat(document.querySelector('input#valor').value);
  if (isNaN(valueInput) || valueInput <= 0) {
    return;
  }
}


function editarClients(index) {
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const clientEditada = clients[index];

  // Preenche os campos de adicionar com os valores da tarefa selecionada
  document.getElementById('nome').value = clientEditada.nome;
  document.getElementById('status').value = clientEditada.status;
  document.getElementById('valor').value = clientEditada.valor.toFixed(2);

  // Altera o texto do botão de adicionar para "Editar"
  document.getElementById('btnAdicionar').textContent = 'Editar';
  
  editarIndex = index; // Define o índice da tarefa sendo editada
}

function excluirClients(index) {
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  clients.splice(index, 1);
  localStorage.setItem('clients', JSON.stringify(clients));
  exibirClients();
}
function searchClients() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const filteredClients = clients.filter(client => client.nome.toLowerCase().includes(searchTerm));
  exibirClients(filteredClients);
}


function exibirClients(filteredClients = null) {
  const tabela = document.getElementById('tabela');
  const tabelaDevendo = document.getElementById('tabelaDevendo');
  const tabelaPago = document.getElementById('tabelaPago');

  tabela.innerHTML = '';
  tabelaDevendo.innerHTML = '';
  tabelaPago.innerHTML = '';

  const clients = filteredClients || JSON.parse(localStorage.getItem('clients')) || [];
  clients.sort((a, b) => a.nome.localeCompare(b.nome));
  let totalDevendo = 0;
  let totalPago = 0;

  clients.forEach((client, index) => {
    const row = tabela.insertRow();
    row.insertCell(0).textContent = client.nome;
    row.insertCell(1).textContent = client.status;
    row.insertCell(2).textContent = `R$ ${client.valor.toFixed(2)}`;

    // codição de style o status
    if (client.status.toLowerCase() === 'pago') {
      row.style.color = 'green';
    } else if (client.valor >= 25) {
      row.style.color = 'red';
      row.classList.add('highlight');

      const messageRow = tabela.insertRow();
      const messageCell = messageRow.insertCell(0);
      messageCell.colSpan = 4;
      messageCell.textContent = "Limite ultrapassado, já pode cobrar";
      messageRow.classList.add('warning-message-row');
    }

    const cellOpcoes = row.insertCell(3);
    const btnEditar = document.createElement('button');
    btnEditar.className = 'icon-btn';
    btnEditar.innerHTML = '<i class="fas fa-edit"></i>';
    btnEditar.onclick = () => editarClients(index);
    cellOpcoes.appendChild(btnEditar);

    const btnExcluir = document.createElement('button');
    btnExcluir.className = 'icon-btn';
    btnExcluir.innerHTML = '<i class="fas fa-trash-alt"></i>';
    btnExcluir.onclick = () => excluirClients(index);
    cellOpcoes.appendChild(btnExcluir);

    if (client.status === 'devendo') {
      totalDevendo += client.valor;
    } else if (client.status === 'pago') {
      totalPago += client.valor;
    }
  });

  tabelaDevendo.innerHTML = `<tr><td>Total Devendo:</td><td>R$ ${totalDevendo.toFixed(2)}</td></tr>`;
  tabelaPago.innerHTML = `<tr><td>Total Pago:</td><td>R$ ${totalPago.toFixed(2)}</td></tr>`;
}

function authValue() {
  const valueInput = parseInt(document.querySelector('input#valor').value);
  if (isNaN(valueInput) || valueInput <= 0) {
    document.querySelector('input#valor').value = '';
  }

}

function limparLocalStorage() {
  localStorage.removeItem('clients');
  exibirClients();
}

function limparCampos() {
  document.getElementById('nome').value = '';
  document.getElementById('status').value = 'devendo';
  document.getElementById('valor').value = '';
  document.getElementById('btnAdicionar').textContent = 'Adicionar';
  editarIndex = -1; // Reseta o índice de edição
}

document.addEventListener('DOMContentLoaded', () => {
  exibirClients();
});


function toggleTheme() {
  // Alterna a classe 'dark-theme' no elemento body
  document.body.classList.toggle('dark-theme');
  
  // Salva a preferência do tema no localStorage
  if (document.body.classList.contains('dark-theme')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
}

// Aplica o tema salvo no localStorage quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
});
