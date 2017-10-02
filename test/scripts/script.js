window.onload = function() {
    var target = document.getElementById("todo-list");
    var todoList = new TodoModule();
    todoList.init(target);
};
