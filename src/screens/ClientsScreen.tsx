import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
  Appbar,
  Surface,
  Icon,
  TextInput,
  Button,
} from 'react-native-paper';
import api from '../api/api';
import { Client } from '../types/client';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useAuth } from '../hooks/useAuth';

type SearchTypes = 'nombre' | 'identificacion' | '';

const ClientsScreen = ({ navigation }: any) => {
  const { logout } = useAuth();
  const { userid } = useSelector((state: RootState) => state.auth);

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchTypes>('');

  const onRefresh = () => {
    setRefreshing(true);
    handleSearch(searchType);
  };

  const handleSearch = useCallback(
    async (type: SearchTypes) => {
      setLoading(true);
      setSearchType(type);

      try {
        const payload = {
          identificacion: type === 'identificacion' ? searchQuery : '',
          nombre: type === 'nombre' ? searchQuery : '',
          usuarioId: userid,
        };

        const response = await api.post('/Cliente/Listado', payload);
        setClients(response.data);
      } catch (error) {
        console.error('Error en la búsqueda:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [searchQuery, userid],
  );

  useEffect(() => {
    const loadInitialClients = async () => {
      setLoading(true);
      try {
        const payload = {
          identificacion: '',
          nombre: '',
          usuarioId: userid,
        };
        const response = await api.post('/Cliente/Listado', payload);
        setClients(response.data);
      } catch (error) {
        console.error('Error en la carga inicial:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialClients();
  }, [userid]);

  const renderItem = ({ item }: { item: Client }) => (
    <Surface style={styles.surface} elevation={2}>
      <TouchableOpacity
        style={styles.touchableArea}
        onPress={() => navigation.navigate('EditClient', { clientId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.innerContent}>
          <View style={styles.iconContainer}>
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
          <View style={styles.iconContainer}>
            <Icon size={42} source="chevron-right" color="black" />
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

      <View style={styles.searchSection}>
        <TextInput
          label="Buscar..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" />}
        />
        <View style={styles.buttonRow}>
          <Button
            mode={searchType === 'nombre' ? 'contained' : 'outlined'}
            onPress={() => handleSearch('nombre')}
            style={styles.flexButton}
            icon={searchType === 'nombre' ? 'check' : undefined}
            buttonColor={searchType === 'nombre' ? '#333' : undefined}
            textColor={searchType === 'nombre' ? '#fff' : '#333'}
          >
            Nombre
          </Button>
          <Button
            mode={searchType === 'identificacion' ? 'contained' : 'outlined'}
            onPress={() => handleSearch('identificacion')}
            style={[styles.flexButton, styles.marginLeft]}
            icon={searchType === 'identificacion' ? 'check' : undefined}
            buttonColor={searchType === 'identificacion' ? '#333' : undefined}
            textColor={searchType === 'identificacion' ? '#fff' : '#333'}
          >
            Identificación
          </Button>
        </View>
      </View>

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
  searchSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: { marginBottom: 15 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexButton: {
    flex: 1,
  },
  marginLeft: { marginLeft: 10 },
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
