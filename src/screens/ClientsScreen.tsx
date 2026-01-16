import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import {
  Card,
  Text,
  Avatar,
  ActivityIndicator,
  Appbar,
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

  const avatarItem = (props: { item: Client }) => {
    return <Avatar.Icon {...props} icon="account" style={styles.avatar} />;
  };

  const renderItem = ({ item }: { item: Client }) => (
    <Card style={styles.card} elevation={1}>
      <Card.Title
        title={`${item.nombre} ${item.apellidos}`}
        subtitle={`ID: ${item.identificacion}`}
        left={avatarItem.bind(null, { item })}
      />
    </Card>
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
  listContent: { padding: 10, paddingBottom: 20 },
  card: { marginBottom: 10, backgroundColor: '#fff' },
  avatar: { backgroundColor: '#6200ee' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 10, color: '#666' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
});

export default ClientsScreen;
