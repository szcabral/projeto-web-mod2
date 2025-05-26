class Servico {
    constructor(db) {
        this.db = db;
    }

    async criar(dados) {
        const query = `
            INSERT INTO servicos (tipo, custo)
            VALUES ($1, $2) RETURNING *
        `;
        const result = await this.db.query(query, [dados.tipo, dados.custo]);
        return result.rows[0];
    }

    async buscarTodos() {
        const query = 'SELECT * FROM servicos ORDER BY tipo';
        const result = await this.db.query(query);
        return result.rows;
    }

    async buscarPorId(id) {
        const query = 'SELECT * FROM servicos WHERE id = $1';
        const result = await this.db.query(query, [id]);
        return result.rows[0];
    }

    async atualizar(id, dados) {
        const query = `
            UPDATE servicos 
            SET tipo = $1, custo = $2
            WHERE id = $3 RETURNING *
        `;
        const result = await this.db.query(query, [dados.tipo, dados.custo, id]);
        return result.rows[0];
    }

    async deletar(id) {
        const query = 'DELETE FROM servicos WHERE id = $1';
        await this.db.query(query, [id]);
    }

    async calcularCustoTotal(servicoIds) {
        const query = `
            SELECT SUM(custo) as total 
            FROM servicos 
            WHERE id = ANY($1)
        `;
        const result = await this.db.query(query, [servicoIds]);
        return parseFloat(result.rows[0].total) || 0;
    }
}
