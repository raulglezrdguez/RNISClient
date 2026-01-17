import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Text, Surface, Icon } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAuth } from '../hooks/useAuth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setInterests } from '../store/slices/interSlice';
import api from '../api/api';

const HomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const dispatch = useDispatch();

  const { username } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadInterests = async () => {
      try {
        const response = await api.get('/Intereses/Listado');
        console.log(response.data);
        dispatch(setInterests(response.data));
      } catch (error) {
        console.error('Error en la carga inicial:', error);
      }
    };

    loadInterests();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Appbar.Header elevated style={{ marginTop: insets.top }}>
        <Appbar.Action icon="account-circle" size={30} onPress={() => {}} />
        <Appbar.Content title={username} />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>

      <View style={styles.content}>
        <Surface style={styles.surface} elevation={2}>
          <TouchableOpacity
            style={styles.touchableArea}
            onPress={() => navigation.navigate('Clients')}
            activeOpacity={0.7}
          >
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
          </TouchableOpacity>
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
    width: '100%',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  touchableArea: {
    padding: 30,
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
