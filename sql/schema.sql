CREATE DATABASE IF NOT EXISTS alertamente_db;
USE alertamente_db;

CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    is_paciente BOOLEAN DEFAULT TRUE,
    is_contato_emergencia BOOLEAN DEFAULT FALSE,
    INDEX (email)
);

CREATE TABLE EVENTO_AGENDA (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NULL,        
    data_hora TIME NOT NULL,          
    data_inicio DATE NOT NULL,       
    data_fim DATE NULL,              
    tipo ENUM('MEDICAMENTO', 'CONSULTA', 'SONO', 'HIDRATACAO', 'MEDITACAO', 'EVENTO', 'GERAL') NOT NULL, 
    id_paciente INT NOT NULL,       
    id_criador INT NOT NULL,       

    FOREIGN KEY (id_paciente) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_criador) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE, 

    INDEX idx_evento_paciente (id_paciente),
    INDEX idx_evento_tipo (tipo),
    INDEX idx_evento_datas (data_inicio, data_fim)
);

CREATE TABLE OCORRENCIA_AGENDA (
    id_ocorrencia INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,             
    usuario_id INT NOT NULL,            
    data_ocorrencia DATE NOT NULL,      
    status_concluido BOOLEAN DEFAULT FALSE, 

    FOREIGN KEY (id_evento) REFERENCES EVENTO_AGENDA(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,

    INDEX idx_ocorrencia_evento (id_evento),
    INDEX idx_ocorrencia_usuario_data (usuario_id, data_ocorrencia) 
);

CREATE TABLE CONTATO_EMERGENCIA (
    id_relacao INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,            
    id_contato INT NOT NULL,              
    whatsapp_numero VARCHAR(20) NOT NULL,   

    FOREIGN KEY (id_paciente) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_contato) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,

    UNIQUE KEY uk_paciente_contato (id_paciente, id_contato),

    INDEX idx_contato_paciente (id_paciente),
    INDEX idx_contato_contato (id_contato)
);

CREATE TABLE EVENTO_PANICO (
    id_panico INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,              
    latitude DECIMAL(10, 8) NOT NULL,      
    longitude DECIMAL(11, 8) NOT NULL,    
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, 

    FOREIGN KEY (usuario_id) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,

    INDEX idx_panico_usuario_timestamp (usuario_id, timestamp)
);