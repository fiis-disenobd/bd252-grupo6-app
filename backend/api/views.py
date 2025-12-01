from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import date
from .db import query_all, query_one, execute
from django.core.files.storage import default_storage

# --- REQUERIMIENTOS ---
@api_view(['GET'])
def requerimientos_list(request):
    data = query_all("SELECT * FROM Requerimiento ORDER BY Cod_Requerimiento;")
    return Response(data)

@api_view(['POST'])
def crear_requerimiento(request):
    try:
        # Obtenemos los datos del body de la solicitud
        tipo_personal = request.data.get('tipo_personal')
        modalidad_trabajo = request.data.get('modalidad_trabajo')
        experiencia_requerida = request.data.get('experiencia_requerida', 3)
        puesto = request.data.get('puesto')
        # Generar un código de requerimiento (puedes cambiar la lógica)
        codigo = f"REQ{query_all('SELECT COUNT(*) FROM Requerimiento;')[0]['count'] + 1:03d}"

        # Insertar en la tabla
        sql = """
            INSERT INTO Requerimiento (Cod_Requerimiento, tipo_personal, modalidad_trabajo, experiencia_rerquerida, puesto)
            VALUES (%s, %s, %s, %s, %s)
        """
        # Aquí 'puesto' puedes mapearlo desde tipo_personal o recibirlo en el request
        #puesto = tipo_personal.split()[0]  # ejemplo simple
        execute(sql, (codigo, tipo_personal, modalidad_trabajo, experiencia_requerida, puesto))

        return Response({"message": "Requerimiento registrado exitosamente", "Cod_Requerimiento": codigo})

    except Exception as e:
        return Response({"error": str(e)}, status=400)


# --- CANDIDATOS ---
@api_view(['GET'])
def candidatos_list(request):
    data = query_all("SELECT * FROM Candidato ORDER BY ID_Candidato;")
    return Response(data)


#---------------------------------------------------------------------------------------------------------------
# --- EVALURAR CANDIDATOS ---

# --- LISTAR CANDIDATOS Y SUS PUNTAJES ---
@api_view(['GET'])
def listar_evaluaciones(request):
    try:
        sql = """
            SELECT 
                c.nombres AS nombre_candidato,
                c.telefono,
                c.ID_Candidato,
                c.años_experiencia,
                p.Cod_Postulacion,
                COALESCE(ct.Cod_Contrato, '-') AS cod_contrato,
                COALESCE(ct.proyecto_asociado, '-') AS proyecto_asociado,
                CASE
                    WHEN e.id_Evaluacion IS NULL THEN '-' 
                    ELSE ROUND((
                        (e.Hard_skills + 
                        e.Soft_skills + 
                        e.Experiencia + 
                        e.Etica_integridad + 
                        e.Evaluacion_economica)::numeric / 5
                    ), 2)::text
                END AS puntaje_obtenido,
                COALESCE(TO_CHAR(r.fecha_solicitud, 'YYYY-MM-DD'), '-') AS fecha_evaluacion
            FROM Candidato c
            JOIN Postulacion p ON c.ID_Candidato = p.ID_Candidato
            LEFT JOIN Evaluacion e ON p.Cod_Postulacion = e.Cod_Postulacion
            LEFT JOIN Contrato ct ON p.Cod_Postulacion = ct.Cod_Postulacion
            JOIN Requerimiento r ON p.Cod_Requerimiento = r.Cod_Requerimiento
            ORDER BY r.fecha_solicitud DESC;
        """
        data = query_all(sql)
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

# --- REGISTRAR UNA NUEVA EVALUACIÓN ---
@api_view(['POST'])
def crear_evaluacion(request):
    try:
        # Capturar datos enviados desde el formulario (frontend)
        cod_postulacion = request.data.get("Cod_Postulacion") or request.data.get("cod_postulacion")
        hard = int(request.data.get("Hard_skills") or request.data.get("hard_skills"))
        soft = int(request.data.get("Soft_skills") or request.data.get("soft_skills"))
        exp = int(request.data.get("Experiencia") or request.data.get("experiencia"))
        etica = int(request.data.get("Etica_integridad") or request.data.get("etica_integridad"))
        eco = int(request.data.get("Evaluacion_economica") or request.data.get("evaluacion_economica"))
        observaciones = request.data.get("Observaciones", "") or request.data.get("observaciones") or ""

        if not all([cod_postulacion, hard, soft, exp, etica, eco]):
            return Response({"error": "Faltan datos obligatorios"}, status=400)
        
        hard, soft, exp, etica, eco = map(int, [hard, soft, exp, etica, eco])


        # Validar que los valores estén entre 1 y 5
        for v in [hard, soft, exp, etica, eco]:
            if v < 1 or v > 5:
                return Response({"error": "Los valores deben estar entre 1 y 5"}, status=400)

        # Calcular promedio
        puntaje_final = round((hard + soft + exp + etica + eco) / 5, 2)


        existe = query_all("SELECT id_evaluacion FROM evaluacion WHERE cod_postulacion = %s;", [cod_postulacion])

        # Insertar en Evaluacion
        if existe:
            # Actualizar evaluación existente
            sql = """
                UPDATE evaluacion
                SET hard_skills = %s,
                    soft_skills = %s,
                    experiencia = %s,
                    etica_integridad = %s,
                    evaluacion_economica = %s,
                    observaciones = %s
                WHERE cod_postulacion = %s;
            """
            execute(sql, (hard, soft, exp, etica, eco, observaciones, cod_postulacion))
            id_eval = existe[0]["id_evaluacion"]
            mensaje = "✅ Evaluación actualizada exitosamente"
        else:
            # Crear nueva evaluación
            ultimo = query_all("SELECT MAX(id_evaluacion) AS ultimo FROM evaluacion;")[0]['ultimo']
            if ultimo:
                num = int(ultimo.replace("EVAL", ""))
                id_eval = f"EVAL{num + 1:03d}"
            else:
                id_eval = "EVAL001"
            sql = """
                INSERT INTO evaluacion (
                    id_evaluacion, 
                    hard_skills, 
                    soft_skills, 
                    experiencia,
                    etica_integridad, 
                    evaluacion_economica, 
                    observaciones, 
                    cod_postulacion
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s);
            """
            execute(sql, (id_eval, hard, soft, exp, etica, eco, observaciones, cod_postulacion))
            mensaje = "✅ Evaluación registrada exitosamente"
            

        return Response({
            "message": mensaje,
            "ID_Evaluacion": id_eval,
            "Puntaje_Final": puntaje_final
        })

    except Exception as e:
        return Response({"error": str(e)}, status=400)


# --- ACTUALIZAR (REVALUAR) UNA EVALUACIÓN EXISTENTE ---
@api_view(['PUT'])
def revaluar_candidato(request,cod_postulacion):
    try:
        cod_postulacion = request.data.get("Cod_Postulacion") or request.data.get("cod_postulacion")
        hard = request.data.get("Hard_skills") or request.data.get("hard_skills")
        soft = request.data.get("Soft_skills") or request.data.get("soft_skills")
        exp = request.data.get("Experiencia") or request.data.get("experiencia")
        etica = request.data.get("Etica_integridad") or request.data.get("etica_integridad")
        eco = request.data.get("Evaluacion_economica") or request.data.get("evaluacion_economica")
        observaciones = request.data.get("Observaciones", "") or request.data.get("observaciones") or ""

        # Validación básica
        if not all([cod_postulacion, hard, soft, exp, etica, eco]):
            return Response({"error": "Faltan datos obligatorios"}, status=400)

        # Verificar que exista la evaluación previa
        existe = query_all("SELECT id_evaluacion FROM evaluacion WHERE cod_postulacion = %s;", [cod_postulacion])
        if not existe:
            return Response({"error": "No existe una evaluación previa para esta postulación"}, status=404)

        # Validar rango
        valores = list(map(int, [hard, soft, exp, etica, eco]))
        for v in valores:
            if v < 1 or v > 5:
                return Response({"error": "Los valores deben estar entre 1 y 5"}, status=400)

        # Calcular nuevo puntaje
        puntaje_final = round(sum(valores) / 5, 2)

        # Actualizar la evaluación
        sql = """
            UPDATE evaluacion
            SET hard_skills = %s,
                soft_skills = %s,
                experiencia = %s,
                etica_integridad = %s,
                evaluacion_economica = %s,
                observaciones = %s
            WHERE cod_postulacion = %s;
        """
        execute(sql, (*valores, observaciones, cod_postulacion))

        # Actualizar puntaje total en la postulacion
        #sql_puntaje = """
        #    UPDATE postulacion
        #   SET puntaje_total = %s
        #    WHERE cod_postulacion = %s;
        #"""
        #execute(sql_puntaje, (puntaje_final, cod_postulacion))

        return Response({
            "message": "🔄 Reevaluación actualizada correctamente",
            "Cod_Postulacion": cod_postulacion,
            "Puntaje_Final": puntaje_final
        })

    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
#-------------------------------------------------------------------------------------

# --- CONTRATOS ---
# --- 1️⃣ LISTAR EXPERTOS CONTRATADOS ---
@api_view(['GET'])
def listar_expertos_contratados(request):
    try:
        sql = """
            SELECT
                p.nombre || ' ' || p.apellido AS nombre_experto,
                CASE 
                    WHEN ei.id_personal IS NOT NULL THEN 'Interno'
                    WHEN ee.id_personal_externo IS NOT NULL THEN 'Externo'
                    ELSE 'Desconocido'
                END AS tipo,
                p.email AS correo,
                p.especialidad,
                c.Proyecto_asociado AS proyecto,
                c.nombre_tipo_contrato AS tipo_contrato,
                'Activo' AS estado,
                p.ubicacion
            FROM Personal p
            JOIN Contrato c 
                ON p.Cod_Contrato = c.Cod_Contrato
            LEFT JOIN Experto_Interno ei 
                ON p.id_personal = ei.id_personal
            LEFT JOIN Experto_Externo ee 
                ON p.id_personal = ee.id_personal
            ORDER BY tipo, nombre_experto;
        """
        data = query_all(sql)
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


# --- 2️⃣ LISTAR CANDIDATOS EVALUADOS (LISTOS PARA CONTRATAR) ---
@api_view(['GET'])
def listar_candidatos_evaluados(request):
    try:
        sql = """
            SELECT 
                r.puesto AS posicion,
                c.nombres AS candidato,
                c.correo,
                c.años_experiencia AS formacion,
                r.tipo_personal AS proyecto,
                ROUND((e.Hard_skills + e.Soft_skills + e.Experiencia + 
                       e.Etica_integridad + e.Evaluacion_economica)::numeric / 5, 2) AS puntaje_total,
                r.fecha_solicitud AS fecha_evaluacion,
                p.Cod_Postulacion
            FROM Evaluacion e
            JOIN Postulacion p ON e.Cod_Postulacion = p.Cod_Postulacion
            JOIN Candidato c ON p.ID_Candidato = c.ID_Candidato
            JOIN Requerimiento r ON p.Cod_Requerimiento = r.Cod_Requerimiento
            WHERE p.Cod_Postulacion NOT IN (
                SELECT Cod_Postulacion FROM Contrato
            )
                AND e.Hard_skills IS NOT NULL
                AND e.Soft_skills IS NOT NULL
                AND e.Experiencia IS NOT NULL
                AND e.Etica_integridad IS NOT NULL
                AND e.Evaluacion_economica IS NOT NULL
            ORDER BY puntaje_total DESC;
        """
        data = query_all(sql)
        if not data:
            return Response({"message": "No hay candidatos evaluados disponibles para contratar."})
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


# --- 3️⃣ CREAR CONTRATO ---
@api_view(['POST'])
def crear_contrato(request):
    try:
        data = request.data

        cod_postulacion = data.get("Cod_Postulacion")
        nombre_tipo_contrato = data.get("nombre_tipo_contrato", "Consultoría Externa")
        rol = data.get("rol")
        proyecto_asociado = data.get("proyecto_asociado")
        modalidad_pago = data.get("modalidad_pago", "Por Proyecto")
        fecha_inicio = data.get("fecha_inicio", str(date.today()))
        fecha_fin = data.get("fecha_fin", None)
        salario = float(data.get("salario", 5000))
        moneda = data.get("moneda", "PEN")
        condiciones = data.get("condiciones", "")

        # Generar código único de contrato
        total = query_all("SELECT COUNT(*) FROM Contrato;")[0]['count']
        cod_contrato = f"CONT{total + 1:03d}"

        # Insertar contrato
        sql = """
            INSERT INTO Contrato (
                Cod_Contrato, nombre_tipo_contrato, rol, Proyecto_asociado, Modalidad_pago,
                fecha_inicio, fecha_fin, salario, Moneda, Condiciones, Cod_Postulacion
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """
        execute(sql, (
            cod_contrato,
            nombre_tipo_contrato,
            rol,
            proyecto_asociado,
            modalidad_pago,
            fecha_inicio,
            fecha_fin,
            salario,
            moneda,
            condiciones,
            cod_postulacion
        ))

        return Response({
            "message": "✅ Contrato registrado exitosamente.",
            "Cod_Contrato": cod_contrato
        })

    except Exception as e:
        return Response({"error": str(e)}, status=400)
    



# --------------------------------------------------------------------------
# VISTAS DE LECTURA (GET APIs)
# --------------------------------------------------------------------------


@api_view(['GET'])
def cliente_list(request):
    """Muestra el listado completo de clientes."""
    # Usamos la función query_all de tu db.py
    sql = "SELECT * FROM cliente ORDER BY id_cliente"
    data = query_all(sql)
    return Response(data)


@api_view(['GET'])
def proyecto_list(request):
    """Muestra el listado de proyectos con sus clientes."""
    sql = """
        SELECT 
            p.id_proyecto, p.nombre_proyecto, p.estado_proyecto, p.fecha_inicio, p.fecha_fin, p.prioridad_proyecto,
            c.nombre_cliente
        FROM proyecto p
        JOIN cliente c ON p.id_cliente = c.id_cliente
        ORDER BY p.fecha_inicio DESC
    """
    data = query_all(sql)
    return Response(data)


@api_view(['GET'])
def tarea_list(request):
    """Muestra el listado de tareas."""
    sql = """
        SELECT 
            t.id_tarea, t.nombre_tarea, t.estado_tarea, t.fecha_entrega_estimada, t.fecha_entrega_real, t.descripcion_tarea,
            r.nombre_responsable, p.nombre_proyecto
        FROM tarea t
        JOIN responsable r ON t.id_responsable = r.id_responsable
        JOIN proyecto p ON t.id_proyecto = p.id_proyecto
        ORDER BY t.fecha_entrega_estimada DESC
    """
    data = query_all(sql)
    return Response(data)


@api_view(['GET'])
def responsable_list(request):
    """Muestra el listado de responsables."""
    sql = """
        SELECT 
            r.id_responsable, r.nombre_responsable, r.rol_responsable, r.correo, r.telefono, r.disponibilidad,
            p.nombre_proyecto
        FROM responsable r
        JOIN proyecto p ON r.id_proyecto = p.id_proyecto
        ORDER BY r.nombre_responsable ASC
    """
    data = query_all(sql)
    return Response(data)


@api_view(['GET'])
def documentacion_list(request):
    """Muestra el listado de documentos."""
    sql = """
        SELECT 
            d.id_documento, d.nombre_documento, d.tipo_documento, d.fecha_subida, d.archivo,
            p.nombre_proyecto
        FROM documentacion d
        JOIN proyecto p ON d.id_proyecto = p.id_proyecto
        ORDER BY d.fecha_subida DESC
    """
    data = query_all(sql)
    return Response(data)


# --------------------------------------------------------------------------
# VISTA DE ESCRITURA (POST API)
# --------------------------------------------------------------------------

@api_view(['POST'])
def crear_cliente(request):
    try:
        # 1. Obtener datos del cuerpo de la solicitud JSON
        id_cliente = request.data.get('id_cliente')
        nombre = request.data.get('nombre_cliente')
        tipo = request.data.get('tipo_cliente')
        contacto = request.data.get('contacto_cliente')
        correo = request.data.get('correo_cliente')
        telefono = request.data.get('telefono_cliente')
        direccion = request.data.get('direccion_cliente')

        # 2. Validar que el ID no venga vacío
        if not id_cliente:
             return Response({"error": "Falta el id_cliente"}, status=400)

        # 3. Construir la consulta SQL de inserción
        sql = """
            INSERT INTO cliente (id_cliente, nombre_cliente, tipo_cliente, contacto_cliente, correo_cliente, telefono_cliente, direccion_cliente)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        # Pasamos los parámetros como una tupla o lista
        params = (id_cliente, nombre, tipo, contacto, correo, telefono, direccion)
        
        # 4. Ejecutar usando la función de tu compañero
        execute(sql, params)

        return Response({"message": "Cliente registrado exitosamente", "id_cliente": id_cliente}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)
# --------------------------------------------------------------------------
# VISTAS DE ESCRITURA ADICIONALES (POST)
# --------------------------------------------------------------------------

@api_view(['POST'])
def crear_proyecto(request):
    try:
        # 1. Obtener datos
        id_proyecto = request.data.get('id_proyecto')
        id_cliente = request.data.get('cliente') # Ojo: esperamos el ID del cliente
        nombre = request.data.get('nombre_proyecto')
        f_inicio = request.data.get('fecha_inicio')
        f_fin = request.data.get('fecha_fin')
        desc = request.data.get('descripcion')
        estado = request.data.get('estado_proyecto')
        prioridad = request.data.get('prioridad_proyecto')

        if not id_proyecto or not id_cliente:
            return Response({"error": "Faltan datos obligatorios (ID Proyecto o Cliente)"}, status=400)

        # 2. SQL
        sql = """
            INSERT INTO proyecto (id_proyecto, id_cliente, nombre_proyecto, fecha_inicio, fecha_fin, descripcion, estado_proyecto, prioridad_proyecto)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (id_proyecto, id_cliente, nombre, f_inicio, f_fin, desc, estado, prioridad)
        
        # 3. Ejecutar
        execute(sql, params)
        return Response({"message": "Proyecto creado exitosamente", "id": id_proyecto}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['POST'])
def crear_responsable(request):
    try:
        # 1. Obtener datos
        id_resp = request.data.get('id_responsable')
        id_proy = request.data.get('proyecto')
        cod_req = request.data.get('cod_requerimiento')
        nombre = request.data.get('nombre_responsable')
        rol = request.data.get('rol_responsable')
        correo = request.data.get('correo')
        tel = request.data.get('telefono')
        disp = request.data.get('disponibilidad')

        if not id_resp or not id_proy:
             return Response({"error": "Faltan datos obligatorios"}, status=400)

        # 2. SQL
        sql = """
            INSERT INTO responsable (id_responsable, id_proyecto, cod_requerimiento, nombre_responsable, rol_responsable, correo, telefono, disponibilidad)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (id_resp, id_proy, cod_req, nombre, rol, correo, tel, disp)
        
        # 3. Ejecutar
        execute(sql, params)
        return Response({"message": "Responsable creado exitosamente", "id": id_resp}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['POST'])
def crear_tarea(request):
    try:
        # 1. Obtener datos
        id_tarea = request.data.get('id_tarea')
        id_proy = request.data.get('proyecto')
        id_resp = request.data.get('responsable')
        nombre = request.data.get('nombre_tarea')
        desc = request.data.get('descripcion_tarea')
        f_inicio = request.data.get('fecha_inicio_tarea')
        f_estimada = request.data.get('fecha_entrega_estimada')
        f_real = request.data.get('fecha_entrega_real') # Puede ser null
        estado = request.data.get('estado_tarea')

        if not id_tarea or not id_proy:
            return Response({"error": "Faltan datos obligatorios"}, status=400)

        # 2. SQL
        sql = """
            INSERT INTO tarea (id_tarea, id_proyecto, id_responsable, nombre_tarea, descripcion_tarea, fecha_inicio_tarea, fecha_entrega_estimada, fecha_entrega_real, estado_tarea)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (id_tarea, id_proy, id_resp, nombre, desc, f_inicio, f_estimada, f_real, estado)
        
        # 3. Ejecutar
        execute(sql, params)
        return Response({"message": "Tarea creada exitosamente", "id": id_tarea}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['POST'])
def crear_documentacion(request):
    try:
        # 1. Obtener datos de texto
        id_doc = request.data.get('id_documento')
        id_proy = request.data.get('proyecto')
        tipo = request.data.get('tipo_documento')
        nombre = request.data.get('nombre_documento')
        f_subida = request.data.get('fecha_subida')
        
        # 2. TRUCO: Manejo del Archivo
        # Obtenemos el archivo físico
        archivo_obj = request.FILES.get('archivo') 
        
        ruta_para_bd = None # Por defecto nulo (String)

        if archivo_obj:
            # Guardamos el archivo en la carpeta 'media/documentos' del servidor
            # Esto devuelve SOLO EL NOMBRE (String), ej: "documentos/foto.png"
            ruta_para_bd = default_storage.save(f"documentos/{archivo_obj.name}", archivo_obj)
        
        if not id_doc:
             return Response({"error": "Falta el ID del documento"}, status=400)

        # 3. SQL: Insertamos el STRING (ruta), no el objeto archivo
        sql = """
            INSERT INTO documentacion (id_documento, id_proyecto, tipo_documento, nombre_documento, fecha_subida, archivo)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        # Aquí pasamos 'ruta_para_bd' que es TEXTO. El error 'InMemoryUploadedFile' desaparecerá.
        params = (id_doc, id_proy, tipo, nombre, f_subida, ruta_para_bd)
        
        execute(sql, params)
        return Response({"message": "Documento registrado exitosamente", "id": id_doc}, status=201)

    except Exception as e:
        # Imprimimos el error en la terminal para que sepas qué pasó si falla
        print(f"Error al crear documento: {e}")
        return Response({"error": str(e)}, status=400)