import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Animação de entrada padrão das telas: fade + leve subida.
// Retorna um estilo pronto para passar a um Animated.View.
export function useEntradaAnimada() {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return { opacity, transform: [{ translateY }] };
}
