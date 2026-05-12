CREATE DATABASE IF NOT EXISTS safehome_db;
USE safehome_db;

CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    is_paciente BOOLEAN DEFAULT TRUE,
    is_contato_emergencia BOOLEAN DEFAULT FALSE,
    fcm_token VARCHAR(255) NULL DEFAULT NULL,
    settings_json JSON NULL,
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
    nivel_permissao ENUM('TOTAL', 'MODERADO', 'SOMENTE_EMERGENCIA') DEFAULT 'TOTAL',
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
    origem ENUM('MANUAL', 'SENSOR_GAS', 'QUEDA_WATCH', 'BPM_ALTO') DEFAULT 'MANUAL',
    FOREIGN KEY (usuario_id) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    INDEX idx_panico_usuario_timestamp (usuario_id, timestamp)
);

CREATE TABLE NOTA_MENSAL (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,           
    id_autor INT NOT NULL,               
    mes_referencia VARCHAR(7) NOT NULL,   
    texto TEXT NOT NULL,                   
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_paciente) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_autor) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE,
    INDEX idx_nota_paciente_mes (id_paciente, mes_referencia)
);

CREATE TABLE DISPOSITIVO_IOT (
    id_dispositivo VARCHAR(100) PRIMARY KEY, 
    id_usuario INT NOT NULL,
    nome VARCHAR(100) NOT NULL, 
    categoria ENUM('GAS', 'LUMINOSIDADE', 'RUIDO', 'PORTA', 'MOVIMENTO', 'LUZ_RGB') NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

CREATE TABLE TELEMETRIA_IOT (
    id_telemetria BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_dispositivo VARCHAR(100) NOT NULL,
    id_usuario INT NOT NULL,
    tipo_sensor VARCHAR(50) NOT NULL,
    valor VARCHAR(50) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_dispositivo) REFERENCES DISPOSITIVO_IOT(id_dispositivo) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

CREATE TABLE TELEMETRIA_SAUDE (
    id_saude BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_dado ENUM('BPM', 'QUEDA', 'OXIGENIO', 'SONO') NOT NULL,
    valor VARCHAR(50) NOT NULL,
    is_emergencia BOOLEAN DEFAULT FALSE,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);