import { z } from 'zod';

const passwordValidation = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(20, 'La contraseña no puede exceder los 20 caracteres')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número');

export const loginSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es obligatorio'),
  password: passwordValidation,
});

export const registerSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  email: z.email('Email no válido').min(1, 'El correo es obligatorio'),
  password: passwordValidation,
});

export const clientSchema = z.object({
  nombre: z.string().min(1, 'Requerido'),
  apellidos: z.string().min(1, 'Requerido'),
  identificacion: z.string().min(1, 'Requerido'),
  sexo: z.string(),
  fNacimiento: z.date(),
  fAfiliacion: z.date(),
  telefonoCelular: z.string(),
  otroTelefono: z.string(),
  direccion: z.string(),
  resenaPersonal: z.string(),
  interesesId: z.string(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
