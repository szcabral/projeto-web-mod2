class FreshMuseAPI {
    constructor() {
        this.baseURL = window.location.origin;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || `Erro HTTP: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    async criarCliente(dadosCliente) {
        return this.request('/clientes', {
            method: 'POST',
            body: JSON.stringify(dadosCliente)
        });
    }

    async listarClientes() {
        return this.request('/clientes');
    }

    async buscarClientePorId(id) {
        return this.request(`/clientes/${id}`);
    }

    async atualizarCliente(id, dadosCliente) {
        return this.request(`/clientes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dadosCliente)
        });
    }

    async deletarCliente(id) {
        return this.request(`/clientes/${id}`, {
            method: 'DELETE'
        });
    }

    async loginCliente(email, senha) {
        return this.request('/clientes/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });
    }

    async criarFuncionario(dadosFuncionario) {
        return this.request('/funcionarios', {
            method: 'POST',
            body: JSON.stringify(dadosFuncionario)
        });
    }

    async listarFuncionarios() {
        return this.request('/funcionarios');
    }

    async buscarFuncionarioPorId(id) {
        return this.request(`/funcionarios/${id}`);
    }

    async atualizarFuncionario(id, dadosFuncionario) {
        return this.request(`/funcionarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dadosFuncionario)
        });
    }

    async deletarFuncionario(id) {
        return this.request(`/funcionarios/${id}`, {
            method: 'DELETE'
        });
    }

    async loginFuncionario(email, senha) {
        return this.request('/funcionarios/login', {
            method: 'POST',
            body: JSON.stringify({ email, senha })
        });
    }

    async criarEvento(dadosEvento) {
        return this.request('/eventos', {
            method: 'POST',
            body: JSON.stringify(dadosEvento)
        });
    }

    async listarEventos() {
        return this.request('/eventos');
    }

    async buscarEventoPorId(id) {
        return this.request(`/eventos/${id}`);
    }

    async atualizarEvento(id, dadosEvento) {
        return this.request(`/eventos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dadosEvento)
        });
    }

    async deletarEvento(id) {
        return this.request(`/eventos/${id}`, {
            method: 'DELETE'
        });
    }

    async criarServico(dadosServico) {
        return this.request('/servicos', {
            method: 'POST',
            body: JSON.stringify(dadosServico)
        });
    }

    async listarServicos() {
        return this.request('/servicos');
    }

    async buscarServicoPorId(id) {
        return this.request(`/servicos/${id}`);
    }

    async atualizarServico(id, dadosServico) {
        return this.request(`/servicos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dadosServico)
        });
    }

    async deletarServico(id) {
        return this.request(`/servicos/${id}`, {
            method: 'DELETE'
        });
    }

    async criarAgendamento(dadosAgendamento) {
        return this.request('/agendamentos', {
            method: 'POST',
            body: JSON.stringify(dadosAgendamento)
        });
    }

    async listarAgendamentos() {
        return this.request('/agendamentos');
    }

    async buscarAgendamentoPorId(id) {
        return this.request(`/agendamentos/${id}`);
    }

    async atualizarAgendamento(id, dadosAgendamento) {
        return this.request(`/agendamentos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dadosAgendamento)
        });
    }

    async deletarAgendamento(id) {
        return this.request(`/agendamentos/${id}`, {
            method: 'DELETE'
        });
    }
}

class UIUtils {
    static showMessage(message, type = 'info') {
        const existingMessages = document.querySelectorAll('.fresh-muse-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `fresh-muse-message fresh-muse-message-${type}`;
        messageDiv.textContent = message;
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            max-width: 300px;
            word-wrap: break-word;
            animation: slideIn 0.3s ease;
        `;

        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        messageDiv.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    static showLoading(show = true) {
        let loader = document.getElementById('fresh-muse-loader');
        
        if (show) {
            if (!loader) {
                loader = document.createElement('div');
                loader.id = 'fresh-muse-loader';
                loader.innerHTML = '<div class="spinner"></div>';
                loader.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                `;
                
                const spinner = loader.querySelector('.spinner');
                spinner.style.cssText = `
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #fa746f;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                `;
                
                document.body.appendChild(loader);
            }
        } else {
            if (loader) {
                loader.remove();
            }
        }
    }

    static validateForm(formData, requiredFields) {
        const errors = [];
        
        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                errors.push(`O campo ${field} é obrigatório`);
            }
        });

        if (formData.email && !this.isValidEmail(formData.email)) {
            errors.push('Email inválido');
        }

        if (formData.cpf && !this.isValidCPF(formData.cpf)) {
            errors.push('CPF inválido');
        }

        return errors;
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isValidCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11) return false;
        
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        return true;
    }

    static formatCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    static formatPhone(phone) {
        phone = phone.replace(/[^\d]/g, '');
        if (phone.length === 11) {
            return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (phone.length === 10) {
            return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

window.freshMuseAPI = new FreshMuseAPI();
window.UIUtils = UIUtils;

