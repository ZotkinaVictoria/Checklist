import React from 'react';
import { Feather } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Keyboard,
} from 'react-native';
import { globalStyles } from '../styles';
import { Swipeable } from 'react-native-gesture-handler';
import SwipeableItem from './SwipeableItem';

export default class TodoList extends React.Component {
  state = {
    addingTodo: false,
    editingIndex: null,
    todoText: '',
  };

  AddTodo = () => {
    this.setState({ addingTodo: true }, () => {
      this.props.textFocus.current.focus();
    });

    Keyboard.dismiss();
  };

  createTodo = async () => {
    let list = this.props.list;
    list.todos.push({ title: this.state.todoText, completed: false });

    this.props.list.completed = false;

    this.props.updateList(list);
    await this.props.saveList(list);

    this.setState({ todoText: '', addingTodo: false });
  };

  toggleChecklistCompleted = async (index) => {
    let list = this.props.list;
    list.todos[index].completed = !list.todos[index].completed;

    if (this.props.list.todos.every((task) => task.completed)) {
      this.props.list.completed = true;
    }

    if (list.todos[index].completed == false) {
      this.props.list.completed = false;
    }

    // Сохранить изменения
    this.props.updateList(list);
    await this.props.saveList(list);
  };

  renderItemInput = ({ onSubmitEditing }) => {
    const list = this.props.list;
    return (
      <View
        style={[
          globalStyles.todoContainer,
          { backgroundColor: `${list.color}BF` },
        ]}>
        <Feather name="square" style={globalStyles.icon} />
        <TextInput
          ref={this.props.textFocus}
          style={styles.itemText}
          placeholder="Элемент..."
          placeholderTextColor="#172D4C"
          value={this.state.todoText}
          maxLength={32}
          onChangeText={(text) => this.setState({ todoText: text })}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    );
  };

  startEditing = (index, todo) => {
    console.log(this.state.editingIndex);
    this.setState({ editingIndex: index, todoText: todo.title });
    console.log(
      'Editing Index: ' + this.state.editingIndex + ' / Index: ' + index
    );
    console.log('Todo Text: ' + todo.title);
    console.log('Todo: ' + todo);
  };

  saveEditedTodo = async () => {
    let list = this.props.list;
    const { editingIndex, todoText } = this.state;
    list.todos[editingIndex].title = todoText;

    this.setState({ editingIndex: null, todoText: '' });

    this.props.updateList(list);
    await this.props.saveList(list);
  };

  deleteTodo = async (index) => {
    console.log('Удаление элемента списка: ' + index);
    let list = { ...this.props.list };

    // Удалить элемент списка
    list.todos.splice(index, 1);

    this.props.updateList(list);
    await this.props.saveList(list);
  };

  deleteCategory = async () => {
    console.log('Попытка удалить категорию');
    const { list, lists } = this.props;
    console.log('Текущий список:', lists);
    console.log('Удаление категории с помощью id:', list.id);

    let updatedLists = lists.filter((item) => item.id !== list.id);
    console.log('Обновлённые списки:', updatedLists);

    updatedLists = updatedLists.map((item, idx) => ({
      ...item,
      id: idx + 1,
    }));

    await this.props.saveList(updatedLists);
    this.props.loadData();

    console.log('Категория удалена');
  };

  renderTodo = (todo, index) => {
    const list = this.props.list;
    const { editingIndex } = this.state;
    return (
      <View>
        {editingIndex === index ? (
          this.renderItemInput({ onSubmitEditing: this.saveEditedTodo })
        ) : (
          <Swipeable
            renderRightActions={(_, dragX) => (
              <SwipeableItem
                onEdit={() => this.startEditing(index, todo)}
                onDelete={() => this.deleteTodo(index)}
              />
            )}>
            <TouchableOpacity
              style={[
                globalStyles.todoContainer,
                { backgroundColor: `${list.color}BF` },
              ]}
              onPress={() => this.toggleChecklistCompleted(index)}>
              <TouchableOpacity
                onPress={() => this.toggleChecklistCompleted(index)}>
                <Feather
                  name={todo.completed ? 'check-square' : 'square'}
                  style={globalStyles.icon}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.itemText,
                  {
                    textDecorationLine: todo.completed
                      ? 'line-through'
                      : 'none',
                  },
                  { opacity: todo.completed ? 0.5 : 1 },
                ]}
                numberOfLines={1}>
                {todo.title}
              </Text>
            </TouchableOpacity>
          </Swipeable>
        )}
      </View>
    );
  };

  render() {
    const { list, renderCategory, addingCategoryId } = this.props;
    return (
      <View>
        {addingCategoryId === list.id ? (
          renderCategory(list, true)
        ) : (
          <Swipeable
            renderRightActions={(_, dragX) => (
              <SwipeableItem
                onEdit={() => this.props.startCategoryEditing(list.id)}
                onDelete={() => this.deleteCategory()}
                isCategory={true}
              />
            )}>
            {renderCategory(list)}
          </Swipeable>
        )}
        <View>
          {list.opened && (
            <>
              <FlatList
                data={list.todos}
                renderItem={({ item, index }) => this.renderTodo(item, index)}
                keyExtractor={(item) => item.title}
              />
              {this.state.addingTodo ? (
                this.renderItemInput({ onSubmitEditing: this.createTodo })
              ) : (
                <TouchableOpacity
                  style={[
                    styles.addItem,
                    { backgroundColor: `${list.color}20` },
                  ]}
                  onPress={this.AddTodo}>
                  <Feather name="plus" size={22} color="#172D4C" />
                  <Text style={styles.addItemText}>Добавить элемент</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemText: {
    paddingLeft: 6,
    fontSize: 16,
    paddingBottom: 4,
    width: '85%',
    outlineStyle: 'none',
  },
  addItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 8,
  },
  addItemText: {
    opacity: 0.8,
    fontWeight: '600',
    paddingBottom: 2,
    paddingLeft: 2,
    color: '#172D4C',
  },
});
