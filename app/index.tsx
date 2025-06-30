import { View, Alert, Animated, Text, Easing } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [statusPortao, setStatusPortao] = useState(0);
  const [showIcon, setShowIcon] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const API_URL = 'http://localhost:3000/portao';



    async function buscaStatus() {
    try {
      const response = await fetch(`${API_URL}`)
      const data = await response.json()
      console.log(data.status);
      
      setStatusPortao(data.status)
    } catch (error) {
      Alert.alert("erro", "Não foi possiver conectar ao servidor ")

    }
  }
    buscaStatus()
  
  
  const iniciarAnimacao = () => {
    setShowIcon(true);
    animationRef.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  };

  const pararAnimacao = () => {
    setTimeout(() => {
      setShowIcon(false);
      spinValue.setValue(0);
      animationRef.current?.stop();
    }, 2000);
  };

  async function alterarStatus(novoStatus: number) {

    console.log(novoStatus);
    try {
      const response = await fetch(`${API_URL}/altera-status`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ novoStatus })
      });

      if (!response.ok) throw new Error('Falha na requisição');

      const data = await response.json();
      setStatusPortao(novoStatus === 1);
      Alert.alert(`Portão ${novoStatus === 1 ? 'aberto' : 'fechado'}!!`);

      iniciarAnimacao();
      pararAnimacao();

    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Não foi possível alterar o status');
    }
  }

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg']
  });

  useEffect(() => {
    return () => {
      animationRef.current?.stop();
    };
  }, []);

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Text
      style={{ 
        fontSize: 24, 
        fontWeight: 'bold',
        color: statusPortao === 1 ? 'green' : 'red',
        marginBottom: 30
      }}
      >{statusPortao === 1 ? "Aberto" : "Fechado"}</Text>
      {showIcon && (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <FontAwesome name="undo" size={40} color="black" />
        </Animated.View>
      )}

      <View style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 30,
      }}>
        <FontAwesome.Button
          style={{ width: 100 }}
          name="lock"
          backgroundColor='red'
          onPress={() => alterarStatus(0)}
        >
          Fechar
        </FontAwesome.Button>

        <FontAwesome.Button
          style={{ width: 100, marginLeft: 10 }}
          name="unlock"
          backgroundColor='green'
          onPress={() => alterarStatus(1)}
        >
          Abrir
        </FontAwesome.Button>
      </View>
    </View>
  );
}