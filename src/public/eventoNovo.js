document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("eventoForm");
    
    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const dadosEvento = {
                titulo: formData.get("nome"), // Corrigido: nome do campo no EJS é 'nome'
                descricao: formData.get("descricao"),
                data: formData.get("data_evento"), // Corrigido: nome do campo no EJS é 'data_evento'
                horario: formData.get("horario"),
                local: formData.get("local"),
                tipo_evento: formData.get("tipo_evento"),
                numero_convidados: parseInt(formData.get("numero_convidados")),
                preco_unitario: parseFloat(formData.get("orcamento")), 
                observacoes: formData.get("observacoes"),
                cliente_id: 1 
            };

            const camposObrigatorios = ["titulo", "data", "horario", "local", "tipo_evento"];
            const erros = UIUtils.validateForm(dadosEvento, camposObrigatorios);
            
            if (erros.length > 0) {
                UIUtils.showMessage(erros.join(", "), "error");
                return;
            }

            try {
                UIUtils.showLoading(true);
                
                const resultado = await freshMuseAPI.criarEvento(dadosEvento);
                
                UIUtils.showMessage("Evento criado com sucesso!", "success");
                
                form.reset();
                
                setTimeout(() => {
                    window.location.href = "/clienteDashboard";
                }, 2000);
                
            } catch (error) {
                UIUtils.showMessage(`Erro ao criar evento: ${error.message}`, "error");
            } finally {
                UIUtils.showLoading(false);
            }
        });
    }

    const orcamentoInput = document.getElementById("orcamento");
    if (orcamentoInput) {
        orcamentoInput.addEventListener("input", function(e) {
            let value = e.target.value.replace(/[^\d,]/g, "");
            e.target.value = value;
        });
    }

    const numeroConvidadosInput = document.getElementById("numero_convidados");
    if (numeroConvidadosInput) {
        numeroConvidadosInput.addEventListener("input", function(e) {
            e.target.value = e.target.value.replace(/[^\d]/g, "");
        });
    }
});


