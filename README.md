# Sitio Web para Abogado - José Alfredo Miranda Bello

Landing page profesional para abogado especialista en derecho migratorio con sistema de agendamiento de citas.

---

## 🚀 Características del Proyecto

- **Landing Page Vertical** con efecto parallax
- **Sistema de Citas** con calendario interactivo
- **Panel de Administración** para gestionar citas
- **Integración con Supabase** para base de datos y autenticación
- **Diseño Profesional** con paleta azul marino y dorado

## ⚙️ Configuración de Supabase

### 1. Variables de Entorno

**IMPORTANTE:** Crea un archivo `.env` en la raíz del proyecto con tus credenciales:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

📍 Encuentra estas credenciales en: `https://supabase.com/dashboard/project/_/settings/api`

### 2. Crear Tabla en Supabase

Ejecuta este SQL en el Editor SQL de tu proyecto Supabase:

```sql
-- Crear tabla de citas
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

-- Habilitar RLS
alter table appointments enable row level security;

-- Política para lectura pública (ver disponibilidad)
create policy "Permitir lectura pública de citas"
  on appointments for select
  using (true);

-- Política para inserción pública (agendar citas)
create policy "Permitir inserción pública de citas"
  on appointments for insert
  with check (true);

-- Política para actualización solo autenticados
create policy "Permitir actualización a usuarios autenticados"
  on appointments for update
  using (auth.role() = 'authenticated');
```

### 3. Crear Usuario Administrador

1. En Supabase: Authentication > Users
2. Crea un nuevo usuario con email y contraseña
3. Este usuario podrá acceder a `/admin`

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Hero.tsx           # Sección principal con parallax
│   ├── Services.tsx       # Servicios del abogado
│   ├── About.tsx          # Biografía
│   ├── Footer.tsx         # Pie de página
│   ├── Calendar.tsx       # Calendario de citas
│   └── AppointmentForm.tsx # Formulario
├── pages/
│   ├── Index.tsx          # Landing page
│   ├── Citas.tsx          # Sistema de citas
│   └── Admin.tsx          # Panel admin
├── contexts/
│   └── AuthContext.tsx    # Autenticación
└── integrations/supabase/ # Cliente Supabase
```

## 🎨 Personalización

### Editar Textos
- **Servicios:** `src/components/Services.tsx`
- **Biografía:** `src/components/About.tsx`
- **Hero:** `src/components/Hero.tsx`

### Cambiar Foto del Abogado
En `src/components/About.tsx`, reemplaza:
```tsx
src="TU_URL_AQUI"
```

### Horarios Disponibles
En `src/components/Calendar.tsx`:
```tsx
const availableTimes = ['09:00', '10:00', ...];
```

## 📱 Rutas

- `/` - Landing page
- `/citas` - Agendar citas
- `/admin` - Panel administrativo (requiere login)

---

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/01fd057a-e9a7-4946-be80-5115f0c4c4ba

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/01fd057a-e9a7-4946-be80-5115f0c4c4ba) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/01fd057a-e9a7-4946-be80-5115f0c4c4ba) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
