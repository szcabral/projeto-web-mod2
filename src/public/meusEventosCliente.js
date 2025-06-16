document.addEventListener("DOMContentLoaded", function() {
    carregarEventosCliente();
});

async function carregarEventosCliente() {
    try {
        UIUtils.showLoading(true);
        
        const resultado = await freshMuseAPI.listarEventos();
        
        if (resultado.sucesso && resultado.eventos) {
            exibirEventos(resultado.eventos);
        } else {
            UIUtils.showMessage("Nenhum evento encontrado", "info");
        }
        
    } catch (error) {
        UIUtils.showMessage(`Erro ao carregar eventos: ${error.message}`, "error");
        console.error("Erro ao carregar eventos:", error);
    } finally {
        UIUtils.showLoading(false);
    }
}

function exibirEventos(eventos) {
    const container = document.getElementById("agendamentosList"); // Corrigido para agendamentosList
    if (!container) {
        console.error("Container de eventos não encontrado");
        return;
    }

    if (eventos.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                <h3>Você ainda não tem eventos cadastrados</h3>
                <p>Clique em "Novo Evento" para criar seu primeiro evento!</p>
                <a href="/eventoNovo" class="btn-novo-evento">Criar Primeiro Evento</a>
            </div>
        `;
        return;
    }

    const eventosHTML = eventos.map(evento => `
        <div class="agendamento-card" data-evento-id="${evento.id}">
            <div class="agendamento-header">
                <h2 class="agendamento-nome">${evento.titulo}</h2>
                <span class="agendamento-status ${getStatusClass(evento.data)}">
                    ${getStatusTexto(evento.data)}
                </span>
            </div>
            
            <div class="agendamento-info">
                <p><strong>Data:</strong> ${formatarData(evento.data)}</p>
                <p><strong>Horário:</strong> ${evento.horario}</p>
                <p><strong>Local:</strong> ${evento.local || 'Não informado'}</p>
                <p><strong>Tipo:</strong> ${evento.tipo_evento || 'Não informado'}</p>
                <p><strong>Convidados:</strong> ${evento.numero_convidados || 'Não informado'}</p>
                ${evento.preco_unitario ? `<p><strong>Orçamento:</strong> R$ ${formatarMoeda(evento.preco_unitario)}</p>` : ''}
            </div>
            
            ${evento.descricao ? `
                <div class="agendamento-descricao">
                    <p><strong>Descrição:</strong> ${evento.descricao}</p>
                </div>
            ` : ''}
            
            <div class="agendamento-acoes">
                <button class="btn-editar" onclick="editarEvento(${evento.id})">
                    Editar
                </button>
                <button class="btn-excluir" onclick="excluirEvento(${evento.id})">
                    Excluir
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = eventosHTML;
}

function getStatusClass(dataEvento) {
    const hoje = new Date();
    const dataEventoObj = new Date(dataEvento);
    
    if (dataEventoObj < hoje) {
        return "status-passado";
    } else if (dataEventoObj.toDateString() === hoje.toDateString()) {
        return "status-hoje";
    } else {
        return "status-futuro";
    }
}

function getStatusTexto(dataEvento) {
    const hoje = new Date();
    const dataEventoObj = new Date(dataEvento);
    
    if (dataEventoObj < hoje) {
        return "Realizado";
    } else if (dataEventoObj.toDateString() === hoje.toDateString()) {
        return "Hoje";
    } else {
        return "Agendado";
    }
}

function formatarData(data) {
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString("pt-BR");
}

function formatarMoeda(valor) {
    return parseFloat(valor).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

async function editarEvento(eventoId) {
    try {
        const evento = await freshMuseAPI.buscarEventoPorId(eventoId);
        
        if (evento.sucesso) {
            UIUtils.showMessage("Funcionalidade de edição em desenvolvimento", "info");
        }
    } catch (error) {
        UIUtils.showMessage(`Erro ao carregar evento: ${error.message}`, "error");
    }
}

async function excluirEvento(eventoId) {
    if (!confirm("Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.")) {
        return;
    }

    try {
        UIUtils.showLoading(true);
        
        await freshMuseAPI.deletarEvento(eventoId);
        
        UIUtils.showMessage("Evento excluído com sucesso!", "success");
        
        carregarEventosCliente();
        
    } catch (error) {
        UIUtils.showMessage(`Erro ao excluir evento: ${error.message}`, "error");
    } finally {
        UIUtils.showLoading(false);
    }
}


