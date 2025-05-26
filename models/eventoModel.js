class Evento {
    constructor(db) {
        this.db = db;
    }

    async criar(dados) {
        const client = await this.db.connect();
        try {
            await client.query('BEGIN');

            // Criar evento
            const eventoQuery = `
                INSERT INTO eventos (titulo, data, horario, preco_unitario, cliente_id)
                VALUES ($1, $2, $3, $4, $5) RETURNING *
            `;
            const eventoResult = await client.query(eventoQuery, [
                dados.titulo, dados.data, dados.horario, dados.preco_unitario, dados.cliente_id
            ]);
            const evento = eventoResult.rows[0];

            if (dados.funcionario_ids && dados.funcionario_ids.length > 0) {
                for (const funcionarioId of dados.funcionario_ids) {
                    await client.query(
                        'INSERT INTO evento_funcionario (evento_id, funcionario_id) VALUES ($1, $2)',
                        [evento.id, funcionarioId]
                    );
                }
            }

            if (dados.servico_ids && dados.servico_ids.length > 0) {
                for (const servicoId of dados.servico_ids) {
                    await client.query(
                        'INSERT INTO evento_servico (evento_id, servico_id) VALUES ($1, $2)',
                        [evento.id, servicoId]
                    );
                }
            }

            await client.query('COMMIT');
            return evento;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async buscarTodos() {
        const query = `
            SELECT e.*, c.nome as cliente_nome,
                   COUNT(DISTINCT ef.funcionario_id) as total_funcionarios,
                   COUNT(DISTINCT es.servico_id) as total_servicos
            FROM eventos e
            JOIN clientes c ON e.cliente_id = c.id
            LEFT JOIN evento_funcionario ef ON e.id = ef.evento_id
            LEFT JOIN evento_servico es ON e.id = es.evento_id
            GROUP BY e.id, c.nome
            ORDER BY e.data DESC
        `;
        const result = await this.db.query(query);
        return result.rows;
    }

    async buscarPorId(id) {
        const query = `
            SELECT e.*, c.nome as cliente_nome, c.email as cliente_email
            FROM eventos e
            JOIN clientes c ON e.cliente_id = c.id
            WHERE e.id = $1
        `;
        const result = await this.db.query(query, [id]);
        return result.rows[0];
    }

    async buscarFuncionarios(eventoId) {
        const query = `
            SELECT f.* FROM funcionarios f
            JOIN evento_funcionario ef ON f.id = ef.funcionario_id
            WHERE ef.evento_id = $1
        `;
        const result = await this.db.query(query, [eventoId]);
        return result.rows;
    }

    async buscarServicos(eventoId) {
        const query = `
            SELECT s.* FROM servicos s
            JOIN evento_servico es ON s.id = es.servico_id
            WHERE es.evento_id = $1
        `;
        const result = await this.db.query(query, [eventoId]);
        return result.rows;
    }

    async atualizar(id, dados) {
        const query = `
            UPDATE eventos 
            SET titulo = $1, data = $2, horario = $3, preco_unitario = $4
            WHERE id = $5 RETURNING *
        `;
        const result = await this.db.query(query, [
            dados.titulo, dados.data, dados.horario, dados.preco_unitario, id
        ]);
        return result.rows[0];
    }

    async deletar(id) {
        const client = await this.db.connect();
        try {
            await client.query('BEGIN');
            
            // Remove associações
            await client.query('DELETE FROM evento_funcionario WHERE evento_id = $1', [id]);
            await client.query('DELETE FROM evento_servico WHERE evento_id = $1', [id]);
            await client.query('UPDATE agendamentos SET evento_id = NULL WHERE evento_id = $1', [id]);
            
            // Remove evento
            await client.query('DELETE FROM eventos WHERE id = $1', [id]);
            
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}