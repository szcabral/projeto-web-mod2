const db = require("./config/database");
const Cliente = require("./models/clienteModel");
const Funcionario = require("./models/funcionarioModel");
const Servico = require("./models/servicoModel");
const Evento = require("./models/eventoModel");

async function seedDatabase() {
  try {
    console.log("Iniciando o processo de seeding do banco de dados...");

    console.log("Limpando tabelas existentes...");
    await db.query("DELETE FROM evento_servico");
    await db.query("DELETE FROM evento_funcionario");
    await db.query("DELETE FROM agendamentos");
    await db.query("DELETE FROM eventos");
    await db.query("DELETE FROM servicos");
    await db.query("DELETE FROM funcionarios");
    await db.query("DELETE FROM clientes");
    console.log("Tabelas limpas.");

    console.log("Inserindo clientes...");
    const cliente1 = await Cliente.create({
      nome: "João Silva",
      email: "joao.silva@example.com",
      telefone: "11987654321",
      cpf: "123.456.789-01",
      senha: "senha123",
    });
    const cliente2 = await Cliente.create({
      nome: "Maria Oliveira",
      email: "maria.oliveira@example.com",
      telefone: "21998765432",
      cpf: "987.654.321-09",
      senha: "senha456",
    });
    console.log("Clientes inseridos.");

    console.log("Inserindo funcionários...");
    const funcionario1 = await Funcionario.create({
      nome: "Ana Souza",
      cargo: "Fotógrafo",
      senha: "func123",
    });
    const funcionario2 = await Funcionario.create({
      nome: "Pedro Costa",
      cargo: "Cinegrafista",
      senha: "func456",
    });
    console.log("Funcionários inseridos.");

    console.log("Inserindo serviços...");
    const servico1 = await Servico.create({
      tipo: "Fotografia de Evento",
      custo: 1500.00,
    });
    const servico2 = await Servico.create({
      tipo: "Filmagem de Casamento",
      custo: 2500.00,
    });
    console.log("Serviços inseridos.");

    console.log("Inserindo eventos...");
    await Evento.create({
      titulo: "Casamento de João e Maria",
      data: "2025-08-10",
      horario: "19:00",
      preco_unitario: 3000.00,
      cliente_id: cliente1.id,
      tipo_evento: "casamento",
      local: "Espaço Celebrar",
      numero_convidados: 150,
      descricao: "Casamento completo com cerimônia e festa.",
      observacoes: "Prioridade para fotos espontâneas.",
    });

    await Evento.create({
      titulo: "Aniversário de 5 Anos do Pedrinho",
      data: "2025-09-20",
      horario: "14:00",
      preco_unitario: 800.00,
      cliente_id: cliente2.id,
      tipo_evento: "aniversario",
      local: "Buffet Infantil Alegria",
      numero_convidados: 50,
      descricao: "Festa infantil com tema de super-heróis.",
      observacoes: "Foco em fotos das crianças brincando.",
    });
    console.log("Eventos inseridos.");

    console.log("Seeding do banco de dados concluído com sucesso!");
  } catch (error) {
    console.error("Erro durante o seeding do banco de dados:", error);
  } finally {
  }
}

seedDatabase();


