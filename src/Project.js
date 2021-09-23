export default class Project {
  constructor(title) {
      this.title = title;
      this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  getTodo(todoTitle) {
    return this.todos.find((todo) => todo.title === todoTitle)
  }

  getTodos() {
    return this.todos;
  }

  removeTodo(todoIndex) {
      this.todos.splice(todoIndex, 1);
  }

  changeTitle(title) {
      this.title = title;
  }
}