-- Tabela de CLIENTES
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Tabela de FUNCIONARIOS
CREATE TABLE funcionarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50),
    senha VARCHAR(255) NOT NULL
);

-- Tabela de SERVICOS
CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(100),
    custo DECIMAL(10,2)
);

-- Tabela de EVENTOS
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    preco_unitario DECIMAL(10,2),
    cliente_id INT REFERENCES clientes(id) -- relacionamento: CLIENTES realiza EVENTOS
);

-- Tabela de AGENDAMENTOS
CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(100),
    disponivel BOOLEAN DEFAULT TRUE,
    horario TIME NOT NULL,
    data DATE NOT NULL,
    funcionario_id INT REFERENCES funcionarios(id),
    evento_id INT REFERENCES eventos(id) -- relacionamento: EVENTOS preenche AGENDAMENTOS
);

-- Tabela de ligação: FUNCIONARIOS organizam EVENTOS (n:n)
CREATE TABLE evento_funcionario (
    evento_id INT REFERENCES eventos(id),
    funcionario_id INT REFERENCES funcionarios(id),
    PRIMARY KEY (evento_id, funcionario_id)
);

-- Tabela de ligação: EVENTOS incluem SERVICOS (n:n)
CREATE TABLE evento_servico (
    evento_id INT REFERENCES eventos(id),
    servico_id INT REFERENCES servicos(id),
    PRIMARY KEY (evento_id, servico_id)
);
