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
function renderTabela() {

  // Divide entre Agenda, Serviços e Concluídos classificados
  const agenda = conjuntos.filter(c => !c.status || c.status.trim() === "");
  const servicos = conjuntos.filter(c => c.status && c.status.trim() !== "" && c.status !== "Concluído" && c.status !== "Cancelado");
  const concluidos = conjuntos.filter(c => c.status && (c.status.trim() === "Concluído" || c.status === "Cancelado"));

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
          <option value="Concluído" ${c.status === "Concluído" ? "selected" : ""}>Concluído</option>
          <option value="Cancelado" ${c.status === "Cancelado" ? "selected" : ""}>Cancelado</option>
        </select>
      </td>
    </tr>
`).join('');
  }

  // === Tabela CONCLUÍDOS ===
  const tabelaConcluidos = document.querySelector('#tabelaConcluidos tbody');

  if (tabelaConcluidos) {
    tabelaConcluidos.innerHTML = concluidos.map((c, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${c.name}</td>
            <td>${c.telefone}</td>
            <td>${c.tipo}</td>
            <td>${c.status}</td>

            <td>
              <button onclick="excluir(${conjuntos.indexOf(c)})" class="btn btn-danger btn-sm">🗑</button>
          </td>
        </tr>
    `).join('');
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
});
