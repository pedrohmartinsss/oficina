const menu = document.getElementById("menuLateral");
const btnMenu = document.getElementById("btnMenu");
const btnFechar = document.getElementById("btnFechar");

btnMenu.addEventListener("click", () => {
  menu.classList.toggle("ativo");
});

btnFechar.addEventListener("click", () => {
  menu.classList.remove("ativo");
});


// =============================
// 🔹 Função bloqueio de Usuários
// =============================
document.addEventListener('DOMContentLoaded', function () {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const btnUsuarios = document.querySelector('a[href="cadastro usuario.html"]');

  if (usuarioLogado && usuarioLogado.acesso === 'Administrador') {
    if (btnUsuarios) {
      btnUsuarios.style.display = 'none';
    }
  }
});


// =============================
// 🔹 Logout
// =============================
function limparLogin() {
  localStorage.removeItem('usuarioLogado');
  window.location.reload();
}




// =============================
// 🔹 Variáveis e carregamento
// =============================
const form = document.getElementById('formAgendamento');
const tabelaAgenda = document.querySelector('#tabelaAgendamento tbody');

let conjuntos = JSON.parse(localStorage.getItem('agendamentos')) || [];

renderTabela();


// =============================
// 🔹 Salvar agendamento
// =============================
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const dados = Object.fromEntries(new FormData(form).entries());
  dados.status = ""; // começa sem classificação

  conjuntos.push(dados);
  localStorage.setItem('agendamentos', JSON.stringify(conjuntos));

  renderTabela();

  // Fecha modal e limpa formulário
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalAgendamento'));
  modal.hide();
  form.reset();
});


// =============================
// 🔹 Atualiza Status
// =============================
function atualizarStatus(index, novoStatus) {
  conjuntos[index].status = novoStatus;
  localStorage.setItem('agendamentos', JSON.stringify(conjuntos));
  renderTabela();
}

// =============================
// 🔹 Editar status em serviços
// =============================
function editarStatusServico(index, novoStatus) {
  const servicos = conjuntos.filter(c => c.status && c.status.trim() !== "");
  const servicoOriginal = servicos[index];

  if (!servicoOriginal) return;

  // Encontrar posição real no array original
  let originalIndex = conjuntos.indexOf(servicoOriginal);

  conjuntos[originalIndex].status = novoStatus;
  localStorage.setItem('agendamentos', JSON.stringify(conjuntos));
  renderTabela();
}



// =============================
// 🔹 Editar
// =============================
function editar(index) {
  const item = conjuntos[index];

  form.name.value = item.name;
  form.tipo.value = item.tipo;
  form.data.value = item.data;
  form.hora.value = item.hora;
  form.obs.value = item.obs;

  excluir(index);

  const modal = new bootstrap.Modal(document.getElementById('modalAgendamento'));
  modal.show();
}


// =============================
// 🔹 Excluir
// =============================
function excluir(index) {
  conjuntos.splice(index, 1);
  localStorage.setItem('agendamentos', JSON.stringify(conjuntos));
  renderTabela();
}


// =============================
// 🔹 Renderizar
// =============================
// Helpers para filtro por data
function obterIntervaloDatas() {
  const inicioVal = document.getElementById('filtroDataInicio')?.value;
  const fimVal = document.getElementById('filtroDataFim')?.value;

  let inicio = inicioVal ? new Date(inicioVal) : null;
  let fim = fimVal ? new Date(fimVal) : null;

  if (inicio) inicio.setHours(0, 0, 0, 0);
  if (fim) fim.setHours(23, 59, 59, 999);

  return { inicio, fim };
}

function passaFiltroData(item) {
  const { inicio, fim } = obterIntervaloDatas();

  // Se não houver filtros de data, passa sempre
  if (!inicio && !fim) return true;

  if (!item || !item.data) return false;

  const itemData = new Date(item.data);
  if (inicio && itemData < inicio) return false;
  if (fim && itemData > fim) return false;
  return true;
}

// Filtro de busca por nome do cliente (campo `#Filtro`)
function passaFiltroBusca(item) {
  try {
    const filtro = document.getElementById('Filtro')?.value.trim().toLowerCase();
    if (!filtro) return true;
    if (!item || !item.name) return false;
    return item.name.toLowerCase().includes(filtro);
  } catch (e) {
    return true;
  }
}
function renderTabela() {

  // Divide entre Agenda, Serviços e Concluídos classificados
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
  const tabelaAgenda = document.querySelector('#tabelaAgendamento tbody');

  if (tabelaAgenda) {
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
      `).join('');
  }


  // === Tabela SERVIÇOS ===
  const tabelaServicos = document.querySelector('#tabelaServicos tbody');

  if (tabelaServicos) {
    tabelaServicos.innerHTML = servicos.map((c, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${c.name}</td>
      <td>${c.telefone}</td>
      <td>${c.tipo}</td>

      <td>
        <select onchange="editarStatusServico(${index}, this.value)" class="form-select form-select-sm">
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
  const tabelaEntregues = document.querySelector('#tabelaEntregues tbody');

  if (tabelaEntregues) {
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
  const tabelaConcluidos = document.querySelector('#tabelaConcluidos tbody');

  if (tabelaConcluidos) {
    tabelaConcluidos.innerHTML = ""; // não renderiza concluídos/cancelados
  }


}

// =============================
// 🔹 Função para navegar entre tabelas (Mobile)
// =============================
function mostrarTabela(tipo) {
  // Só funciona em mobile (max-width 768px)
  if (window.innerWidth > 768) {
    return;
  }

  // Remover classe active de todos os botões
  document.querySelectorAll('.menu-tab-button').forEach(btn => {
    btn.classList.remove('active');
  });

  // Esconder todas as tabelas
  document.querySelectorAll('.tabela-mobile').forEach(tabela => {
    tabela.classList.remove('active');
  });

  // Mostrar a tabela selecionada e ativar o botão
  const tabela = document.querySelector(`[data-tabela="${tipo}"]`);
  const botao = document.querySelector(`.menu-tab-button[data-tab="${tipo}"]`);

  if (tabela && botao) {
    tabela.classList.add('active');
    botao.classList.add('active');
  }
}

// Adicionar eventos aos botões de navegação
document.addEventListener('DOMContentLoaded', function () {
  // Usar seletor para botões dentro do menu lateral
  document.querySelectorAll('.menu-tab-button').forEach(button => {
    button.addEventListener('click', function () {
      const tipo = this.getAttribute('data-tab');
      mostrarTabela(tipo);
    });
  });

  // Por padrão, mostrar a tabela Agenda em mobile
  if (window.innerWidth <= 768) {
    mostrarTabela('agenda');
  }

  // Adicionar listeners para inputs de data para refazer o filtro ao mudar
  const inicioInput = document.getElementById('filtroDataInicio');
  const fimInput = document.getElementById('filtroDataFim');
  if (inicioInput) inicioInput.addEventListener('change', renderTabela);
  if (fimInput) fimInput.addEventListener('change', renderTabela);
  // Listener para pesquisa (filtra por nome do cliente enquanto digita)
  const buscaInput = document.getElementById('Filtro');
  if (buscaInput) buscaInput.addEventListener('input', renderTabela);

});

// Limpa filtros de data e refaz a tabela
function limparFiltros() {
  const inicio = document.getElementById('filtroDataInicio');
  const fim = document.getElementById('filtroDataFim');
  if (inicio) inicio.value = '';
  if (fim) fim.value = '';
  renderTabela();
}

// =============================
// 🔹 Exportar Excel (Concluídos + Cancelados)
// =============================
function exportarExcel() {

  // Buscar agendamentos salvos
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

  // Filtrar apenas Concluídos e Cancelados, respeitando intervalo de datas
  const dadosExportar = agendamentos
    .filter(a => a.status === "Concluído" || a.status === "Cancelado")
    .filter(passaFiltroData);

  if (dadosExportar.length === 0) {
    alert("Não há serviços concluídos ou cancelados para exportar.");
    return;
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
  const worksheet = XLSX.utils.json_to_sheet(dadosPlanilha);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatorio");

  // Baixar arquivo
  XLSX.writeFile(workbook, "relatorio_entregues_cancelados.xlsx");
}

