# Configuración de Supabase

Este archivo contiene todas las instrucciones SQL que debes ejecutar en tu proyecto de Supabase.

## 📋 Pasos de Configuración

### 1️⃣ Crear Tabla de Citas

Ve al **SQL Editor** en tu proyecto de Supabase y ejecuta:

```sql
-- Crear tabla de citas (appointments)
create table appointments (
  id uuid default gen_random_uuid() primary key,
  date text not null,
  time text not null,
  name text not null,
  phone text not null,
  email text not null,
  status text default 'scheduled' check (status in ('scheduled', 'cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 2️⃣ Configurar Row Level Security (RLS)

Habilitar RLS y crear políticas de seguridad:

```sql
-- Habilitar Row Level Security
alter table appointments enable row level security;

-- Política 1: Permitir a todos LEER las citas (para ver disponibilidad en el calendario)
create policy "Permitir lectura pública de citas"
  on appointments for select
  using (true);

-- Política 2: Permitir a todos CREAR citas (para que los usuarios agenden)
create policy "Permitir inserción pública de citas"
  on appointments for insert
  with check (true);

-- Política 3: Solo usuarios autenticados pueden ACTUALIZAR citas (para el admin)
create policy "Permitir actualización a usuarios autenticados"
  on appointments for update
  using (auth.role() = 'authenticated');
```

### 3️⃣ Crear Usuario Administrador

Para acceder al panel `/admin`, necesitas crear un usuario en Supabase:

1. Ve a **Authentication > Users** en tu dashboard de Supabase
2. Haz clic en **Add User**
3. Ingresa:
   - Email: tu correo de administrador
   - Password: una contraseña segura
   - Marca "Auto Confirm User" si no quieres configurar verificación de email
4. Clic en **Create User**

Este usuario podrá:
- Iniciar sesión en `/admin`
- Ver todas las citas agendadas
- Cancelar citas

### 4️⃣ Configurar Variables de Entorno

En la raíz de tu proyecto, crea un archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

Para obtener estas credenciales:
1. Ve a **Project Settings > API** en Supabase
2. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## ✅ Verificación

Para verificar que todo está configurado correctamente:

1. **Tabla creada:** Ve a **Table Editor** y verifica que existe la tabla `appointments`
2. **RLS habilitado:** En la tabla, debe aparecer "RLS enabled" en verde
3. **Políticas activas:** Haz clic en "Policies" y verifica las 3 políticas
4. **Usuario creado:** En **Authentication > Users** debe aparecer tu usuario admin

---

## 🔍 Estructura de la Tabla `appointments`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | ID único de la cita (auto-generado) |
| `date` | text | Fecha de la cita (formato: YYYY-MM-DD) |
| `time` | text | Hora de la cita (formato: HH:MM) |
| `name` | text | Nombre completo del cliente |
| `phone` | text | Número telefónico del cliente |
| `email` | text | Correo electrónico del cliente |
| `status` | text | Estado: 'scheduled' o 'cancelled' |
| `created_at` | timestamp | Fecha de creación del registro |

---

## 🛡️ Seguridad (RLS Policies)

### Política 1: Lectura Pública
- **Permite:** Cualquiera puede ver las citas
- **Por qué:** Para mostrar disponibilidad en el calendario
- **Riesgo:** Bajo - solo se expone información de horarios

### Política 2: Inserción Pública
- **Permite:** Cualquiera puede crear citas
- **Por qué:** Los usuarios deben poder agendar sin login
- **Riesgo:** Medio - se podría saturar la agenda (considera agregar rate limiting)

### Política 3: Actualización Autenticada
- **Permite:** Solo usuarios con login pueden modificar
- **Por qué:** Solo el admin debe poder cancelar/modificar citas
- **Riesgo:** Bajo - protegido por autenticación

---

## 🚨 Problemas Comunes

### Error: "relation 'appointments' does not exist"
➡️ Ejecuta el SQL de creación de tabla (paso 1)

### Error: "new row violates row-level security policy"
➡️ Verifica que las políticas RLS estén creadas (paso 2)

### No puedo iniciar sesión en `/admin`
➡️ Verifica que el usuario admin esté creado (paso 3)

### Error: "Supabase URL or Key missing"
➡️ Crea el archivo `.env` con tus credenciales (paso 4)

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que completaste todos los pasos en orden
2. Revisa que las credenciales en `.env` sean correctas
3. Asegúrate de que el proyecto de Supabase esté activo
