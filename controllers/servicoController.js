class ServicoController {
    constructor(servicoModel) {
        this.servicoModel = servicoModel;
    }

    async index(req, res) {
        try {
            const servicos = await this.servicoModel.buscarTodos();
            res.json({
                success: true,
                data: servicos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar serviços',
                error: error.message
            });
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const servico = await this.servicoModel.buscarPorId(id);
            
            if (!servico) {
                return res.status(404).json({
                    success: false,
                    message: 'Serviço não foi encontrado'
                });
            }

            res.json({
                success: true,
                data: servico
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar serviço',
                error: error.message
            });
        }
    }

    async store(req, res) {
        try {
            const { tipo, custo } = req.body;
            
            if (!tipo || custo === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo e custo são obrigatórios'
                });
            }

            const servico = await this.servicoModel.criar({ tipo, custo });

            res.status(201).json({
                success: true,
                message: 'Serviço foi criado com sucesso',
                data: servico
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao criar serviço',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { tipo, custo } = req.body;

            const servico = await this.servicoModel.atualizar(id, { tipo, custo });

            if (!servico) {
                return res.status(404).json({
                    success: false,
                    message: 'Serviço não foi encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Serviço foi atualizado com sucesso',
                data: servico
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao atualizar serviço',
                error: error.message
            });
        }
    }

    async destroy(req, res) {
        try {
            const { id } = req.params;
            await this.servicoModel.deletar(id);

            res.json({
                success: true,
                message: 'O Serviço foi removido com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao remover serviço',
                error: error.message
            });
        }
    }

    async calcularCusto(req, res) {
        try {
            const { servico_ids } = req.body;
            
            if (!servico_ids || !Array.isArray(servico_ids)) {
                return res.status(400).json({
                    success: false,
                    message: 'IDs dos serviços são obrigatórios'
                });
            }

            const custoTotal = await this.servicoModel.calcularCustoTotal(servico_ids);

            res.json({
                success: true,
                data: { custo_total: custoTotal }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erro ao calcular custo',
                error: error.message
            });
        }
    }
}
