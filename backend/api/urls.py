from django.urls import path
from . import views

urlpatterns = [
    #----Gestion de Reclutamiento
    #--- RUTAS DE REQUERIMIENTOS ---
    path('requerimientos/', views.requerimientos_list),
    path('requerimientos/crear/', views.crear_requerimiento),  # POST
    #--- RUTAS DE EVALUACIONES ---
    path('evaluaciones/', views.listar_evaluaciones),
    path('evaluaciones/crear/', views.crear_evaluacion),  # POST
    path('evaluaciones/actualizar/<str:cod_postulacion>/', views.revaluar_candidato),  # PUT
    #--- RUTAS DE CANDIDATOS ---
    path('contratos/listar/', views.listar_expertos_contratados),
    path('contratos/candidatos-evaluados/', views.listar_candidatos_evaluados),
    path('contratos/crear/', views.crear_contrato),




    #-----Gestion de Proyectos
    # --- RUTAS DEL BACKEND API (DATOS JSON) ---
    # Clientes
    path('clientes/', views.cliente_list),
    path('clientes/crear/', views.crear_cliente),
    
    # Proyectos
    path('proyectos/', views.proyecto_list),
    path('api/proyectos/crear/', views.crear_proyecto),
    
    # Responsables
    path('responsables/', views.responsable_list),
    path('responsables/crear/', views.crear_responsable,),
    
    # Tareas
    path('tareas/', views.tarea_list),
    path('tareas/crear/', views.crear_tarea),
    
    # Documentación
    path('documentacion/', views.documentacion_list),
    path('documentacion/crear/', views.crear_documentacion),

]
