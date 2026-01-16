import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Text, Surface, Icon } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAuth } from '../hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  // Extraemos los datos del store actualizados
  const { username } = useSelector((state: RootState) => state.auth);

  return (
    <View style={styles.container}>
      <Appbar.Header elevated style={{ marginTop: insets.top }}>
        <Appbar.Action icon="account-circle" size={30} onPress={() => {}} />
        <Appbar.Content title={username} />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>

      <View style={styles.content}>
        <Surface style={styles.surface} elevation={2}>
          <View style={styles.innerContent}>
            <View style={styles.icon}>
              <Icon size={42} source="notebook" color="black" />
            </View>
            <View style={styles.innerData}>
              <Text variant="headlineMedium" style={styles.usernameText}>
                Clientes
              </Text>
              <Text variant="bodySmall" style={styles.idText}>
                Administrar clientes
              </Text>
            </View>
          </View>
        </Surface>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  surface: {
    padding: 30,
    width: '100%',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 20,
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  innerData: { flexDirection: 'column' },
  usernameText: {
    fontWeight: 'bold',
    color: '#333',
  },
  idText: {
    marginTop: 10,
    color: '#666',
  },
});

export default HomeScreen;
