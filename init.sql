CREATE TABLE CLIENTES (
    ID SERIAL PRIMARY KEY,
    NOME VARCHAR(100),
    EMAIL VARCHAR(100),
    TELEFONE VARCHAR(20),
    DATAS TIMESTAMP,
    ENVIADO_CONFIRMACAO BOOLEAN NOT NULL,
    ENVIADO_LEMBRETE BOOLEAN NOT NULL,
    ENVIADO_COMPROVANTE BOOLEAN NOT NULL,
    RUA VARCHAR(100),
    ESTADO VARCHAR(100),
    CIDADE VARCHAR(100),
    CEP VARCHAR(10)
);

ALTER TABLE CLIENTES
ALTER COLUMN ENVIADO_CONFIRMACAO SET DEFAULT 'FALSE',
ALTER COLUMN ENVIADO_LEMBRETE SET DEFAULT 'FALSE',
ALTER COLUMN ENVIADO SET DEFAULT 'FALSE'
ALTER COLUMN ENVIADO_COMPROVANTE SET DEFAULT 'FALSE';