# Requerimientos del Sistema de Restaurante

## Requerimientos Funcionales

| Módulo | ID | Requerimiento | Descripción | Entidades Relacionadas |
|--------|----|--------------|--------------|-----------------------|
| **Usuarios y Autenticación** | RF01 | Gestión de personas | Permitir crear, leer, actualizar y eliminar registros de personas | Persona |
| | RF02 | Registro de usuarios | Permitir la creación de cuentas de usuario asociadas a personas | Persona, Usuario, TipoUsuario |
| | RF03 | Autenticación de usuarios | Permitir el inicio de sesión seguro mediante credenciales | Usuario |
| | RF04 | Gestión de permisos | Controlar el acceso a funcionalidades según tipo de usuario | TipoUsuario, Usuario |
| | RF05 | Gestión de empleados | Administrar la información de empleados y sus cargos | Persona, Empleado |
| **Inventario** | RF06 | Gestión de proveedores | Permitir crear, leer, actualizar y eliminar registros de proveedores | Proveedor |
| | RF07 | Gestión de insumos | Permitir la administración del inventario de insumos | Insumo, Proveedor |
| | RF08 | Control de stock | Monitorear y actualizar el stock de insumos | Insumo |
| | RF09 | Alertas de stock bajo | Notificar cuando un insumo esté por debajo del nivel mínimo | Insumo |
| **Menú** | RF10 | Gestión de platos | Permitir crear, leer, actualizar y eliminar platos del menú | Plato |
| | RF11 | Gestión de ingredientes | Definir y modificar los ingredientes que componen cada plato | Plato, Ingrediente, Insumo |
| | RF12 | Cálculo de costos | Calcular el costo de cada plato basado en sus ingredientes | Plato, Ingrediente, Insumo |
| | RF13 | Gestión de ofertas | Crear y administrar ofertas y descuentos para platos específicos | Plato, Oferta |
| | RF14 | Estado de disponibilidad | Marcar platos como disponibles o no disponibles | Plato |
| **Pedidos** | RF15 | Creación de pedidos | Permitir registrar nuevos pedidos | Pedido |
| | RF16 | Asignación de mesa | Asociar pedidos a mesas específicas | Pedido |
| | RF17 | Agregar órdenes | Añadir platos a un pedido | Pedido, Orden, Plato |
| | RF18 | Modificar órdenes | Permitir cambios en las órdenes antes de ser procesadas | Orden |
| | RF19 | Seguimiento de estado | Controlar el estado de los pedidos (pendiente, atendido, cancelado) | Pedido |
| **Ventas** | RF20 | Procesamiento de ventas | Convertir órdenes en ventas registradas | Orden, Venta |
| | RF21 | Múltiples métodos de pago | Permitir distintas formas de pago | Venta, MetodoPago |
| | RF22 | Emisión de boletas | Generar boletas para ventas a consumidores finales | Venta, Boleta |
| | RF23 | Emisión de facturas | Generar facturas para clientes corporativos | Venta, Factura |
| | RF24 | Historial de ventas | Mantener un registro histórico de todas las ventas | Venta |
| **Reportes** | RF25 | Reporte de ventas | Generar informes de ventas por período | Venta |
| | RF26 | Reporte de inventario | Generar informes del estado actual del inventario | Insumo |
| | RF27 | Análisis de platos populares | Identificar los platos más vendidos | Plato, Orden |
| | RF28 | Análisis de rentabilidad | Calcular la rentabilidad por plato | Plato, Ingrediente, Insumo, Venta |

## Requerimientos No Funcionales

| Categoría | ID | Requerimiento | Descripción | Implementación en Azure |
|-----------|----|--------------|--------------|-----------------------|
| **Rendimiento** | RNF01 | Tiempo de respuesta | El sistema debe responder en menos de 2 segundos | App Service (Plan P2v3) para Frontend, AKS optimizado para Backend |
| | RNF02 | Capacidad de usuarios concurrentes | Soporte para al menos 100 usuarios simultáneos | Escalado automático en App Service y AKS |
| | RNF03 | Rendimiento de la base de datos | Optimización de consultas para respuesta rápida | Azure SQL Database (S2) con índices optimizados |
| **Disponibilidad** | RNF04 | Alta disponibilidad | Disponibilidad del sistema 99.9% del tiempo | Configuración de alta disponibilidad en AKS y Azure SQL |
| | RNF05 | Continuidad del negocio | Recuperación ante desastres en menos de 4 horas | Point-in-time restore en Azure SQL, backups automatizados |
| | RNF06 | Tiempo de inactividad planificado | Actualizaciones sin tiempo de inactividad perceptible | Implementación de despliegue Blue/Green en AKS |
| **Seguridad** | RNF07 | Autenticación segura | Implementación de autenticación robusta | Azure AD integración, JWT tokens |
| | RNF08 | Protección de datos sensibles | Cifrado de información personal y financiera | Cifrado en reposo para Azure SQL, cifrado TLS en tránsito |
| | RNF09 | Auditoría de acciones | Registro de todas las operaciones críticas | Azure Monitor, Log Analytics |
| | RNF10 | Prevención de inyección SQL | Protección contra ataques de inyección | Prisma ORM con parámetros preparados |
| **Usabilidad** | RNF11 | Interfaz responsiva | Adaptación a diferentes dispositivos (desktop, tablet, móvil) | Diseño responsivo en React/Next.js |
| | RNF12 | Tiempo de aprendizaje | El sistema debe ser intuitivo para nuevos usuarios | UI/UX optimizado con componentes claros y consistentes |
| | RNF13 | Accesibilidad | Cumplimiento con estándares WCAG 2.1 nivel AA | Implementación de atributos ARIA en React |
| **Escalabilidad** | RNF14 | Escalabilidad horizontal | Capacidad para escalar añadiendo nodos | AKS con autoescalado, Azure SQL Elastic Pool |
| | RNF15 | Escalabilidad vertical | Capacidad para aumentar recursos de los servidores | Planes escalables en App Service y Azure SQL |
| **Mantenibilidad** | RNF16 | Arquitectura modular | Diseño que permita cambios con mínimo impacto | Estructura de componentes en React, capas en Backend |
| | RNF17 | Pruebas automatizadas | Cobertura de pruebas automatizadas > 80% | Pipeline CI/CD en Azure DevOps con tests unitarios e integración |
| | RNF18 | Documentación actualizada | Documentación técnica y de usuario siempre al día | Wiki en Azure DevOps, documentación de API con Swagger |
| **Compatibilidad** | RNF19 | Soporte de navegadores | Compatibilidad con navegadores modernos | Transpilación con Babel, polyfills para compatibilidad |
| | RNF20 | APIs estándar | Uso de estándares REST para integraciones | API REST documentada con OpenAPI |
| **Cumplimiento** | RNF21 | Protección de datos personales | Cumplimiento con regulaciones de protección de datos | Implementación de medidas GDPR/LGPD |
| | RNF22 | Facturación electrónica | Cumplimiento con requisitos fiscales locales | Integración con sistema de facturación electrónica |

## Arquitectura Técnica del Sistema

| Componente | Tecnología | Servicio de Azure | Especificaciones |
|------------|------------|-------------------|-----------------|
| **Frontend** | React/Next.js | Azure App Service | Plan P2v3, 2 instancias en alta disponibilidad |
| **Backend** | Node.js con Prisma ORM | Azure Kubernetes Service (AKS) | Cluster de 3 nodos, autoescalado habilitado |
| **Base de Datos** | MySQL | Azure SQL Database | Nivel S2, 50 GB, alta disponibilidad, backups diarios |
| **Almacenamiento** | Blob Storage | Azure Blob Storage | LRS (Locally Redundant Storage), 100 GB inicial |
| **Identidad y Acceso** | OAuth 2.0, JWT | Azure Active Directory B2C | Plan P1, integración con App Service |
| **Monitoreo** | Logs, Métricas | Azure Monitor, Application Insights | Retención de 30 días, alertas configuradas |
| **Redes** | Comunicación segura | Azure Virtual Network, Application Gateway | WAF habilitado, TLS 1.2+ |
| **CI/CD** | Despliegue automatizado | Azure DevOps, GitHub Actions | Pipeline automatizado con entornos dev, test, prod |
