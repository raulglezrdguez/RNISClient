import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerSchema, RegisterFormData } from '../utils/validationSchemas';
import { useAuth } from '../hooks/useAuth';
import LogoSvg from '../assets/images/logo.svg';

const RegisterScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { register, loading, error, setError } = useAuth();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  const onRegister = async (data: RegisterFormData) => {
    const success = await register(data);

    if (success) {
      navigation.navigate('Login', {
        successMsg: 'Usuario creado correctamente',
      });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + 40,
        },
      ]}
    >
      <View style={styles.logoContainer}>
        <LogoSvg width={120} height={120} />
      </View>

      <Text variant="headlineMedium" style={styles.labelRegistro}>
        Registro
      </Text>

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Nombre Usuario *"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            error={!!errors.username}
            // left={<TextInput.Icon icon="account" />}
            style={styles.input}
          />
        )}
      />
      {errors.username && (
        <Text style={styles.errorText}>{errors.username.message}</Text>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Correo electrónico *"
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            value={value}
            onChangeText={onChange}
            error={!!errors.email}
            // left={<TextInput.Icon icon="email" />}
            style={styles.input}
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Contraseña *"
            mode="outlined"
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChange}
            error={!!errors.password}
            autoCapitalize="none"
            autoCorrect={false}
            // left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye' : 'eye-off'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
            style={styles.input}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.btnCancelar}
        >
          CANCELAR
        </Button>

        <Button
          mode="contained"
          onPress={handleSubmit(onRegister)}
          loading={loading}
          style={styles.btnRegistrar}
        >
          REGISTRARME
        </Button>
      </View>

      <Snackbar visible={!!error} onDismiss={() => setError(null)}>
        {error}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#fff',
    flex: 1,
  },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  labelRegistro: {
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  input: { marginBottom: 5 },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 24,
  },
  btnRegistrar: { paddingVertical: 5, borderWidth: 1, borderRadius: 5 },
  btnCancelar: {
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#303030',
  },
});

export default RegisterScreen;
