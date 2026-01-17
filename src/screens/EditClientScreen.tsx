import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  TextInput,
  Button,
  Appbar,
  Text,
  ActivityIndicator,
  HelperText,
  Icon,
} from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import api from '../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ClientFormData, clientSchema } from '../utils/validationSchemas';
import { Picker } from '@react-native-picker/picker';
import { InterestItem } from '../store/slices/interSlice';
import dayjs from 'dayjs';

const EditClientScreen = ({ route, navigation }: any) => {
  const { clientId } = route.params;
  const isEdit = !!clientId;
  const { interests } = useSelector((state: RootState) => state.interests);
  const { userid } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(isEdit);
  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [showAffiliationPicker, setShowAffiliationPicker] = useState(false);

  const {
    control,
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
    },
  });

  const loadClientData = useCallback(async () => {
    try {
      const response = await api.get(`/Cliente/Obtener/${clientId}`);
      const data = response.data;
      console.log(data);
      reset({
        ...data,
        fNacimiento: data.fNacimiento ? new Date(data.fNacimiento) : new Date(),
        fAfiliacion: data.fAfiliacion ? new Date(data.fAfiliacion) : new Date(),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [clientId, reset]);

  useEffect(() => {
    if (isEdit) {
      loadClientData();
    }
  }, [isEdit, loadClientData]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (isEdit) {
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
          imagen: '',
        };
        console.log(d);
        await api.post(`/Cliente/Actualizar`, d);
      } else {
        await api.post(`/Cliente/Crear`, {
          ...data,
          interesFK: data.interesesId,
          usuarioId: userid,
        });
      }

      navigation.goBack();
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const onRemove = async () => {
    console.log('removing', clientId);
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
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowBirthPicker(false);

                      if (event.type === 'set' && selectedDate) {
                        console.log(
                          'Fecha confirmada:',
                          selectedDate.toLocaleDateString(),
                        );
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
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowAffiliationPicker(false);

                      if (event.type === 'set' && selectedDate) {
                        console.log(
                          'Fecha confirmada:',
                          selectedDate.toLocaleDateString(),
                        );
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
              onPress={() => onRemove()}
              style={styles.removeBtn}
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
    </View>
  );
};

const styles = StyleSheet.create({
  ActivityIndicator: { flex: 1 },
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
  inputContainer: {
    marginBottom: 15,
  },
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
  radioRow: { flexDirection: 'row', marginBottom: 15 },
  radioItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  submitBtn: { paddingVertical: 8, borderRadius: 5 },
  removeBtn: { backgroundColor: 'red', paddingVertical: 8, borderRadius: 5 },
});

export default EditClientScreen;
