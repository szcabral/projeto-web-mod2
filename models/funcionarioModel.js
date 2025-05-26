class Funcionario {
    constructor(db) {
        this.db = db;
    }

    async criar(dados) {
        const query = `
            INSERT INTO funcionarios (nome, cargo, senha)
            VALUES ($1, $2, $3) RETURNING *
        `;
        const result = await this.db.query(query, [
            dados.nome, dados.cargo, dados.senha
        ]);
        return result.rows[0];
    }

    async buscarTodos() {
        const query = 'SELECT id, nome, cargo FROM funcionarios ORDER BY nome';
        const result = await this.db.query(query);
        return result.rows;
    }

    async buscarPorId(id) {
        const query = 'SELECT id, nome, cargo FROM funcionarios WHERE id = $1';
        const result = await this.db.query(query, [id]);
        return result.rows[0];
    }

    async atualizar(id, dados) {
        const query = `
            UPDATE funcionarios 
            SET nome = $1, cargo = $2
            WHERE id = $3 RETURNING id, nome, cargo
        `;
        const result = await this.db.query(query, [dados.nome, dados.cargo, id]);
        return result.rows[0];
    }

    async deletar(id) {
        const query = 'DELETE FROM funcionarios WHERE id = $1';
        await this.db.query(query, [id]);
    }

    async buscarEventos(funcionarioId) {
        const query = `
            SELECT e.*, c.nome as cliente_nome
            FROM eventos e
            JOIN evento_funcionario ef ON e.id = ef.evento_id
            JOIN clientes c ON e.cliente_id = c.id
            WHERE ef.funcionario_id = $1
            ORDER BY e.data DESC
        `;
        const result = await this.db.query(query, [funcionarioId]);
        return result.rows;
    }

    async buscarAgendamentos(funcionarioId) {
        const query = `
            SELECT a.*, e.titulo as evento_titulo
            FROM agendamentos a
            LEFT JOIN eventos e ON a.evento_id = e.id
            WHERE a.funcionario_id = $1
            ORDER BY a.data DESC, a.horario
        `;
        const result = await this.db.query(query, [funcionarioId]);
        return result.rows;
    }

    async verificarDisponibilidade(funcionarioId, data, horario) {
        const query = `
            SELECT * FROM agendamentos 
            WHERE funcionario_id = $1 AND data = $2 AND horario = $3 AND disponivel = false
        `;
        const result = await this.db.query(query, [funcionarioId, data, horario]);
        return result.rows.length === 0;
    }
}
