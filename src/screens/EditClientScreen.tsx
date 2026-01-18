import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Appbar,
  Text,
  ActivityIndicator,
  HelperText,
  Icon,
  Avatar,
  Portal,
  Dialog,
  Snackbar,
} from 'react-native-paper';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import api from '../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ClientFormData, clientSchema } from '../utils/validationSchemas';
import { Picker } from '@react-native-picker/picker';
import { InterestItem } from '../store/slices/interSlice';
import dayjs from 'dayjs';
import { launchImageLibrary } from 'react-native-image-picker';

const EditClientScreen = ({ route, navigation }: any) => {
  const { clientId, onUpdate } = route.params;
  const isEdit = !!clientId;
  const { interests } = useSelector((state: RootState) => state.interests);
  const { userid } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(isEdit);
  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [showAffiliationPicker, setShowAffiliationPicker] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      sexo: 'M',
      fNacimiento: dayjs().subtract(20, 'year').toDate(),
      fAfiliacion: dayjs().subtract(1, 'year').toDate(),
      nombre: '',
      apellidos: '',
      identificacion: '',
      telefonoCelular: '',
      otroTelefono: '',
      direccion: '',
      resenaPersonal: '',
      interesesId: '',
      imagen: '',
    },
  });

  const currentImage = useWatch({
    control,
    name: 'imagen',
  });

  const loadClientData = useCallback(async () => {
    setError(null);

    try {
      const response = await api.get(`/Cliente/Obtener/${clientId}`);
      const data = response.data;
      reset({
        ...data,
        fNacimiento: data.fNacimiento ? new Date(data.fNacimiento) : new Date(),
        fAfiliacion: data.fAfiliacion ? new Date(data.fAfiliacion) : new Date(),
      });
    } catch (err) {
      setError('Error obteniendo cliente');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [clientId, reset]);

  useEffect(() => {
    if (isEdit) {
      loadClientData();
    } else {
      reset({
        sexo: 'M',
        fNacimiento: dayjs().subtract(20, 'year').toDate(),
        fAfiliacion: dayjs().subtract(1, 'year').toDate(),
        nombre: '',
        apellidos: '',
        identificacion: '',
        telefonoCelular: '',
        otroTelefono: '',
        direccion: '',
        resenaPersonal: '',
        interesesId: '',
        imagen: '',
      });
    }
  }, [isEdit, loadClientData, reset]);

  const onSubmit = async (data: ClientFormData) => {
    setError(null);

    try {
      const d = {
        id: clientId,
        nombre: data.nombre,
        apellidos: data.apellidos,
        identificacion: data.identificacion,
        celular: data.telefonoCelular,
        otroTelefono: data.otroTelefono,
        direccion: data.direccion,
        fNacimiento: data.fNacimiento.toISOString(),
        fAfiliacion: data.fAfiliacion.toISOString(),
        sexo: data.sexo,
        resennaPersonal: data.resenaPersonal,
        interesFK: data.interesesId,
        usuarioId: userid,
        imagen: currentImage,
      };

      if (isEdit) {
        await api.post(`/Cliente/Actualizar`, d);
      } else {
        await api.post(`/Cliente/Crear`, d);
      }

      onUpdate &&
        onUpdate({
          id: clientId,
          identificacion: data.identificacion,
          nombre: data.nombre,
          apellidos: data.apellidos,
          imagen: data.imagen,
        });
      navigation.goBack();
    } catch (err) {
      setError('Error gestionando cliente');
      console.error((err as Error).message);
    }
  };

  const onRemove = async () => {
    setShowDeleteDialog(false);
    setIsDeleting(true);
    setError(null);

    try {
      console.log('removing', clientId);
      // await api.delete(`/Cliente/Eliminar/${clientId}`);
      navigation.goBack();
    } catch (err) {
      setError('Error al eliminar cliente');
      console.error('Error al eliminar:', (err as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const selectImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5,
      selectionLimit: 1,
    });

    if (result.errorCode === 'permission') {
      console.warn('Permiso denegado');
      return;
    }

    if (result.didCancel) return;

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      const mimeType = asset.type;
      const base64Data = asset.base64;

      const fullBase64String = `data:${mimeType};base64,${base64Data}`;

      setValue('imagen', fullBase64String);
    }
  };

  if (loading) return <ActivityIndicator style={styles.ActivityIndicator} />;

  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={isEdit ? 'Mantenimiento de Cliente' : 'Nuevo Cliente'}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={selectImage} activeOpacity={0.8}>
            {currentImage ? (
              <Avatar.Image size={120} source={{ uri: currentImage }} />
            ) : (
              <Avatar.Icon
                size={120}
                icon="camera-plus"
                style={styles.avatarIcon}
              />
            )}

            <View style={styles.editBadge}>
              <Avatar.Icon
                size={30}
                icon="pencil"
                color="white"
                style={styles.badgeIcon}
              />
            </View>

            <Text style={styles.photoLabel}>Toca para cambiar foto</Text>
            {errors.imagen && (
              <HelperText type="error">{errors.imagen.message}</HelperText>
            )}
          </TouchableOpacity>
        </View>

        <Controller
          control={control}
          name="identificacion"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Identificación *"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              error={!!errors.identificacion}
              style={styles.input}
            />
          )}
        />

        <Controller
          control={control}
          name="nombre"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Nombre *"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              style={styles.inputNombre}
            />
          )}
        />
        <Controller
          control={control}
          name="apellidos"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Apellidos *"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              style={styles.inputApellidos}
            />
          )}
        />

        <View style={styles.pickerContainer}>
          <View style={styles.labelBackground}>
            <Text style={styles.customLabel}>Género *</Text>
          </View>

          <View style={styles.outlinedBorder}>
            <Controller
              control={control}
              name="sexo"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={itemValue => onChange(itemValue)}
                  mode="dropdown"
                  style={styles.pickerNative}
                >
                  <Picker.Item label="Seleccione..." value="" color="#999" />
                  <Picker.Item label="Masculino" value="M" />
                  <Picker.Item label="Femenino" value="F" />
                </Picker>
              )}
            />
          </View>
          {errors.sexo && (
            <HelperText type="error">{errors.sexo.message}</HelperText>
          )}
        </View>

        <View style={styles.pickerContainer}>
          <View style={styles.labelBackground}>
            <Text style={styles.customLabel}>Fecha Nacimiento *</Text>
          </View>

          <Controller
            control={control}
            name="fNacimiento"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  style={styles.outlinedBorder}
                  onPress={() => setShowBirthPicker(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dateContent}>
                    <Text style={styles.dateText}>
                      {value
                        ? value.toLocaleDateString()
                        : 'Seleccione una fecha'}
                    </Text>
                    <Icon source="calendar" size={24} color="#49454F" />
                  </View>
                </TouchableOpacity>

                {showBirthPicker && (
                  <DateTimePicker
                    value={
                      value instanceof Date && !isNaN(value.getTime())
                        ? value
                        : new Date()
                    }
                    mode="date"
                    display={Platform.OS === 'android' ? 'default' : 'spinner'}
                    onChange={(event, selectedDate) => {
                      setShowBirthPicker(false);

                      if (event.type === 'set' && selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                  />
                )}
              </>
            )}
          />
        </View>

        <View style={styles.pickerContainer}>
          <View style={styles.labelBackground}>
            <Text style={styles.customLabel}>Fecha de Afiliación *</Text>
          </View>

          <Controller
            control={control}
            name="fAfiliacion"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  style={styles.outlinedBorder}
                  onPress={() => setShowAffiliationPicker(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dateContent}>
                    <Text style={styles.dateText}>
                      {value
                        ? value.toLocaleDateString()
                        : 'Seleccione una fecha'}
                    </Text>
                    <Icon source="calendar" size={24} color="#49454F" />
                  </View>
                </TouchableOpacity>

                {showAffiliationPicker && (
                  <DateTimePicker
                    value={
                      value instanceof Date && !isNaN(value.getTime())
                        ? value
                        : new Date()
                    }
                    mode="date"
                    display={Platform.OS === 'android' ? 'default' : 'spinner'}
                    onChange={(event, selectedDate) => {
                      setShowAffiliationPicker(false);

                      if (event.type === 'set' && selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                  />
                )}
              </>
            )}
          />
        </View>

        <Controller
          control={control}
          name="telefonoCelular"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Celular *"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              style={styles.inputCelular}
            />
          )}
        />

        <Controller
          control={control}
          name="otroTelefono"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Teléfono *"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              style={styles.inputApellidos}
            />
          )}
        />

        <View style={styles.pickerContainer}>
          <View style={styles.labelBackground}>
            <Text style={styles.customLabel}>Interés *</Text>
          </View>

          <View style={styles.outlinedBorder}>
            <Controller
              control={control}
              name="interesesId"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={itemValue => onChange(itemValue)}
                  mode="dropdown"
                  style={styles.pickerNative}
                >
                  <Picker.Item
                    label="Seleccione un interés..."
                    value=""
                    color="#999"
                  />
                  {interests.map((interes: InterestItem) => (
                    <Picker.Item
                      key={interes.id}
                      label={interes.descripcion}
                      value={interes.id}
                    />
                  ))}
                </Picker>
              )}
            />
          </View>
          {errors.interesesId && (
            <HelperText type="error">{errors.interesesId.message}</HelperText>
          )}
        </View>

        <Controller
          control={control}
          name="direccion"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Direccion *"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              style={styles.inputDireccion}
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
              scrollEnabled={true}
            />
          )}
        />

        <Controller
          control={control}
          name="resenaPersonal"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Reseña *"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              style={styles.inputDireccion}
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
              scrollEnabled={true}
            />
          )}
        />

        <View style={styles.row}>
          {isEdit && (
            <Button
              mode="contained"
              onPress={() => setShowDeleteDialog(true)}
              style={styles.removeBtn}
              loading={isDeleting}
              disabled={isDeleting}
            >
              {'ELIMINAR'}
            </Button>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.submitBtn}
          >
            {isEdit ? 'GUARDAR' : 'CREAR'}
          </Button>
        </View>
      </ScrollView>

      <Snackbar visible={!!error} onDismiss={() => setError(null)}>
        {error}
      </Snackbar>

      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}
        >
          <Dialog.Icon icon="alert-circle" color="red" />
          <Dialog.Title style={{ textAlign: 'center' }}>
            ¿Eliminar cliente?
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyLarge">
              Esta acción no se puede deshacer. Se borrarán todos los datos
              asociados a este cliente.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button
              onPress={onRemove}
              textColor="red"
              labelStyle={{ fontWeight: 'bold' }}
            >
              Sí, eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  ActivityIndicator: { flex: 1 },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  avatarIcon: { backgroundColor: '#ccc' },
  photoLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  badgeIcon: {
    backgroundColor: '#6200ee',
  },
  inputNombre: { marginBottom: 15, flex: 1 },
  inputApellidos: { marginBottom: 15, flex: 1 },
  inputCelular: { marginTop: 20, marginBottom: 15, flex: 1 },
  inputDireccion: {
    marginTop: 20,
    marginBottom: 15,
    flex: 1,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 20 },
  input: { marginBottom: 15 },
  pickerContainer: {
    marginTop: 15,
    marginBottom: 5,
    position: 'relative',
  },
  outlinedBorder: {
    borderWidth: 1,
    borderColor: '#79747E',
    borderRadius: 4,
    height: 56,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  labelBackground: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  customLabel: {
    fontSize: 12,
    color: '#49454F',
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%',
  },
  dateText: {
    fontSize: 16,
    color: '#1C1B1F',
  },
  pickerNative: {
    marginLeft: 4,
    color: '#1C1B1F',
  },
  label: {
    fontSize: 12,
    color: '#6200ee',
    marginLeft: 10,
    marginBottom: -5,
    zIndex: 1,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#79747e', // Color gris de los outlines de Paper
    borderRadius: 5,
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  errorText: {
    color: '#ba1a1a',
    fontSize: 12,
    marginLeft: 10,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitBtn: { paddingVertical: 8, borderRadius: 5 },
  removeBtn: { backgroundColor: 'red', paddingVertical: 8, borderRadius: 5 },
});

export default EditClientScreen;
