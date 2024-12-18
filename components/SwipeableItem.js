import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function SwipeableItem({
  onEdit,
  onDelete,
  isCategory = false,
}) {
  return (
    <Animated.View style={{ flexDirection: 'row' }}>
      {/* Настройка категории */}

      {/* Редактировать */}
      <TouchableOpacity onPress={onEdit}>
        <Animated.View
          style={[styles.swipeButton, { backgroundColor: '#58B2F7' }]}>
          <Feather name="edit-2" style={{ color: '#172D4C', fontSize: 30 }} />
        </Animated.View>
      </TouchableOpacity>

      {/* Удалить */}
      <TouchableOpacity onPress={onDelete}>
        <Animated.View
          style={[styles.swipeButton, { backgroundColor: '#255394' }]}>
          <Feather name="trash-2" style={{ color: 'white', fontSize: 30 }} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  swipeButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderRadius: 10,
    marginBottom: 5,
    marginLeft: 5,
    opacity: 1,
  },
});
