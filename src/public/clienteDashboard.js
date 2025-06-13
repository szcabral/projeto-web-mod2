document.addEventListener('DOMContentLoaded', function() {
    carregarInformacoesCliente();
    
    configurarEventosBotoes();
});

async function carregarInformacoesCliente() {
    try {
        const nomeCliente = localStorage.getItem('nomeCliente') || 'Cliente';
        const tituloElement = document.querySelector('.titulo');
        if (tituloElement) {
            tituloElement.textContent = `Seja bem-vindo, ${nomeCliente}!`;
        }
    } catch (error) {
        console.error('Erro ao carregar informações do cliente:', error);
    }
}

function configurarEventosBotoes() {
    const btnNovoEvento = document.querySelector('a[href="/eventoNovo"]');
    if (btnNovoEvento) {
        btnNovoEvento.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    const btnMeusEventos = document.querySelector('a[href="/meusEventosCliente"]');
    if (btnMeusEventos) {
        btnMeusEventos.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    const btnVoltar = document.querySelector('a[href="/"]');
    if (btnVoltar) {
        btnVoltar.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

function logout() {
    localStorage.removeItem('nomeCliente');
    localStorage.removeItem('clienteId');
    UIUtils.showMessage('Logout realizado com sucesso!', 'success');
    setTimeout(() => {
        window.location.href = '/';
    }, 1500);
}

