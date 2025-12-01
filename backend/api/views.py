from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import render
from django.http import JsonResponse
from .db import query_all, query_one
from .db import execute_query



@api_view(['GET'])
def test_api(request):
    data = {
        "message": "API funcionando correctamente!",
        "status": "OK"
    }
    return Response(data)


# =========================
#   DASHBOARD PRINCIPAL
# =========================

@api_view(['GET'])
def dashboard_data(request):
    kpis = {}

    # ---- PEDIDOS POR ESTADO ----
    kpis["total_pedidos"] = query_one("SELECT COUNT(*) AS total FROM Pedido")["total"]
    kpis["planificados"] = query_one("SELECT COUNT(*) AS total FROM Pedido WHERE estado='Planificado'")["total"]
    kpis["picking"] = query_one("SELECT COUNT(*) AS total FROM Pedido WHERE estado='En picking'")["total"]
    kpis["validados"] = query_one("SELECT COUNT(*) AS total FROM Pedido WHERE estado='Validado'")["total"]

    # ---- STOCK BAJO (< 10) ----
    kpis["stock_bajo"] = query_one(
        "SELECT COUNT(*) AS total FROM Inventario WHERE cantidad < 10"
    )["total"]

    # ---- RECEPCIONES POR ESTADO ----
    kpis["recepciones_registrado"] = query_one(
        "SELECT COUNT(*) AS total FROM Recepcion WHERE estado='Registrado'"
    )["total"]

    kpis["recepciones_pendiente"] = query_one(
        "SELECT COUNT(*) AS total FROM Recepcion WHERE estado='Pendiente'"
    )["total"]

    kpis["recepciones_cerrado"] = query_one(
        "SELECT COUNT(*) AS total FROM Recepcion WHERE estado='Cerrado'"
    )["total"]

    # ---- INVENTARIO BAJO DETALLADO ----
    inventario_bajo = query_all(
        "SELECT id_producto, cantidad FROM Inventario WHERE cantidad < 10 ORDER BY cantidad ASC"
    )

    inventario_bajo_list = [
        [row["id_producto"], row["cantidad"]] for row in inventario_bajo
    ]

    # ---- PEDIDOS POR HORA ----
    pedidos_hora = query_all("""
        SELECT corte_horario AS hora, COUNT(*) AS count
        FROM Pedido
        GROUP BY corte_horario
        ORDER BY corte_horario
    """)

    pedidos_por_hora = [
        {"hora": row["hora"], "count": row["count"]} for row in pedidos_hora
    ]

    # ---- RESPUESTA DEL API ----
    data = {
        "kpis": kpis,
        "inventario_bajo": inventario_bajo_list,
        "pedidos_por_hora": pedidos_por_hora
    }

    return JsonResponse(data)


# =========================
#   LISTAS PARA TABLAS
# =========================

def clientes_list(request):
    data = query_all("SELECT * FROM Cliente ORDER BY id_cliente")
    return JsonResponse(data, safe=False)

def productos_list(request):
    data = query_all("SELECT * FROM Producto ORDER BY id_producto")
    return JsonResponse(data, safe=False)

def inventario_list(request):
    sql = """
        SELECT Inventario.id_inventario, Producto.descripcion, Ubicacion.codigo,
               Inventario.cantidad, Inventario.fecha_actualizacion
        FROM Inventario
        JOIN Producto ON Inventario.id_producto = Producto.id_producto
        JOIN Ubicacion ON Inventario.id_ubicacion = Ubicacion.id_ubicacion
        ORDER BY id_inventario
    """
    data = query_all(sql)
    return JsonResponse(data, safe=False)

def recepciones_list(request):
    sql = """
        SELECT R.id_recepcion, C.nombre AS cliente, R.fecha_recepcion,
               R.documento, R.estado
        FROM Recepcion R
        JOIN Cliente C ON R.id_cliente = C.id_cliente
        ORDER BY R.fecha_recepcion DESC
    """
    data = query_all(sql)
    return JsonResponse(data, safe=False)

def pedidos_list(request):
    sql = """
        SELECT P.id_pedido, C.nombre AS cliente, Ca.nombre AS canal,
               P.fecha_pedido, P.estado, P.transporte_asignado
        FROM Pedido P
        JOIN Cliente C ON P.id_cliente = C.id_cliente
        JOIN Canal Ca ON P.id_canal = Ca.id_canal
        ORDER BY fecha_pedido DESC
    """
    data = query_all(sql)
    return JsonResponse(data, safe=False)

def picking_list(request):
    sql = """
        SELECT PT.id_tarea, PT.estado, PT.tipo_picking, O.nombre AS operario,
               Ola.tipo_ola, Ola.fecha_creacion
        FROM Picking_Tarea PT
        JOIN Operario O ON PT.id_operario = O.id_operario
        JOIN Ola ON PT.id_ola = Ola.id_ola
        ORDER BY PT.id_tarea
    """
    data = query_all(sql)
    return JsonResponse(data, safe=False)

def reposiciones_list(request):
    sql = """
        SELECT R.id_reposicion, P.descripcion AS producto,
               U1.codigo AS origen, U2.codigo AS destino,
               R.cantidad, R.fecha, R.estado
        FROM Reposicion R
        JOIN Producto P ON R.id_producto = P.id_producto
        JOIN Ubicacion U1 ON R.origen_ubicacion = U1.id_ubicacion
        JOIN Ubicacion U2 ON R.destino_ubicacion = U2.id_ubicacion
        ORDER BY R.fecha DESC
    """
    data = query_all(sql)
    return JsonResponse(data, safe=False)

def cajas_list(request):
    sql = """
        SELECT Caja.id_caja, Caja.id_pedido, Caja.peso, Caja.estado,
               Caja.etiqueta_check, Caja.fecha
        FROM Caja
        ORDER BY Caja.fecha DESC
    """
    data = query_all(sql)
    return JsonResponse(data, safe=False)

def checkout_list(request):
    sql = """
        SELECT CH.id_check, CH.id_caja, O.nombre AS operario, 
               CH.peso_registrado, CH.diferencia, CH.resultado, CH.fecha
        FROM Check_Out CH
        JOIN Operario O ON CH.id_operario = O.id_operario
        ORDER BY CH.fecha DESC
    """
    data = query_all(sql)
    return JsonResponse(data, safe=False)

def despachos_list(request):
    sql = """
        SELECT D.id_despacho, D.id_pedido, D.transporte, 
               D.fecha_salida, D.estado
        FROM Despacho D
        ORDER BY fecha_salida DESC
    """
    data = query_all(sql)
    return JsonResponse(data, safe=False)

# =========================
#   MAPA 3D
# =========================
@api_view(['GET'])
def map_data(request):
    """
    Devuelve ubicaciones (racks/slots), inventario por ubicación, info de productos,
    cajas (y sus detalles). El frontend 3D consumirá este endpoint y colocará
    cajas/estanterías en la vista según las ubicaciones.
    """
    # Ubicaciones / Racks / slots
    ubicaciones = query_all("""
        SELECT id_ubicacion, codigo, pasillo, nivel, slot, id_estructura, tipo_almacen
        FROM Ubicacion
        ORDER BY pasillo, nivel, slot
    """)

    # Inventario por ubicacion (vinculado a producto y ubicación)
    inventario = query_all("""
        SELECT i.id_inventario, i.id_producto, p.sku, p.descripcion, p.categoria,
               i.id_ubicacion, u.codigo AS ubicacion_codigo, i.cantidad, i.fecha_actualizacion
        FROM Inventario i
        JOIN Producto p ON i.id_producto = p.id_producto
        JOIN Ubicacion u ON i.id_ubicacion = u.id_ubicacion
        ORDER BY u.codigo
    """)

    # Productos (catalogo resumido)
    productos = query_all("""
        SELECT id_producto, sku, descripcion, categoria, marca, peso_unitario
        FROM Producto
        ORDER BY id_producto
    """)

    # Cajas (cabecera) + detalles agregados en un array JSON-like
    # Si tu función query_all no soporta json_agg en sqlite, en Postgres esto funciona.
    cajas = query_all("""
        SELECT c.id_caja, c.id_pedido, c.peso, c.estado, c.etiqueta_check, c.fecha,
               COALESCE(json_agg(json_build_object('id_caja_detalle', cd.id_caja_detalle,
                                                  'id_producto', cd.id_producto,
                                                  'cantidad', cd.cantidad)) FILTER (WHERE cd.id_caja_detalle IS NOT NULL), '[]') AS detalles
        FROM Caja c
        LEFT JOIN Caja_Detalle cd ON cd.id_caja = c.id_caja
        GROUP BY c.id_caja
        ORDER BY c.fecha DESC
    """)

    # Resumen rápido (opcionales, útiles para colorear/filtrar)
    resumen = {
        "total_racks": len(ubicaciones),
        "total_productos": len(productos),
        "total_cajas": len(cajas),
    }

    data = {
        "ubicaciones": ubicaciones,
        "inventario": inventario,
        "productos": productos,
        "cajas": cajas,
        "resumen": resumen
    }

    return Response(data)

# ============================================================
# LISTAR RECEPCIONES
# ============================================================
@api_view(['GET'])
def recepciones_list(request):
    sql = """
        SELECT R.id_recepcion,
               C.nombre AS cliente,
               R.fecha_recepcion,
               R.documento,
               R.estado
        FROM recepcion R
        JOIN cliente C ON C.id_cliente = R.id_cliente
        ORDER BY R.fecha_recepcion DESC
    """
    return Response(query_all(sql))


# ============================================================
# DETALLES DE UNA RECEPCIÓN
# ============================================================
@api_view(['GET'])
def recepcion_detalles(request, id_recepcion):
    sql = """
    SELECT DR.id_detalle_recepcion,
           DR.id_recepcion,
           DR.id_producto,
           P.sku,
           P.descripcion,
           DR.cantidad_recibida,
           DR.cantidad_verificada,
           DR.estado
    FROM detalle_recepcion DR
    JOIN producto P ON P.id_producto = DR.id_producto
    WHERE DR.id_recepcion = %s
    ORDER BY DR.id_detalle_recepcion
    """
    return Response(query_all(sql, (id_recepcion,)))


# ============================================================
# VERIFICAR DETALLE
# ============================================================
@api_view(['POST'])
def verificar_detalle(request, id_detalle):
    cantidad = request.data.get("cantidad_verificada")
    estado = request.data.get("estado", "OK")

    sql = """
        UPDATE detalle_recepcion
        SET cantidad_verificada = %s,
            estado = %s
        WHERE id_detalle_recepcion = %s
    """

    execute_query(sql, (cantidad, estado, id_detalle))

    return Response({"status": "updated"})


# ============================================================
# SUGERIR UBICACIONES
# ============================================================
@api_view(['GET'])
def sugerir_ubicaciones(request, id_producto):
    sql = """
        SELECT U.id_ubicacion,
               U.codigo,
               U.tipo_almacen,
               COALESCE(I.cantidad, 0) AS stock
        FROM ubicacion U
        LEFT JOIN inventario I
               ON I.id_ubicacion = U.id_ubicacion
              AND I.id_producto = %s
        ORDER BY stock DESC
    """
    return Response(query_all(sql, (id_producto,)))


# ============================================================
# ASIGNAR UBICACIÓN + ACTUALIZAR INVENTARIO
# ============================================================
@api_view(['POST'])
def asignar_ubicacion(request, id_detalle):

    nueva_ubicacion = request.data.get("id_ubicacion")

    # 1) obtener info del detalle
    det = query_one("""
        SELECT id_producto, cantidad_verificada
        FROM detalle_recepcion
        WHERE id_detalle_recepcion = %s
    """, (id_detalle,))

    id_producto = det["id_producto"]
    cantidad = det["cantidad_verificada"]

    # 2) buscar si ya existe inventario
    inv = query_one("""
        SELECT id_inventario, cantidad
        FROM inventario
        WHERE id_producto = %s AND id_ubicacion = %s
    """, (id_producto, nueva_ubicacion))

    if inv:
        execute_query("""
            UPDATE inventario
            SET cantidad = cantidad + %s,
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id_inventario = %s
        """, (cantidad, inv["id_inventario"]))
    else:
        nuevo_id = "INV" + str(
            query_one("SELECT COUNT(*)+1 AS n FROM inventario")["n"]
        ).zfill(5)

        execute_query("""
            INSERT INTO inventario (id_inventario, id_producto, id_ubicacion, cantidad)
            VALUES (%s, %s, %s, %s)
        """, (nuevo_id, id_producto, nueva_ubicacion, cantidad))

    # 3) actualizar estado del detalle
    execute_query("""
        UPDATE detalle_recepcion
        SET estado = 'Ubicado'
        WHERE id_detalle_recepcion = %s
    """, (id_detalle,))

    return Response({
        "status": "ubicado",
        "id_producto": id_producto,
        "id_ubicacion": nueva_ubicacion,})


# ============================================================
# CERRAR RECEPCIÓN
# ============================================================
@api_view(['POST'])
def cerrar_recepcion(request, id_recepcion):

    detalles = query_all("""
        SELECT estado
        FROM detalle_recepcion
        WHERE id_recepcion = %s
    """, (id_recepcion,))

    # Normalizamos estados
    estados = [d["estado"].strip().lower() for d in detalles]

    # Estados permitidos para cerrar
    estados_validos = ["ok", "ubicado"]

    if any(estado not in estados_validos for estado in estados):
        return Response(
            {"error": "Hay detalles pendientes o sin ubicar"},
            status=400
        )

    execute_query("""
        UPDATE recepcion
        SET estado = 'Cerrado'
        WHERE id_recepcion = %s
    """, (id_recepcion,))

    return Response({"status": "cerrado"})


# ============================================================
# LISTAR TODAS LAS UBICACIONES
# ============================================================
@api_view(['GET'])
def ubicaciones_list(request):
    sql = """
        SELECT 
            MIN(id_ubicacion) AS id_ubicacion,
            codigo,
            
            -- Tomamos cualquier valor consistente (el primero)
            MIN(pasillo) AS pasillo,
            MIN(nivel) AS nivel,
            MIN(slot) AS slot,
            
            -- El tipo de almacén también debe ser el primero
            MIN(tipo_almacen) AS tipo_almacen,

            COUNT(*) AS cantidad_slots
        FROM ubicacion
        GROUP BY codigo
        ORDER BY codigo ASC;
    """
    return Response(query_all(sql))


# ============================================================
# INVENTARIO DENTRO DE UNA UBICACIÓN
# ============================================================
@api_view(['GET'])
def inventario_en_ubicacion(request, id_ubicacion):
    sql_codigo = "SELECT codigo FROM ubicacion WHERE id_ubicacion = %s LIMIT 1;"
    row = query_one(sql_codigo, (id_ubicacion,))

    codigo = row["codigo"]

    sql = """
        SELECT I.id_inventario,
               I.id_producto,
               P.sku,
               P.descripcion,
               I.cantidad,
               I.fecha_actualizacion,
               U.codigo
        FROM inventario I
        JOIN producto P ON P.id_producto = I.id_producto
        JOIN ubicacion U ON U.id_ubicacion = I.id_ubicacion
        WHERE U.codigo = %s
        ORDER BY P.sku ASC;
    """
    return Response(query_all(sql, (codigo,)))

# ============================================================
# DETALLES DE UNA UBICACIÓN ESPECÍFICA
# ============================================================
@api_view(['GET'])
def ubicacion_detalle(request, id_ubicacion):
    sql = """
        SELECT 
            U.id_ubicacion,
            U.codigo,
            U.pasillo,
            U.nivel,
            U.slot,
            U.tipo_almacen,
            TE.nombre AS tipo_estructura
        FROM ubicacion U
        JOIN tipo_estructura TE ON TE.id_estructura = U.id_estructura
        WHERE U.id_ubicacion = %s
        LIMIT 1;
    """
    return Response(query_one(sql, (id_ubicacion,)))
