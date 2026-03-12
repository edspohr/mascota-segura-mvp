# 📋 Guía de Pruebas: Flujos QR (Pakuna Light)

Esta guía detalla los pasos para auditar los 4 estados principales del flujo de códigos QR en la versión **Pakuna Light**.

## 🚀 Acceso Rápido (Producción)
- **URL Base**: [https://pakuna-3413d.web.app](https://pakuna-3413d.web.app)
- **Modo Demo**: Activo en la pantalla de Login para pruebas rápidas.

---

## 1. QR Huérfano (Activación)
*Simula el escaneo de una placa que acaba de ser comprada y no tiene dueño.*

- **Link de Prueba**: [Activar Placa F9L4W6](https://pakuna-3413d.web.app/activar/F9L4W6)
- **Qué verificar**:
    - [ ] Interfaz de bienvenida premium con logo de Pakuna.
    - [ ] Mensaje motivador para unirse a la familia.
    - [ ] Botón de "Comenzar Registro" que redirige al flujo de onboarding.

## 2. Mascota Segura (Escaneo de Curiosidad)
*Simula a un extraño escaneando la placa de una mascota que NO está perdida.*

- **Link de Prueba**: [Perfil de Luna](https://pakuna-3413d.web.app/p/luna-x8k9m2)
- **Qué verificar**:
    - [ ] Paleta **Navy & Teal** elegante.
    - [ ] Badge verde pulsante de "Mascota Segura".
    - [ ] **Privacidad**: El teléfono del dueño NO es visible.
    - [ ] Presencia del "Dato Curioso" de la mascota.

## 3. Hallazgo Preventivo (Reporte de Ubicación)
*Simula que alguien encontró a la mascota pero el dueño aún no sabe que se escapó.*

- **Pasos**:
    1. Entra al perfil de Luna arriba.
    2. Haz clic en **"¿Encontraste a esta mascota?"**.
- **Qué verificar**:
    - [ ] Formulario elegante en tonos ámbar/slate.
    - [ ] Confirmación de que el teléfono del reportante es privado.
    - [ ] Pantalla de "¡Éxito!" tras enviar el reporte.

## 4. Mascota Perdida (Modo Emergencia 🚨)
*Simula el escaneo de una mascota marcada como PERDIDA por su dueño.*

- **Link de Prueba**: [Perfil de Milo (Perdido)](https://pakuna-3413d.web.app/p/milo-j3r7p1)
- **Qué verificar**:
    - [ ] Interfaz de urgencia (Banner rojo, pero manteniendo la elegancia Navy).
    - [ ] **Acceso Crítico**: Los botones de "Llamar al Dueño" y WhatsApp son prominentes.
    - [ ] **Alertas Médicas**: Son visibles inmediatamente para ayudar al rescatista.

---

> [!TIP]
> **Consejo para Testing**: Para probar el flujo de notificaciones reales, inicia sesión como **Dueño (Sofía)** en el dashboard, cambia el estado de una de tus mascotas a "Perdido" y luego escanea su link desde un dispositivo móvil o ventana de incógnito.
