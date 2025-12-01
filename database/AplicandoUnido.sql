/*MODULO DE RECLUTAMIENTO*/
DROP TABLE IF EXISTS Evaluacion_Desempeño;
DROP TABLE IF EXISTS Experto_Externo;
DROP TABLE IF EXISTS Jefe_de_Proyectos;
DROP TABLE IF EXISTS Experto_Interno ;
DROP TABLE IF EXISTS Personal;
DROP TABLE IF EXISTS Contrato;
DROP TABLE IF EXISTS Medio;
DROP TABLE IF EXISTS Anuncio;
/*DROP TABLE IF EXISTS Tipo_evaluacion;*/
DROP TABLE IF EXISTS Evaluacion;
DROP TABLE IF EXISTS Postulacion;
DROP TABLE IF EXISTS Candidato;
DROP TABLE IF EXISTS Requerimiento;

/*================================================*/
/*MODULO DE GESTION DE PROYECTOS*/
DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS proyecto CASCADE;
DROP TABLE IF EXISTS responsable CASCADE;
DROP TABLE IF EXISTS tarea CASCADE;
DROP TABLE IF EXISTS documentacion CASCADE ;


/*Creacion de Tablas*/

CREATE TABLE Requerimiento(
	Cod_Requerimiento varchar(10) not null,
	tipo_personal varchar(50) not null,
	modalidad_trabajo varchar(30) not null,
	experiencia_rerquerida  numeric(2) default 3,
	puesto varchar(10) not null,
	fecha_solicitud timestamp default current_timestamp,
	primary key(Cod_Requerimiento)
);

CREATE TABLE Candidato(
		ID_Candidato varchar (10),
		nombres varchar(50) not null,
		correo varchar (50) not null,
		telefono numeric(9) not null,
		años_experiencia numeric(2),
		comentario_experiencia varchar(100),
		primary key(Id_Candidato)
);


CREATE TABLE Postulacion(
	Cod_Postulacion varchar(10),
	primary key (Cod_Postulacion),
	Cod_Requerimiento varchar(10),
	ID_Candidato varchar(10),
	FOREIGN KEY(Cod_Requerimiento) REFERENCES Requerimiento (Cod_Requerimiento),
	FOREIGN KEY (ID_Candidato) REFERENCES Candidato (ID_Candidato)
);

CREATE TABLE Evaluacion(
		ID_Evaluacion varchar(10),
		Hard_skills numeric(1) check( Hard_skills between 1 and 5) default 3  ,
		Soft_skills numeric(1) check(Soft_skills between 1 and 5) default 3 ,
		Experiencia numeric(1) check(Experiencia between 1 and 5) default 3 ,
		Etica_integridad numeric(1) check (Etica_integridad between 1 and 5) default 3  ,
		Evaluacion_economica numeric(1) check (Evaluacion_economica between 1 and 5) default 3 ,
		Observaciones text,
		Cod_Postulacion varchar(10),
		primary key(ID_Evaluacion),
		FOREIGN KEY(Cod_Postulacion ) REFERENCES Postulacion (Cod_Postulacion)
);


/*CREATE TABLE Tipo_evaluacion(
		tipo_evaluacion varchar(10),
		ID_Evaluacion character (10),
		
		primary key(ID_Evaluacion),
		FOREIGN KEY(ID_Evaluacion) REFERENCES Evaluacion(ID_Evaluacion)
);*/

CREATE TABLE Anuncio(
	id_anuncio varchar(10),
	fecha_anuncio timestamp default current_timestamp,
	Mensaje text not null,
	Cod_Postulacion varchar(10),
	primary key(id_anuncio),
	FOREIGN KEY(Cod_Postulacion) REFERENCES Postulacion(Cod_Postulacion)
);

CREATE TABLE Medio(
	id_anuncio varchar(10),
	medios varchar(10) default 'correo electronico',
	primary key(id_anuncio),
	FOREIGN KEY(id_anuncio) REFERENCES Anuncio(id_anuncio)
);


CREATE TABLE Contrato(
		Cod_Contrato char(10) not null UNIQUE,
		nombre_tipo_contrato varchar(50) not null default 'Consultoría Externa',
		rol varchar(50) not null ,
		Proyecto_asociado varchar(50) not null,
		Modalidad_pago varchar(50) not null,
		fecha_inicio date,
		fecha_fin date,
		salario numeric(6,2) not null default 5000,
		Moneda varchar(5) not null default 'PEN',
		Condiciones text,
		Cod_Postulacion varchar(10),
		primary key(Cod_Contrato),
		FOREIGN KEY(Cod_Postulacion) REFERENCES Postulacion(Cod_Postulacion)
);


Create Table Personal(
		id_personal varchar(10) NOT NULL,
		nombre varchar(50) NOT NULL,
		apellido varchar(50) NOT NULL,
		email varchar(30),
		dni numeric(8) NOT NULL UNIQUE,
		telefono numeric(9),
		especialidad varchar(30),
		ubicacion varchar(100),
		Cod_Contrato char(10),
		primary key (id_personal),
		FOREIGN KEY(Cod_Contrato) REFERENCES Contrato(Cod_Contrato)
);


Create table Experto_Interno(
	id_personal varchar(10) NOT NULL,
	sede varchar(20),
	Area_asignada varchar (30),
	primary key (id_personal),
	FOREIGN KEY(id_personal) REFERENCES Personal(id_personal)
);
Create table Experto_Externo(
	id_personal varchar(10) UNIQUE,
	id_personal_externo varchar(10),
	empresa_contratista varchar(10),
	duracion_servicio numeric(10),
	primary key (id_personal_externo),
	FOREIGN KEY(id_personal) REFERENCES Personal(id_personal)
);
Create table Jefe_de_Proyectos(
	Id_Jefe_de_Proyectos varchar(10),
	numero_de_Proyectos_a_cargo numeric(2),
	id_personal varchar(10) UNIQUE,
	primary key (Id_Jefe_de_Proyectos),
	FOREIGN KEY(id_personal) REFERENCES Personal(id_personal)
);

Create table Evaluacion_Desempeño(
	Cod_Evaluacion_Desempeño varchar(10),
	Calidad_entregable int CHECK(Calidad_entregable between 1 and 5) default 3  ,
	Cumplimiento_plazos int CHECK(Cumplimiento_plazos between 1 and 5) default 3  ,
	Conocimiento_tecnico int CHECK(Conocimiento_tecnico between 1 and 5) default 3  ,
	Trabajo_equipo int CHECK(Trabajo_equipo between 1 and 5) default 3 ,
	Compromiso int CHECK(Compromiso between 1 and 5) default 3 ,
	Observaciones text,
	id_personal_externo varchar(10),
	Id_Jefe_de_Proyectos varchar(10),
	primary key(Cod_Evaluacion_Desempeño),
	FOREIGN KEY(id_personal_externo) REFERENCES Experto_Externo(id_personal_externo),
	FOREIGN KEY(Id_Jefe_de_Proyectos) REFERENCES Jefe_de_Proyectos(Id_Jefe_de_Proyectos)

);
/*============================================*/
/*CREACION DE TABLAS DE GESTION DE PROYECTOS*/


CREATE TABLE Cliente(
  id_cliente varchar(5) not null,
  nombre_cliente varchar(30) not null,
  tipo_cliente varchar(30),
  contacto_cliente varchar(30),
  correo_cliente varchar(30),
  telefono_cliente varchar(10),
  direccion_cliente varchar(25),
  primary key(id_cliente)
);

CREATE TABLE Proyecto(
  id_proyecto varchar(9) not null,
  id_cliente varchar(9) not null,
  nombre_proyecto varchar(150) not null,
  fecha_inicio date not null,
  fecha_fin date,
  descripcion varchar(100),
  estado_proyecto varchar(30),
  prioridad_proyecto varchar(20),
  primary key(id_proyecto),
  foreign key(id_cliente) references Cliente(id_cliente)
);

CREATE TABLE Responsable(
  id_responsable   varchar(9)  not null,
  id_proyecto      varchar(10) not null,
  cod_requerimiento varchar(10),
  nombre_responsable varchar(150) not null,
  rol_responsable  varchar(50),
  correo           varchar(150),
  telefono         varchar(40),
  disponibilidad   varchar(50),
  primary key(id_responsable),
  foreign key(id_proyecto) references Proyecto(id_proyecto)
);

CREATE TABLE Tarea(
  id_tarea varchar(9) not null,
  id_proyecto varchar(9) not null,
  id_responsable varchar(9) not null,
  fecha_inicio_tarea date not null,
  fecha_entrega_estimada date,
  fecha_entrega_real date,
  descripcion_tarea varchar(100),
  estado_tarea varchar(30),
  nombre_tarea varchar(150) not null,
  primary key(id_tarea),
  foreign key(id_proyecto) references Proyecto(id_proyecto),
  foreign key(id_responsable) references Responsable(id_responsable)
);

CREATE OR REPLACE FUNCTION trg_set_estado_tarea()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.fecha_entrega_real IS NOT NULL THEN
    IF NEW.fecha_entrega_estimada IS NOT NULL AND NEW.fecha_entrega_real <= NEW.fecha_entrega_estimada THEN
      NEW.estado_tarea := 'dentro del plazo';
    ELSE
      NEW.estado_tarea := 'fuera de plazo';
    END IF;
  ELSE
    IF NEW.fecha_entrega_estimada IS NULL THEN
      NEW.estado_tarea := COALESCE(NEW.estado_tarea, 'sin estimado');
    ELSIF NEW.fecha_entrega_estimada >= CURRENT_DATE THEN
      NEW.estado_tarea := 'en curso';
    ELSE
      NEW.estado_tarea := 'fuera de plazo';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_tarea_estado
BEFORE INSERT OR UPDATE ON Tarea
FOR EACH ROW EXECUTE FUNCTION trg_set_estado_tarea();


CREATE TABLE Documentacion(
  id_documento varchar(9) not null,
  id_proyecto varchar(9) not null,
  tipo_documento varchar(40),
  nombre_documento varchar(200),
  fecha_subida date,
  archivo varchar(255),
  primary key(id_documento),
  foreign key(id_proyecto) references Proyecto(id_proyecto)
);
/*===================================================================*/
/*DATOS DE GESTION DE RECLUTAMIENTO*/
-- 1. REQUERIMIENTOS
INSERT INTO Requerimiento (Cod_Requerimiento, tipo_personal, modalidad_trabajo, experiencia_rerquerida, puesto)
VALUES
('REQ001', 'Consultor en Sistemas de Gestión', 'Remoto', 3, 'Consultor'),
('REQ002', 'Ingeniero de Procesos', 'Híbrido', 4, 'Supervisor'),
('REQ003', 'Especialista en Transformación Digital', 'Remoto', 2, 'Analista'),
('REQ004', 'Asistente Administrativo', 'Presencial', 1, 'Asistente'),
('REQ005', 'Consultor en Seguridad y Salud Ocupacional', 'Remoto', 3, 'Consultor'),
('REQ006', 'Ingeniero Ambiental', 'Híbrido', 4, 'Supervisor'),
('REQ007', 'Especialista en Gestión de la Calidad', 'Remoto', 2, 'Analista'),
('REQ008', 'Asistente de Soporte Documental', 'Presencial', 1, 'Asistente'),
('REQ009', 'Coordinador de Logística', 'Presencial', 3, 'Supervisor'),
('REQ010', 'Especialista en Seguridad Informática', 'Remoto', 5, 'Analista'),
('REQ011', 'Asistente de Recursos Humanos', 'Híbrido', 2, 'Asistente'),
('REQ012', 'Ingeniero de Proyectos', 'Presencial', 4, 'Supervisor'),
('REQ013', 'Analista de Datos', 'Remoto', 3, 'Analista'),
('REQ014', 'Consultor en Medio Ambiente', 'Híbrido', 4, 'Consultor'),
('REQ015', 'Especialista en Compras', 'Presencial', 3, 'Analista');


-- 2. CANDIDATOS
INSERT INTO Candidato (ID_Candidato, nombres, correo, telefono, años_experiencia, comentario_experiencia)
VALUES
('CAND01', 'Luis Alberto Gonzales', 'luis.gonzales@gmail.com', 999123456, 5, 'Consultor en ISO 9001, experiencia en empresas públicas y privadas'),
('CAND02', 'María Fernanda Soto', 'maria.soto@outlook.com', 988654321, 7, 'Ingeniera de procesos con experiencia en plantas industriales'),
('CAND03', 'Andrés Felipe Chávez', 'andres.chavez@gmail.com', 977777777, 2, 'Especialista en digitalización de procesos y QMS'),
('CAND04', 'Rosa Elena Huamán', 'rosa.huaman@hotmail.com', 955444222, 1, 'Practicante en gestión administrativa en empresa privada'),
('CAND05', 'Carlos Eduardo Mejía', 'carlos.mejia@gmail.com', 966333111, 4, 'Auditor interno ISO 45001, ex Visiona SAC'),
('CAND06', 'Jorge Luis Rivas', 'jorge.rivas@visionasac.com.pe', 987654123, 5, 'Consultor en SST, con certificación ISO 45001 y experiencia minera'),
('CAND07', 'Gabriela Morales', 'gabriela.morales@calidar.pe', 944112233, 6, 'Ingeniera ambiental con experiencia en monitoreo y auditorías externas'),
('CAND08', 'Pedro Ramírez Paredes', 'pedro.ramirez@gmail.com', 951778899, 3, 'Especialista en sistemas de gestión ISO 9001 y mejora continua'),
('CAND09', 'Lucía Quispe Huertas', 'lucia.quispe@hotmail.com', 955887766, 1, 'Egresada de administración, apoyo en control documental'),
('CAND10', 'César Aguilar Cárdenas', 'cesar.aguilar@visiona.com', 977665544, 4, 'Auditor interno en gestión ambiental y seguridad industrial'),
('CAND11', 'Natalia Herrera Campos', 'natalia.herrera@gmail.com', 955112233, 4, 'Experta en gestión logística y control de inventarios'),
('CAND12', 'Ricardo Salazar Pino', 'ricardo.salazar@visiona.com', 987223344, 6, 'Ingeniero en seguridad informática con experiencia en auditorías ISO 27001'),
('CAND13', 'Fernanda Rojas Díaz', 'fernanda.rojas@gmail.com', 966889900, 2, 'Asistente de RRHH con conocimiento en reclutamiento y planillas'),
('CAND14', 'David Chumpitaz Lazo', 'david.chumpitaz@visiona.com', 922334455, 5, 'Ingeniero civil especializado en gestión de proyectos industriales'),
('CAND15', 'Elena Vargas Tapia', 'elena.vargas@gmail.com', 911223344, 3, 'Analista de datos con dominio en Power BI y SQL'),
('CAND16', 'Juan Manuel Paredes', 'juan.paredes@visiona.com', 955667788, 4, 'Consultor ambiental con experiencia en EIA y auditorías ISO 14001'),
('CAND17', 'Carla León Ramírez', 'carla.leon@gmail.com', 966778899, 3, 'Analista de compras en el sector público y privado'),
('CAND18', 'Miguel Torres Zúñiga', 'miguel.torres@gmail.com', 944667788, 1, 'Egresado de ingeniería industrial en búsqueda de primera experiencia'),
('CAND19', 'Silvia Huamán Pérez', 'silvia.huaman@visiona.com', 933445566, 2, 'Asistente administrativa con manejo documental'),
('CAND20', 'Héctor Gutiérrez Alarcón', 'hector.gutierrez@gmail.com', 955998877, 5, 'Especialista en logística con experiencia en distribución nacional');


-- 3. POSTULACIONES
INSERT INTO Postulacion (Cod_Postulacion, Cod_Requerimiento, ID_Candidato)
VALUES
('POST01', 'REQ001', 'CAND01'),
('POST02', 'REQ002', 'CAND02'),
('POST03', 'REQ003', 'CAND03'),
('POST04', 'REQ004', 'CAND04'),
('POST05', 'REQ001', 'CAND05'),
('POST06', 'REQ005', 'CAND06'),
('POST07', 'REQ006', 'CAND07'),
('POST08', 'REQ007', 'CAND08'),
('POST09', 'REQ008', 'CAND09'),
('POST10', 'REQ005', 'CAND10'),
('POST11', 'REQ009', 'CAND11'),
('POST12', 'REQ010', 'CAND12'),
('POST13', 'REQ011', 'CAND13'),
('POST14', 'REQ012', 'CAND14'),
('POST15', 'REQ013', 'CAND15'),
('POST16', 'REQ014', 'CAND16'),
('POST17', 'REQ015', 'CAND17'),
('POST18', 'REQ009', 'CAND18'),
('POST19', 'REQ011', 'CAND19'),
('POST20', 'REQ015', 'CAND20');



-- 4. EVALUACIONES (POSTULACIONES)
INSERT INTO Evaluacion (ID_Evaluacion, Hard_skills, Soft_skills, Experiencia, Etica_integridad, Evaluacion_economica, Observaciones, Cod_Postulacion)
VALUES
('EVAL01', 5, 4, 5, 5, 4, 'Excelente perfil técnico y comunicativo', 'POST01'),
('EVAL02', 4, 4, 5, 5, 4, 'Muy buena experiencia en procesos', 'POST02'),
('EVAL03', 3, 4, 2, 4, 3, 'Perfil junior con potencial', 'POST03'),
('EVAL04', 2, 3, 1, 5, 3, 'Nivel asistente, requiere capacitación', 'POST04'),
('EVAL05', 4, 5, 4, 5, 4, 'Auditor experimentado, fuerte en liderazgo', 'POST05'),
('EVAL06', 5, 4, 5, 5, 4, 'Excelente dominio en gestión de seguridad y liderazgo de equipos', 'POST06'),
('EVAL07', 4, 4, 5, 5, 5, 'Alta competencia técnica y comunicación efectiva', 'POST07'),
('EVAL08', 4, 5, 3, 5, 4, 'Buen conocimiento técnico, destaca en trabajo en equipo', 'POST08'),
('EVAL09', 3, 4, 2, 5, 3, 'Perfil junior, potencial para desarrollo interno', 'POST09'),
('EVAL10', 5, 5, 4, 5, 5, 'Excelente auditor, con experiencia sólida en proyectos ambientales', 'POST10'),
('EVAL11', 5, 4, 5, 5, 4, 'Gran dominio en gestión logística y liderazgo', 'POST11'),
('EVAL12', 4, 5, 5, 5, 4, 'Excelente conocimiento en ciberseguridad', 'POST12'),
('EVAL13', NULL, NULL, NULL, NULL, NULL, 'Pendiente de evaluación', 'POST13'),  -- sin evaluar
('EVAL14', NULL, NULL, NULL, NULL, NULL, 'Buen perfil técnico, alto compromiso', 'POST14'),
('EVAL15', NULL, NULL, NULL, NULL, NULL, 'Analista con gran potencial técnico', 'POST15'),
('EVAL16', NULL, NULL, NULL, NULL, NULL, 'Consultor con buen manejo ambiental', 'POST16'),
('EVAL17', NULL, NULL, NULL, NULL, NULL, 'Pendiente de evaluación', 'POST17'),  -- sin evaluar
('EVAL18', NULL, NULL, NULL, NULL, NULL, 'Pendiente de evaluación', 'POST18'),  -- sin evaluar
('EVAL19', NULL, NULL, NULL, NULL, NULL, 'Asistente con habilidades básicas', 'POST19'),
('EVAL20', NULL, NULL, NULL, NULL, NULL, 'Experto en logística, perfil ideal para contratación', 'POST20');


-- 5. ANUNCIOS Y MEDIOS

INSERT INTO Anuncio (id_anuncio, Mensaje, Cod_Postulacion)
VALUES
('ANU01', 'Su postulación ha sido recibida con éxito', 'POST01'),
('ANU02', 'Su postulación ha sido recibida con éxito', 'POST02'),
('ANU03', 'Su postulación ha sido recibida con éxito', 'POST03'),
('ANU04', 'Su postulación ha sido recibida con éxito', 'POST04'),
('ANU05', 'Su postulación ha sido registrada correctamente', 'POST06'),
('ANU06', 'Su postulación ha sido recibida con éxito', 'POST07'),
('ANU07', 'Su postulación ha sido enviada correctamente', 'POST08'),
('ANU08', 'Su postulación ha sido procesada', 'POST09'),
('ANU09', 'Su postulación ha sido recibida con éxito', 'POST10'),
('ANU10', 'Su postulación ha sido recibida con éxito', 'POST11'),
('ANU11', 'Su postulación ha sido recibida con éxito', 'POST12'),
('ANU12', 'Su postulación ha sido recibida con éxito', 'POST13'),
('ANU13', 'Su postulación ha sido recibida con éxito', 'POST14'),
('ANU14', 'Su postulación ha sido recibida con éxito', 'POST15'),
('ANU15', 'Su postulación ha sido recibida con éxito', 'POST16'),
('ANU16', 'Su postulación ha sido recibida con éxito', 'POST17'),
('ANU17', 'Su postulación ha sido recibida con éxito', 'POST18'),
('ANU18', 'Su postulación ha sido recibida con éxito', 'POST19'),
('ANU19', 'Su postulación ha sido recibida con éxito', 'POST20');


INSERT INTO Medio (id_anuncio, medios)
VALUES
('ANU01', 'Correo'),
('ANU02', 'Correo'),
('ANU03', 'LinkedIn'),
('ANU04', 'Correo'),
('ANU05', 'Correo'),
('ANU06', 'LinkedIn'),
('ANU07', 'Correo'),
('ANU08', 'LinkedIn'),
('ANU09', 'Correo'),
('ANU10', 'Correo'),
('ANU11', 'LinkedIn'),
('ANU12', 'Correo'),
('ANU13', 'Correo'),
('ANU14', 'LinkedIn'),
('ANU15', 'Correo'),
('ANU16', 'Correo'),
('ANU17', 'Correo'),
('ANU18', 'LinkedIn'),
('ANU19', 'Correo');

-- 6. CONTRATOS (CANDIDATOS SELECCIONADOS)

INSERT INTO Contrato (Cod_Contrato, nombre_tipo_contrato, rol, Proyecto_asociado, Modalidad_pago, fecha_inicio, fecha_fin, salario, Moneda, Cod_Postulacion)
VALUES
('CONT01', 'Consultoría Externa', 'Consultor ISO', 'Implementación SIG Empresa Pública Lima', 'Mensual', '2025-02-01', '2025-08-01', 8500.00, 'PEN', 'POST01'),
('CONT02', 'Consultoría Externa', 'Supervisor de Procesos', 'Optimización Planta Industrial Arequipa', 'Mensual', '2025-03-01', '2025-12-30', 9500.00, 'PEN', 'POST02'),
('CONT03', 'Consultoría Interna', 'Especialista Digital', 'Digitalización Documental Cusco', 'Mensual', '2025-04-15', '2025-10-15', 7000.00, 'PEN', 'POST03'),
('CONT04', 'Consultoría Externa', 'Auditor Líder', 'Auditoría ISO 45001 en Piura', 'Mensual', '2025-05-01', '2025-11-01', 8800.00, 'PEN', 'POST05'),
('CONT05', 'Consultoría Externa', 'Consultor SST', 'Implementación ISO 45001 en Antamina', 'Mensual', '2025-06-01', '2025-12-01', 8700.00, 'PEN', 'POST06'),
('CONT06', 'Consultoría Externa', 'Supervisor Ambiental', 'Gestión Ambiental Planta de Tratamiento Arequipa', 'Mensual', '2025-07-01', '2025-12-30', 9200.00, 'PEN', 'POST07'),
('CONT07', 'Consultoría Interna', 'Especialista de Calidad', 'Reingeniería de Procesos Visiona Lima', 'Mensual', '2025-08-01', '2026-02-01', 7500.00, 'PEN', 'POST08'),
('CONT08', 'Consultoría Interna', 'Asistente Documental', 'Control de Documentos Calidar Lima', 'Mensual', '2025-09-01', '2026-03-01', 4200.00, 'PEN', 'POST09'),
('CONT09', 'Consultoría Externa', 'Auditor Ambiental', 'Auditoría Integral en Proyecto Antapaccay', 'Mensual', '2025-07-15', '2026-01-15', 9000.00, 'PEN', 'POST10');

-- 7. PERSONAL

INSERT INTO Personal (id_personal, nombre, apellido, email, dni, telefono, especialidad, ubicacion, Cod_Contrato)
VALUES
('PER001', 'Luis Alberto', 'Gonzales', 'luis.gonzales@visiona.com', 12345678, 999123456, 'Sistemas de Gestión', 'Lima', 'CONT01'),
('PER002', 'María Fernanda', 'Soto', 'maria.soto@calidar.pe', 87654321, 988654321, 'Procesos Industriales', 'Arequipa', 'CONT02'),
('PER003', 'Andrés Felipe', 'Chávez', 'andres.chavez@visiona.com', 45678912, 977777777, 'Transformación Digital', 'Cusco', 'CONT03'),
('PER004', 'Carlos Eduardo', 'Mejía', 'carlos.mejia@visiona.com', 78945612, 966333111, 'Auditoría ISO', 'Piura', 'CONT04'),
('PER005', 'Jorge Luis', 'Rivas', 'jorge.rivas@visiona.com.pe', 33445566, 987654123, 'Seguridad y Salud Ocupacional', 'Lima', 'CONT05'),
('PER006', 'Gabriela', 'Morales', 'gabriela.morales@calidar.pe', 77889912, 944112233, 'Ingeniería Ambiental', 'Arequipa', 'CONT06'),
('PER007', 'Pedro', 'Ramírez', 'pedro.ramirez@visiona.com', 99887766, 951778899, 'Gestión de Calidad', 'Lima', 'CONT07'),
('PER008', 'Lucía', 'Quispe', 'lucia.quispe@calidar.pe', 44556677, 955887766, 'Administración Documental', 'Lima', 'CONT08'),
('PER009', 'César', 'Aguilar', 'cesar.aguilar@visiona.com', 66778899, 977665544, 'Auditoría Ambiental', 'Cusco', 'CONT09');

-- 8. EXPERTOS INTERNOS / EXTERNOS / JEFES

INSERT INTO Experto_Interno (id_personal, sede, Area_asignada)
VALUES
('PER001', 'Lima', 'Sistemas de Gestión'),
('PER003', 'Cusco', 'Transformación Digital'),
('PER007', 'Lima', 'Gestión de Calidad'),
('PER008', 'Lima', 'Documentación');

INSERT INTO Experto_Externo (id_personal, id_personal_externo, empresa_contratista, duracion_servicio)
VALUES
('PER002', 'EXT001', 'Calidar', 10),
('PER004', 'EXT002', 'Visiona', 6),
('PER006', 'EXT004', 'Calidar', 12),
('PER009', 'EXT005', 'Visiona', 9);

INSERT INTO Jefe_de_Proyectos (Id_Jefe_de_Proyectos, numero_de_Proyectos_a_cargo, id_personal)
VALUES
('JEF001', 4, 'PER001'),  -- Luis Gonzales como jefe
('JEF002', 3, 'PER005');  -- Jorge Rivas como jefe

-- 9. EVALUACIÓN DE DESEMPEÑO

INSERT INTO Evaluacion_Desempeño (Cod_Evaluacion_Desempeño, Calidad_entregable, Cumplimiento_plazos, Conocimiento_tecnico, Trabajo_equipo, Compromiso, Observaciones, id_personal_externo, Id_Jefe_de_Proyectos)
VALUES
('EVD01', 5, 5, 5, 4, 5, 'Excelente desempeño supervisando obra industrial', 'EXT001', 'JEF001'),
('EVD02', 4, 4, 4, 4, 4, 'Buen nivel técnico y compromiso en auditoría', 'EXT002', 'JEF001'),
('EVD03', 5, 5, 5, 4, 5, 'Excelente desempeño liderando proyecto ISO 45001', 'EXT004', 'JEF001'),
('EVD04', 4, 4, 5, 5, 4, 'Gran compromiso con cumplimiento de plazos y normativa ambiental', 'EXT005', 'JEF001');



/*INGRESO DE DATOS DE GESTION DE PROYECTOS*/
INSERT INTO Cliente (id_cliente, nombre_cliente, tipo_cliente, contacto_cliente, correo_cliente, telefono_cliente, direccion_cliente)
VALUES
('C0001', 'Muebles Artesanales S.A.', 'Corporativo', 'María López', 'contacto@mueblesart.com', '9876543210', 'Av. Principal 123'),
('C0002', 'Taller Carpintero', 'Pyme', 'José Pérez', 'info@tallercarp.com', '987650001', 'Jr. Los Álamos 45'),
('C0003', 'Construcciones Andina', 'Corporativo', 'Carlos Ruiz', 'proyectos@andina.com', '978112233', 'Calle Falsa 742'),
('C0004', 'Oficina Consultora SRL', 'Consultoría', 'Ana Torres', 'ana.torres@consultora.com', '962334455', 'Av. Central 210'),
('C0005', 'Distribuciones Norte', 'Comercial', 'Luis Gómez', 'ventas@distnorte.com', '977445566', 'Pza. Comercio 5'),
('C0006', 'Restaurante El Buen Sabor', 'Comercial', 'Karen Díaz', 'contacto@elbuen.com', '981223344', 'Jr. Gastronomía 12'),
('C0007', 'Cooperativa Unidas', 'Organización', 'Pedro Saldaña', 'contacto@unidascoop.org', '999887766', 'Av. Cooperativa 80'),
('C0008', 'StartUp TechLab', 'Tecnología', 'Lucía Vega', 'hola@techlab.pe', '990112233', 'Parque Innovación 3'),
('C0009', 'Editorial NorteSur', 'Editorial', 'Marta Ríos', 'mrios@editorialns.com', '994556677', 'Calle Letras 18'),
('C0010', 'Servicios Integrales SAC', 'Servicios', 'Raúl Medina', 'servicios@integrales.com', '995667788', 'Av. Servicios 400');

INSERT INTO Proyecto (id_proyecto, id_cliente, nombre_proyecto, fecha_inicio, fecha_fin, descripcion, estado_proyecto, prioridad_proyecto)
VALUES
('P0001', 'C0001', 'Rediseño catálogo muebles 2025', '2025-01-10', '2025-04-30', 'Actualización de catálogo y sesion fotográfica', 'en curso', 'alta'),
('P0002', 'C0002', 'Automatización taller CNC', '2025-02-01', '2025-05-15', 'Instalación y puesta en marcha de control CNC', 'pendiente', 'media'),
('P0003', 'C0003', 'Supervisión obra - Av. Libertad', '2024-11-15', '2025-03-20', 'Supervisión y control de calidad en obra', 'cerrado', 'alta'),
('P0004', 'C0004', 'Implementación ISO 9001', '2025-03-01', NULL, 'Consultoría para sistema de gestión de calidad', 'pendiente', 'alta'),
('P0005', 'C0005', 'Optimización cadena logística', '2025-01-20', '2025-06-30', 'Rediseño de rutas y almacenes', 'en curso', 'media'),
('P0006', 'C0006', 'Digitalización menú y pedidos', '2025-04-01', NULL, 'App y sistema de pedidos online', 'pendiente', 'media'),
('P0007', 'C0007', 'Programa capacitación cooperativa', '2025-02-10', '2025-02-28', 'Capacitaciones en gestión y contabilidad', 'cerrado', 'baja'),
('P0008', 'C0008', 'MVP plataforma SaaS logística', '2025-03-15', '2025-08-31', 'Desarrollo de MVP y pruebas con clientes pilotos', 'en curso', 'alta'),
('P0009', 'C0009', 'Transformación digital editorial', '2024-12-01', '2025-05-15', 'Workflow editorial y migración a CMS', 'en curso', 'media'),
('P0010', 'C0010', 'Infraestructura TI integral', '2025-01-05', '2025-04-01', 'Suministro e implementación de servidores y redes', 'cerrado', 'alta');

INSERT INTO Responsable (id_responsable, id_proyecto, cod_requerimiento, nombre_responsable, rol_responsable, correo, telefono, disponibilidad)
VALUES
('R0001', 'P0001', 'REQ001', 'María López', 'Líder de Proyecto', 'm.lopez@mueblesart.com', '987654321', 'Tiempo completo'),
('R0002', 'P0002', 'REQ002', 'José Pérez', 'Supervisor Técnico', 'j.perez@tallercarp.com', '987650001', 'Medio tiempo'),
('R0003', 'P0003', 'REQ012', 'Carlos Ruiz', 'Coordinador de Obra', 'c.ruiz@andina.com', '978112233', 'Tiempo completo'),
('R0004', 'P0004', 'REQ007', 'Ana Torres', 'Consultora ISO', 'ana.torres@consultora.com', '962334455', 'Tiempo parcial'),
('R0005', 'P0005', 'REQ009', 'Luis Gómez', 'Coordinador Logístico', 'l.gomez@distnorte.com', '977445566', 'Tiempo completo'),
('R0006', 'P0006', 'REQ006', 'Karen Díaz', 'Gestora de Producto', 'k.diaz@elbuen.com', '981223344', 'Remoto parcial'),
('R0007', 'P0007', 'REQ011', 'Pedro Saldaña', 'Instructor', 'p.saldana@unidascoop.org', '999887766', 'Por proyecto'),
('R0008', 'P0008', 'REQ013', 'Lucía Vega', 'Product Owner', 'lucia@techlab.pe', '990112233', 'Tiempo completo'),
('R0009', 'P0009', 'REQ003', 'Marta Ríos', 'Editor Responsable', 'mrios@editorialns.com', '994556677', 'Medio tiempo'),
('R0010', 'P0010', 'REQ014', 'Raúl Medina', 'Jefe de Infraestructura', 'r.medina@integrales.com', '995667788', 'Tiempo completo');

INSERT INTO documentacion (id_documento, id_proyecto, tipo_documento, nombre_documento, fecha_subida, archivo) VALUES
('D0001', 'P0001', 'Especificación', 'Especificaciones catálogo 2025.pdf', '2025-01-11', NULL),
('D0002', 'P0002', 'Manual', 'Manual CNC instalación.pdf', '2025-02-10', NULL),
('D0003', 'P0008', 'Requerimiento funcional', 'RF MVP v1.docx', '2025-03-20', NULL),
('D0004', 'P0004', 'PDF', 'Documento1', '2025-11-21', NULL),
('D0005', 'P0003', 'PDF', 'CAPACITACION', '2025-11-21', NULL);


INSERT INTO Tarea (id_tarea,id_proyecto,id_responsable,fecha_inicio_tarea,fecha_entrega_estimada,fecha_entrega_real,descripcion_tarea,estado_tarea,nombre_tarea)
VALUES
('T0001', 'P0001', 'R0001', '2025-01-12', '2025-01-25', '2025-01-24', 'Revisión de diseños y selección de materiales', 'dentro del plazo', 'Revisión diseños'),
('T0002', 'P0001', 'R0001', '2025-02-01', '2025-02-20', NULL,                      'Sesión fotográfica catálogo',                   'en curso',           'Sesión fotográfica catálogo'),
('T0003', 'P0002', 'R0002', '2025-02-05', '2025-03-10', '2025-03-18', 'Instalación del controlador CNC y pruebas',      'fuera de plazo',     'Instalación CNC'),
('T0004', 'P0003', 'R0003', '2024-11-16', '2025-01-15', '2025-01-10', 'Informe de control de calidad fase 1',         'dentro del plazo',   'Informe QC Fase 1'),
('T0005', 'P0004', 'R0004', '2025-03-02', '2025-04-15', NULL,                      'Diagnóstico inicial ISO 9001',                  'en curso',           'Diagnóstico inicial ISO 9001'),
('T0006', 'P0005', 'R0005', '2025-01-25', '2025-02-28', '2025-03-05', 'Rediseño de rutas prioritarias',                'fuera de plazo',     'Rediseño rutas'),
('T0007', 'P0006', 'R0006', '2025-04-05', '2025-05-30', NULL,                      'Desarrollo módulo de pedidos',                  'en curso',           'Desarrollo módulo de pedidos'),
('T0008', 'P0007', 'R0007', '2025-02-11', '2025-02-28', '2025-02-28', 'Ciclo de capacitaciones completas',             'dentro del plazo',   'Capacitación cooperativa'),
('T0009', 'P0008', 'R0008', '2025-03-16', '2025-06-15', NULL,                      'Desarrollo de backend del MVP',                 'en curso',           'Desarrollo MVP - backend'),
('T0010', 'P0009', 'R0009', '2024-12-05', '2025-03-01', '2025-03-10', 'Migración de contenido y pruebas CMS',          'fuera de plazo',     'Migración CMS'),
('T0011', 'P0010', 'R0010', '2025-01-06', '2025-02-20', '2025-02-18', 'Instalación de servidores y configuración de red','dentro del plazo',  'Infraestructura TI'),
('T0012', 'P0002', 'R0002', '2025-03-20', '2025-04-10', NULL,                      'Capacitación operativa CNC',                    'en curso',           'Capacitación operativa CNC');