import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const { username } = useSelector((state: RootState) => state.auth);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Text variant="headlineSmall" style={styles.userName}>
            {username}
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={() => dispatch(logout())}
        style={styles.logoutBtn}
        icon="logout"
      >
        Cerrar Sesión
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  card: { padding: 10, elevation: 4 },
  content: { alignItems: 'center' },
  userName: { marginTop: 15, fontWeight: 'bold' },
  logoutBtn: { marginTop: 30 },
});

export default HomeScreen;
