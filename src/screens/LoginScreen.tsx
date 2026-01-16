import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  TextInput,
  Button,
  Snackbar,
  Text,
  Checkbox,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { loginSchema, LoginFormData } from '../utils/validationSchemas';

import LogoSvg from '../assets/images/logo.svg';
import { useAuth } from '../hooks/useAuth';
import { storage } from '../storage/mmkv';

const LoginScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { login, loading, error, setError } = useAuth();

  const [secureTextEntry, setSecureTextEntry] = useState(false);

  const savedUsername = storage.getString('remembered_username');
  const [rememberMe, setRememberMe] = useState(!!savedUsername);

  const [successVisible, setSuccessVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (route.params?.successMsg) {
      setSuccessMsg(route.params.successMsg);
      setSuccessVisible(true);

      navigation.setParams({ successMsg: undefined });
    }
  }, [route.params?.successMsg, navigation]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: savedUsername || '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data, rememberMe);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.logoContainer}>
        <LogoSvg width={200} height={200} />
      </View>

      <Text variant="headlineMedium" style={styles.title}>
        ¡Bienvenido!
      </Text>

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Usuario *"
            value={value}
            onChangeText={onChange}
            error={!!errors.username}
            mode="outlined"
            style={styles.input}
            keyboardType="default"
            autoCapitalize="none"
          />
        )}
      />
      {errors.username && (
        <Text style={styles.errorText}>{errors.username.message}</Text>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Contraseña *"
            value={value}
            onChangeText={onChange}
            error={!!errors.password}
            mode="outlined"
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye' : 'eye-off'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
                forceTextInputFocus={false}
              />
            }
          />
        )}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setRememberMe(!rememberMe)}
        activeOpacity={0.7}
      >
        <Checkbox
          status={rememberMe ? 'checked' : 'unchecked'}
          onPress={() => setRememberMe(!rememberMe)}
          color="#6200ee"
        />
        <Text style={styles.checkboxLabel}>Recordarme</Text>
      </TouchableOpacity>

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        style={styles.button}
      >
        INICIAR SESIÓN
      </Button>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tiene una cuenta?</Text>
      </View>

      <TouchableOpacity
        style={styles.registerContainer}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>
          <Text style={styles.registerLink}>Regístrese</Text>
        </Text>
      </TouchableOpacity>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={3000}
        action={{ label: 'Cerrar', onPress: () => setError(null) }}
      >
        {error}
      </Snackbar>

      <Snackbar
        visible={successVisible}
        onDismiss={() => setSuccessVisible(false)}
        duration={4000}
        style={styles.successSnackbar}
        action={{
          label: 'OK',
          onPress: () => setSuccessVisible(false),
          textColor: 'white',
        }}
      >
        {successMsg}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: { textAlign: 'center', marginBottom: 30, fontWeight: 'bold' },
  input: { marginBottom: 10 },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginLeft: -8, // Ajuste para alinear con el borde del input
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  button: {
    marginTop: 20,
    paddingVertical: 5,
    borderRadius: 5,
  },
  registerContainer: {
    marginTop: 25,
    marginLeft: 10,
    alignItems: 'flex-start',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#6200ee',
    fontWeight: 'bold',
    textDecorationLine: 'none',
  },
  errorText: { color: 'red', fontSize: 12, marginBottom: 10, marginLeft: 5 },
  successSnackbar: {
    backgroundColor: '#4CAF50', // Verde estándar de éxito
  },
});

export default LoginScreen;
