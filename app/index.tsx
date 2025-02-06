import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';

// 배경 이미지 배열
const backgrounds = [
  require('../assets/images/background1.jpg'),
  require('../assets/images/background2.jpg'),
  require('../assets/images/background3.jpg'),
  require('../assets/images/background4.jpg'),
  require('../assets/images/background5.jpg'),
];

// 명언 배열
const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  }
];

// 시간대별 인사말
const getGreeting = (hour: number) => {
  if (hour >= 5 && hour < 12) {
    return [
      "Good morning! Ready to start the day?",
      "Rise and shine!",
      "Morning! Let's make today great!",
      "Hello! The day is yours.",
    ];
  } else if (hour >= 12 && hour < 18) {
    return [
      "Good afternoon! Keep up the good work!",
      "Having a productive day?",
      "Afternoon! Stay focused!",
      "The day is still young!",
    ];
  } else {
    return [
      "Good evening! Time to wind down.",
      "Evening! Reflect on your day.",
      "Good evening! Plan for tomorrow.",
      "Evening! You did well today.",
    ];
  }
};

// Todo 타입 정의
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function HomeScreen() {
  const [time, setTime] = useState(new Date());
  const [currentBackground, setCurrentBackground] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(
    Math.floor(Math.random() * quotes.length)
  );
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 배경 이미지 변경 (30초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground(prev => (prev + 1) % backgrounds.length);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // 명언 변경 (1시간마다)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => {
        let next;
        do {
          next = Math.floor(Math.random() * quotes.length);
        } while (next === prev && quotes.length > 1);
        return next;
      });
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  // 인사말 변경 (15분마다)
  useEffect(() => {
    const interval = setInterval(() => {
      const greetings = getGreeting(time.getHours());
      setCurrentGreeting(prev => (prev + 1) % greetings.length);
    }, 900000);

    return () => clearInterval(interval);
  }, []);

  const currentGreetings = getGreeting(time.getHours());

  // 할 일 추가
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false
      }]);
      setNewTodo('');
    }
  };

  // 할 일 완료/미완료 토글
  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 할 일 삭제
  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <ImageBackground 
      source={backgrounds[currentBackground]}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>
            {time.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </Text>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.greeting}>
            {currentGreetings[currentGreeting]}
          </Text>
          
          <View style={styles.todoContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={newTodo}
                onChangeText={setNewTodo}
                placeholder="Add a new task..."
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
                onSubmitEditing={addTodo}
              />
            </View>
            
            <ScrollView style={styles.todoList}>
              {todos.map(todo => (
                <View key={todo.id} style={styles.todoItem}>
                  <TouchableOpacity
                    style={styles.todoCheckbox}
                    onPress={() => toggleTodo(todo.id)}
                  >
                    {todo.completed && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                  
                  <Text style={[
                    styles.todoText,
                    todo.completed && styles.todoCompleted
                  ]}>
                    {todo.text}
                  </Text>
                  
                  <TouchableOpacity
                    onPress={() => deleteTodo(todo.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.quote}>
            "{quotes[currentQuote].text}"
          </Text>
          <Text style={styles.author}>
            - {quotes[currentQuote].author}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 어두운 오버레이
    padding: 20,
  },
  timeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    color: 'white',
    fontSize: 120,
    fontWeight: '200',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    color: 'white',
    fontSize: 40,
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center',
  },
  question: {
    color: 'white',
    fontSize: 24,
    fontWeight: '300',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  quote: {
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 8,
  },
  author: {
    color: 'white',
    fontSize: 14,
    fontWeight: '300',
    opacity: 0.8,
  },
  todoContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  todoList: {
    maxHeight: 200,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 5,
  },
  todoCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
  },
  todoText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  todoCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
    opacity: 0.7,
  },
}); 