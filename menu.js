// seleciona o elemento do menu lateral pelo ID "menuLateral"
const menu = document.getElementById("menuLateral"); // elemento do DOM do menu lateral
// seleciona o botão que abre/fecha o menu pelo ID "btnMenu"
const btnMenu = document.getElementById("btnMenu"); // botão para alternar o menu
// seleciona o botão que fecha o menu pelo ID "btnFechar"
const btnFechar = document.getElementById("btnFechar"); // botão de fechar menu

// adiciona listener para clique no botão do menu (abre/fecha)
btnMenu.addEventListener("click", () => {
  menu.classList.toggle("ativo"); // alterna a classe 'ativo' para mostrar/ocultar menu
});

// adiciona listener para clique no botão de fechar (fecha o menu)
btnFechar.addEventListener("click", () => {
  menu.classList.remove("ativo"); // remove a classe 'ativo' para garantir que o menu feche
});


// =============================
// 🔹 Função bloqueio de Usuários
// =============================
// roda quando todo o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
  // obtém o usuário logado salvo no localStorage (objeto JSON)
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  // seleciona o link para cadastro de usuário via atributo href
  const btnUsuarios = document.querySelector('a[href="cadastro usuario.html"]');

  // se houver um usuário e ele for Administrador
  if (usuarioLogado && usuarioLogado.acesso === 'Administrador') {
    if (btnUsuarios) {
      btnUsuarios.style.display = 'none'; // esconde o link de cadastro de usuários
    }
  }
});


// =============================
// 🔹 Logout
// =============================
// função para limpar login do localStorage e recarregar a página
function limparLogin() {
  localStorage.removeItem('usuarioLogado'); // remove info de usuário logado
  window.location.reload(); // recarrega a página para atualizar estado
}




// =============================
// 🔹 Variáveis e carregamento
// =============================
// referência ao formulário de agendamento pelo ID
const form = document.getElementById('formAgendamento'); // formulário principal
// referência ao corpo da tabela de agendamentos
const tabelaAgenda = document.querySelector('#tabelaAgendamento tbody'); // tbody da tabela Agenda

// carrega os agendamentos salvos no localStorage ou inicia array vazio
let conjuntos = JSON.parse(localStorage.getItem('agendamentos')) || [];

// renderiza a tabela na inicialização
renderTabela(); // popula as tabelas com os dados existentes


// =============================
// 🔹 Salvar agendamento
// =============================
// listener para submissão do formulário de agendamento
form.addEventListener('submit', (e) => {
  e.preventDefault(); // previne o envio padrão e recarregamento

  // cria um objeto com os dados do formulário
  const dados = Object.fromEntries(new FormData(form).entries());
  dados.status = ""; // inicia sem classificação de status

  conjuntos.push(dados); // adiciona novo agendamento ao array
  localStorage.setItem('agendamentos', JSON.stringify(conjuntos)); // persiste no localStorage

  renderTabela(); // atualiza exibição

  // Fecha modal e limpa formulário
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgendamento')); // obtém instância do modal
  modal.hide(); // fecha modal
  form.reset(); // limpa campos do formulário
});


// =============================
// 🔹 Atualiza Status
// =============================
// atualiza o status de um agendamento pelo índice e persiste
function atualizarStatus(index, novoStatus) {
  conjuntos[index].status = novoStatus; // altera status no array
  localStorage.setItem('agendamentos', JSON.stringify(conjuntos)); // salva no localStorage
  renderTabela(); // re-renderiza tabelas
}

// =============================
// 🔹 Editar status em serviços
// =============================
// altera o status de um serviço específico considerando apenas a lista de serviços
function editarStatusServico(index, novoStatus) {
  // filtra apenas itens que têm status não vazio (são serviços)
  const servicos = conjuntos.filter(c => c.status && c.status.trim() !== "");
  const servicoOriginal = servicos[index]; // pega o serviço pela posição filtrada

  if (!servicoOriginal) return; // se não existir, sai

  // Encontrar posição real no array original
  let originalIndex = conjuntos.indexOf(servicoOriginal); // localiza índice no array completo

  conjuntos[originalIndex].status = novoStatus; // atualiza status no array original
  localStorage.setItem('agendamentos', JSON.stringify(conjuntos)); // persiste alteração
  renderTabela(); // atualiza a interface
}



// =============================
// 🔹 Editar
// =============================
// abre o modal para editar um agendamento preenchendo o formulário
function editar(index) {
  const item = conjuntos[index]; // obtém item pelo índice

  form.name.value = item.name; // preenche campo nome
  form.tipo.value = item.tipo; // preenche campo tipo
  form.data.value = item.data; // preenche campo data
  form.hora.value = item.hora; // preenche campo hora
  form.obs.value = item.obs; // preenche campo observações

  excluir(index); // remove item antigo para que a edição seja um novo registro

  const modal = new bootstrap.Modal(document.getElementById('modalAgendamento')); // instancia modal
  modal.show(); // mostra modal para edição
}


// =============================
// 🔹 Excluir
// =============================
// remove um agendamento pelo índice e atualiza visual e armazenamento
function excluir(index) {
  conjuntos.splice(index, 1); // remove 1 elemento no índice
  localStorage.setItem('agendamentos', JSON.stringify(conjuntos)); // atualiza localStorage
  renderTabela(); // re-renderiza tabelas
}


// =============================
// 🔹 Renderizar
// =============================
// Helpers para filtro por data
// obtém intervalo de datas a partir dos inputs de filtro
function obterIntervaloDatas() {
  const inicioVal = document.getElementById('filtroDataInicio')?.value; // valor início
  const fimVal = document.getElementById('filtroDataFim')?.value; // valor fim

  let inicio = inicioVal ? new Date(inicioVal) : null; // converte para Date ou null
  let fim = fimVal ? new Date(fimVal) : null; // converte para Date ou null

  if (inicio) inicio.setHours(0, 0, 0, 0); // normaliza início do dia
  if (fim) fim.setHours(23, 59, 59, 999); // normaliza fim do dia

  return { inicio, fim }; // retorna objeto com intervalo
}

// verifica se um item passa pelos filtros de data
function passaFiltroData(item) {
  const { inicio, fim } = obterIntervaloDatas(); // obtém intervalo

  // Se não houver filtros de data, passa sempre
  if (!inicio && !fim) return true;

  if (!item || !item.data) return false; // se não tiver data, não passa

  const itemData = new Date(item.data); // converte data do item
  if (inicio && itemData < inicio) return false; // fora do intervalo início
  if (fim && itemData > fim) return false; // fora do intervalo fim
  return true; // passou no filtro de data
}

// Filtro de busca por nome do cliente (campo `#Filtro`)
function passaFiltroBusca(item) {
  try {
    const filtro = document.getElementById('Filtro')?.value.trim().toLowerCase(); // texto do filtro
    if (!filtro) return true; // sem filtro passa todos
    if (!item || !item.name) return false; // se item não tiver nome, não passa
    return item.name.toLowerCase().includes(filtro); // busca parcial por nome
  } catch (e) {
    return true; // em caso de erro, não bloquear exibição
  }
}
// Função principal que monta e atualiza todas as tabelas
function renderTabela() {

  // Divide entre Agenda (sem status), Serviços (com status) e Entregues (status "Ser entregue")
  const agenda = conjuntos.filter(c => !c.status || c.status.trim() === "").filter(passaFiltroData).filter(passaFiltroBusca);
  const servicos = conjuntos.filter(c =>
    c.status &&
    c.status !== "" &&
    c.status !== "Ser entregue" &&
    c.status !== "Concluído" &&
    c.status !== "Cancelado"
  ).filter(passaFiltroData).filter(passaFiltroBusca);

  // Mostrar apenas os agendamentos com status "Ser entregue" na UI.
  // Registros com status "Concluído" ou "Cancelado" ficam ocultos na interface
  // e estarão disponíveis apenas na exportação Excel.
  const entregues = conjuntos.filter(c => c.status === "Ser entregue").filter(passaFiltroData).filter(passaFiltroBusca);

  // === Tabela AGENDA ===
  const tabelaAgenda = document.querySelector('#tabelaAgendamento tbody'); // tbody da tabela Agenda

  if (tabelaAgenda) {
    // monta linhas da tabela Agenda usando template literals (não inserir comentários dentro do template)
    tabelaAgenda.innerHTML = agenda.map((c, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${c.name}</td>
          <td>${c.telefone}</td>
          <td>${c.tipo}</td>
          <td>${c.data}</td>
          <td>${c.hora}</td>
          <td>${c.obs}</td>
          
          <td>
            <select onchange="atualizarStatus(${conjuntos.indexOf(c)}, this.value)" class="form-select form-select-sm">
             <option value="">Sem classificação</option>
             <option value="A iniciar">A iniciar</option>
             <option value="Em andamento">Em andamento</option>
             <option value="Ser entregue">Ser entregue</option>
             <option value="Concluído">Concluído</option>
             <option value="Cancelado">Cancelado</option>
            </select>
          </td>

          <td>
            <button onclick="editar(${conjuntos.indexOf(c)})" class="btn btn-warning btn-sm">✏️</button>
            <button onclick="excluir(${conjuntos.indexOf(c)})" class="btn btn-danger btn-sm">🗑</button>
          </td>

        </tr>
      `).join(''); // junta todas as linhas em uma string
  }


  // === Tabela SERVIÇOS ===
  const tabelaServicos = document.querySelector('#tabelaServicos tbody'); // tbody da tabela Serviços

  if (tabelaServicos) {
    // monta linhas da tabela de serviços com select para alterar status
    tabelaServicos.innerHTML = servicos.map((c, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${c.name}</td>
      <td>${c.telefone}</td>
      <td>${c.tipo}</td>

      <td>
        <select onchange="atualizarStatus(${conjuntos.indexOf(c)}, this.value)" class="form-select form-select-sm">
          <option value="A iniciar" ${c.status === "A iniciar" ? "selected" : ""}>A iniciar</option>
          <option value="Em andamento" ${c.status === "Em andamento" ? "selected" : ""}>Em andamento</option>
          <option value="Ser entregue" ${c.status === "Ser entregue" ? "selected" : ""}>Ser entregue</option>
          <option value="Concluído" ${c.status === "Concluído" ? "selected" : ""}>Concluído</option>
          <option value="Cancelado" ${c.status === "Cancelado" ? "selected" : ""}>Cancelado</option>
        </select>
      </td>
    </tr>
`).join('');
  }

  // === Tabela CONCLUÍDOS / SER ENTREGUE ===
  const tabelaEntregues = document.querySelector('#tabelaEntregues tbody'); // tbody da tabela entregues

  if (tabelaEntregues) {
    // monta linhas apenas para itens com status "Ser entregue"
    tabelaEntregues.innerHTML = entregues.map((c, index) => `
      <tr>
          <td>${index + 1}</td>
          <td>${c.name}</td>
          <td>${c.telefone}</td>
          <td>${c.tipo}</td>

          <td>
            <select onchange="atualizarStatus(${conjuntos.indexOf(c)}, this.value)" class="form-select form-select-sm">
              <option value="Ser entregue" ${c.status === "Ser entregue" ? "selected" : ""}>Ser entregue</option>
              <option value="Concluído" ${c.status === "Concluído" ? "selected" : ""}>Concluído</option>
              <option value="Cancelado" ${c.status === "Cancelado" ? "selected" : ""}>Cancelado</option>
              <option value="">Remover classificação</option>
            </select>
          </td>

          <td>
            <button onclick="excluir(${conjuntos.indexOf(c)})" class="btn btn-danger btn-sm">🗑</button>
        </td>
      </tr>
    `).join('');
  }

  // === Tabela CONCLUÍDOS OCULTA (não exibe nada) ===
  const tabelaConcluidos = document.querySelector('#tabelaConcluidos tbody'); // tbody onde seriam listados concluídos

  if (tabelaConcluidos) {
    tabelaConcluidos.innerHTML = ""; // não renderiza concluídos/cancelados na UI
  }


}

// =============================
// 🔹 Função para navegar entre tabelas (Mobile)
// =============================
function mostrarTabela(tipo) {
  // Só funciona em mobile (max-width 768px)
  if (window.innerWidth > 768) {
    return; // fora do mobile, não faz nada
  }

  // Remover classe active de todos os botões
  document.querySelectorAll('.menu-tab-button').forEach(btn => {
    btn.classList.remove('active'); // desmarca todos
  });

  // Esconder todas as tabelas
  document.querySelectorAll('.tabela-mobile').forEach(tabela => {
    tabela.classList.remove('active'); // oculta cada tabela
  });

  // Mostrar a tabela selecionada e ativar o botão
  const tabela = document.querySelector(`[data-tabela="${tipo}"]`); // seleciona tabela por data-tabela
  const botao = document.querySelector(`.menu-tab-button[data-tab="${tipo}"]`); // seleciona botão correspondente

  if (tabela && botao) {
    tabela.classList.add('active'); // mostra a tabela selecionada
    botao.classList.add('active'); // marca o botão como ativo
  }
}

// Adicionar eventos aos botões de navegação
document.addEventListener('DOMContentLoaded', function () {
  // Usar seletor para botões dentro do menu lateral
  document.querySelectorAll('.menu-tab-button').forEach(button => {
    button.addEventListener('click', function () {
      const tipo = this.getAttribute('data-tab'); // obtém tipo da aba
      mostrarTabela(tipo); // chama função para mostrar tabela correspondente
    });
  });

  // Por padrão, mostrar a tabela Agenda em mobile
  if (window.innerWidth <= 768) {
    mostrarTabela('agenda'); // exibe Agenda por padrão
  }

  // Adicionar listeners para inputs de data para refazer o filtro ao mudar
  const inicioInput = document.getElementById('filtroDataInicio'); // input início
  const fimInput = document.getElementById('filtroDataFim'); // input fim
  if (inicioInput) inicioInput.addEventListener('change', renderTabela); // atualiza ao mudar
  if (fimInput) fimInput.addEventListener('change', renderTabela); // atualiza ao mudar
  // Listener para pesquisa (filtra por nome do cliente enquanto digita)
  const buscaInput = document.getElementById('Filtro'); // campo de busca
  if (buscaInput) buscaInput.addEventListener('input', renderTabela); // atualiza enquanto digita

});

// Limpa filtros de data e refaz a tabela
function limparFiltros() {
  const inicio = document.getElementById('filtroDataInicio'); // input início
  const fim = document.getElementById('filtroDataFim'); // input fim
  if (inicio) inicio.value = ''; // limpa valor início
  if (fim) fim.value = ''; // limpa valor fim
  renderTabela(); // re-renderiza tabelas
}

// =============================
// 🔹 Exportar Excel (Concluídos + Cancelados)
// =============================
function exportarExcel() {

  // Buscar agendamentos salvos
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || []; // carrega dados

  // Filtrar apenas Concluídos e Cancelados, respeitando intervalo de datas
  const dadosExportar = agendamentos
    .filter(a => a.status === "Concluído" || a.status === "Cancelado")
    .filter(passaFiltroData);

  if (dadosExportar.length === 0) {
    alert("Não há serviços concluídos ou cancelados para exportar."); // alerta usuário
    return; // encerra função
  }

  // Converter para formato aceito pelo Excel
  const dadosPlanilha = dadosExportar.map((item, index) => ({
    ID: index + 1,
    Nome: item.name,
    Telefone: item.telefone,
    Serviço: item.tipo,
    Data: item.data,
    Hora: item.hora,
    Observações: item.obs,
    Status: item.status
  }));

  // Criar planilha
  const worksheet = XLSX.utils.json_to_sheet(dadosPlanilha); // converte JSON para sheet
  const workbook = XLSX.utils.book_new(); // cria novo workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatorio"); // anexa sheet ao workbook

  // Baixar arquivo
  XLSX.writeFile(workbook, "relatorio_entregues_cancelados.xlsx"); // gera e baixa o arquivo
}

