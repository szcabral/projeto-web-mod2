class Agendamento {
    constructor(db) {
        this.db = db;
    }

    async criar(dados) {
        const query = `
            INSERT INTO agendamentos (tipo, disponivel, horario, data, funcionario_id, evento_id)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `;
        const result = await this.db.query(query, [
            dados.tipo, dados.disponivel, dados.horario, 
            dados.data, dados.funcionario_id, dados.evento_id
        ]);
        return result.rows[0];
    }

    async buscarTodos() {
        const query = `
            SELECT a.*, f.nome as funcionario_nome, e.titulo as evento_titulo
            FROM agendamentos a
            JOIN funcionarios f ON a.funcionario_id = f.id
            LEFT JOIN eventos e ON a.evento_id = e.id
            ORDER BY a.data DESC, a.horario
        `;
        const result = await this.db.query(query);
        return result.rows;
    }

    async buscarPorId(id) {
        const query = `
            SELECT a.*, f.nome as funcionario_nome, e.titulo as evento_titulo
            FROM agendamentos a
            JOIN funcionarios f ON a.funcionario_id = f.id
            LEFT JOIN eventos e ON a.evento_id = e.id
            WHERE a.id = $1
        `;
        const result = await this.db.query(query, [id]);
        return result.rows[0];
    }

    async buscarDisponiveis(data = null) {
        let query = `
            SELECT a.*, f.nome as funcionario_nome
            FROM agendamentos a
            JOIN funcionarios f ON a.funcionario_id = f.id
            WHERE a.disponivel = true
        `;
        const params = [];
        
        if (data) {
            query += ' AND a.data = $1';
            params.push(data);
        }
        
        query += ' ORDER BY a.data, a.horario';
        
        const result = await this.db.query(query, params);
        return result.rows;
    }

    async atualizar(id, dados) {
        const query = `
            UPDATE agendamentos 
            SET tipo = $1, disponivel = $2, horario = $3, data = $4, evento_id = $5
            WHERE id = $6 RETURNING *
        `;
        const result = await this.db.query(query, [
            dados.tipo, dados.disponivel, dados.horario, 
            dados.data, dados.evento_id, id
        ]);
        return result.rows[0];
    }

    async marcarIndisponivel(id, eventoId) {
        const query = `
            UPDATE agendamentos 
            SET disponivel = false, evento_id = $2
            WHERE id = $1 RETURNING *
        `;
        const result = await this.db.query(query, [id, eventoId]);
        return result.rows[0];
    }

    async liberarHorario(id) {
        const query = `
            UPDATE agendamentos 
            SET disponivel = true, evento_id = NULL
            WHERE id = $1 RETURNING *
        `;
        const result = await this.db.query(query, [id]);
        return result.rows[0];
    }

    async deletar(id) {
        const query = 'DELETE FROM agendamentos WHERE id = $1';
        await this.db.query(query, [id]);
    }
}
