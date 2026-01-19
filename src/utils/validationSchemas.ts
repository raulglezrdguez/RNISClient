import { z } from 'zod';

const passwordValidation = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(20, 'La contraseña no puede exceder los 20 caracteres')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número');

const base64Regex =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

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
  sexo: z.string().min(1, 'Seleccione el sexo'),
  fNacimiento: z.date({ error: 'Fecha de nacimieto requerida' }),
  fAfiliacion: z.date({ error: 'Fecha de afiliación requerida' }),
  telefonoCelular: z.string().trim().min(1, 'Teléfono celular requerido'),
  otroTelefono: z.string().trim().min(1, 'Otro teléfono requerido'),
  direccion: z.string().trim().min(1, 'Dirección requerida'),
  resenaPersonal: z.string().trim().min(1, 'Reseña personal requerida'),
  interesesId: z.string().min(1, 'Seleccione un interés'),
  imagen: z
    .string()
    .nullable()
    .refine(
      val => {
        if (!val) return true;

        const base64Data = val.includes(',') ? val.split(',')[1] : val;

        return base64Regex.test(base64Data);
      },
      {
        message: 'La imagen no tiene un formato Base64 válido',
      },
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
