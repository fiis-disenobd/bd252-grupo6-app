from django.urls import path
from . import views
from .views import dashboard_data

urlpatterns = [
    path("test/", views.test_api),
    path("dashboard/", dashboard_data),
    path("map/data/", views.map_data),
    # Listas JSON para las tablas del frontend
    path("clientes/", views.clientes_list),
    path("productos/", views.productos_list),
    path("inventario/", views.inventario_list),
    path("recepciones/", views.recepciones_list),
    path("pedidos/", views.pedidos_list),
    path("picking/", views.picking_list),
    path("reposiciones/", views.reposiciones_list),
    path("cajas/", views.cajas_list),
    path("checkout/", views.checkout_list),
    path("despachos/", views.despachos_list),


    # ===============================
    # RECEPCIONES
    # ===============================
    path("recepciones/", views.recepciones_list, name="recepciones_list"),

    path("recepciones/<str:id_recepcion>/detalles/",
         views.recepcion_detalles, name="recepcion_detalles"),

    path("recepciones/<str:id_recepcion>/cerrar/",
         views.cerrar_recepcion, name="cerrar_recepcion"),

    # ===============================
    # DETALLE RECEPCIÓN
    # ===============================
    path("detalle/<str:id_detalle>/verificar/",
         views.verificar_detalle, name="verificar_detalle"),

    path("detalle/<str:id_detalle>/asignar-ubicacion/",
         views.asignar_ubicacion, name="asignar_ubicacion"),

        # ⭐ ESTA ES LA QUE USA TU FRONTEND (falta y por eso da 404)
    path("asignar-ubicacion/<str:id_detalle>/", 
         views.asignar_ubicacion),

    # ===============================
    # UBICACIONES / INVENTARIO
    # ===============================
    path("ubicaciones/sugerir/<str:id_producto>/",
         views.sugerir_ubicaciones, name="sugerir_ubicaciones"),



     # ===========================
    # UBICACIONES
    # ===========================
    path("ubicaciones/", views.ubicaciones_list, name="ubicaciones_list"),
    path("ubicaciones/<str:id_ubicacion>/", views.ubicacion_detalle, name="ubicacion_detalle"),

    # ===========================
    # INVENTARIO EN UBICACIÓN
    # ===========================
    path("ubicaciones/<str:id_ubicacion>/inventario/", 
         views.inventario_en_ubicacion, 
         name="inventario_en_ubicacion"),

]

