let editarIndex = -1; // Variável para armazenar o índice da tarefa sendo editada

function adicionarTarefa() {
  const nome = document.getElementById('nome').value;
  const status = document.getElementById('status').value;
  const valor = document.getElementById('valor').value;
  const valorFormatado = parseFloat(valor.replace(',', '.')).toFixed(2);

  const novaTarefa = { nome, status, valor: parseFloat(valorFormatado) };

  let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  
  if (editarIndex !== -1) { // Se estiver editando, atualiza a tarefa em vez de adicionar uma nova
    tarefas[editarIndex] = novaTarefa;
    editarIndex = -1; // Reseta o índice de edição
  } else {
    tarefas.push(novaTarefa);
  }

  localStorage.setItem('tarefas', JSON.stringify(tarefas));

  exibirTarefas();
  limparCampos();
}

function editarTarefa(index) {
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  const tarefaEditada = tarefas[index];

  // Preenche os campos de adicionar com os valores da tarefa selecionada
  document.getElementById('nome').value = tarefaEditada.nome;
  document.getElementById('status').value = tarefaEditada.status;
  document.getElementById('valor').value = tarefaEditada.valor.toFixed(2);

  // Altera o texto do botão de adicionar para "Editar"
  document.getElementById('btnAdicionar').textContent = 'Editar';
  
  editarIndex = index; // Define o índice da tarefa sendo editada
}

function excluirTarefa(index) {
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  tarefas.splice(index, 1);
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
  exibirTarefas();
}

function exibirTarefas() {
  const tabela = document.getElementById('tabela');
  const tabelaDevendo = document.getElementById('tabelaDevendo');
  const tabelaPago = document.getElementById('tabelaPago');

  tabela.innerHTML = '';
  tabelaDevendo.innerHTML = '';
  tabelaPago.innerHTML = '';

  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  let totalDevendo = 0;
  let totalPago = 0;

  tarefas.forEach((tarefa, index) => {
    const row = tabela.insertRow();
    row.insertCell(0).textContent = tarefa.nome;
    row.insertCell(1).textContent = tarefa.status;
    row.insertCell(2).textContent = `R$ ${tarefa.valor.toFixed(2)}`;

    const cellOpcoes = row.insertCell(3);
    const btnEditar = document.createElement('button');
    btnEditar.className = 'icon-btn';
    btnEditar.innerHTML = '<i class="fas fa-edit"></i>';
    btnEditar.onclick = () => editarTarefa(index);
    cellOpcoes.appendChild(btnEditar);

    const btnExcluir = document.createElement('button');
    btnExcluir.className = 'icon-btn';
    btnExcluir.innerHTML = '<i class="fas fa-trash-alt"></i>';
    btnExcluir.onclick = () => excluirTarefa(index);
    cellOpcoes.appendChild(btnExcluir);

    if (tarefa.status === 'devendo') {
      totalDevendo += tarefa.valor;
    } else if (tarefa.status === 'pago') {
      totalPago += tarefa.valor;
    }
  });

  tabelaDevendo.innerHTML = `<tr><td>Total Devendo:</td><td>R$ ${totalDevendo.toFixed(2)}</td></tr>`;
  tabelaPago.innerHTML = `<tr><td>Total Pago:</td><td>R$ ${totalPago.toFixed(2)}</td></tr>`;
}

function limparLocalStorage() {
  localStorage.removeItem('tarefas');
  exibirTarefas();
}

function limparCampos() {
  document.getElementById('nome').value = '';
  document.getElementById('status').value = 'devendo';
  document.getElementById('valor').value = '';
  document.getElementById('btnAdicionar').textContent = 'Adicionar';
  editarIndex = -1; // Reseta o índice de edição
}

document.addEventListener('DOMContentLoaded', () => {
  exibirTarefas();
});
