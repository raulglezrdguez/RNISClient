import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  //   Card,
  Text,
  //   Avatar,
  ActivityIndicator,
  Appbar,
  Surface,
  Icon,
} from 'react-native-paper';
import api from '../api/api';
import { Client } from '../types/client';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAuth } from '../hooks/useAuth';

const ClientsScreen = ({ navigation }: any) => {
  const { logout } = useAuth();
  const { userid } = useSelector((state: RootState) => state.auth);

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClients = useCallback(async () => {
    try {
      const response = await api.post('/Cliente/Listado', {
        identificacion: '',
        nombre: '',
        usuarioId: userid,
      });
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener clientes', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userid, setClients]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  const renderItem = ({ item }: { item: Client }) => (
    <Surface style={styles.surface} elevation={2}>
      <TouchableOpacity
        style={styles.touchableArea}
        onPress={() => console.log('Cliente seleccionado:', item.id)} // Aquí irá la navegación a detalles
        activeOpacity={0.7}
      >
        <View style={styles.innerContent}>
          <View style={styles.iconContainer}>
            {/* Usamos el icono de usuario para mantener la consistencia */}
            <Icon size={42} source="account-circle" color="black" />
          </View>
          <View style={styles.innerData}>
            <Text variant="titleLarge" style={styles.clientNameText}>
              {item.nombre} {item.apellidos}
            </Text>
            <Text variant="bodySmall" style={styles.idText}>
              ID: {item.identificacion}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.Action
          icon="home"
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver al inicio"
        />
        <Appbar.Content title="Consulta de Clientes" />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator animating={true} size="large" />
          <Text style={styles.loaderText}>Cargando clientes...</Text>
        </View>
      ) : (
        <FlatList
          data={clients}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron clientes.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { padding: 20, paddingBottom: 20 },
  surface: {
    marginBottom: 15,
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  touchableArea: {
    padding: 20,
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 20,
  },
  innerData: {
    flexDirection: 'column',
    flex: 1,
  },
  clientNameText: {
    fontWeight: 'bold',
    color: '#333',
  },
  idText: {
    marginTop: 5,
    color: '#666',
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 10, color: '#666' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
});

export default ClientsScreen;
