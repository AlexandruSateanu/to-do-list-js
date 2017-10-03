function TodoModule() {
    /* Model - module for storing the list */
    function model() {
        var list = [];

        function getList() {
            return list;
        }

        function addTodo(todoName) {
            list.push({
                todoName: todoName,
                completed: false
            });
        }

        function deleteTodo(position) {
            list.splice(position, 1);
        }

        function editTodo(position, newTodoName) {
            list[position].todoName = newTodoName;
        }

        return {
            getList: getList,
            addTodo: addTodo,
            deleteTodo: deleteTodo,
            editTodo: editTodo
        };
    }

    /* initialize a model */
    var todoListModel = model();
    var todoList = todoListModel.getList();

    var view = {
        /* Mustache.js template location */
        template: document.getElementById("todo-template").innerHTML,

        /* Location for appending todos */
        location: function() {
            return document.getElementById("todo-list-items");
        },

        /* add the  UI elements when loading the module. Adds input field and list container */
        createUI: function(target, addHandler) {
            var input = document.createElement("input");
            input.type = "text";
            input.name = "add";
            input.placeholder = "What should we do next?";
            input.id = "enter-todo";
            input.classList.add("text-input");

            target.innerHTML = "";

            target.appendChild(input);

            var listContainer = document.createElement("ul");
            listContainer.id = "todo-list-items";

            target.appendChild(listContainer);

            addHandler(input);
        },

        /* add event handler for the input field which adds todos. 
        Passed as parameter to createUI function */
        addInputHandler: function(input) {
            input.addEventListener('keypress', function(e) {
                var key = e.which || e.keyCode;
                if (key === 13) {
                    controller.addTodo(input.value);
                    input.value = "";
                }
            });
        },

        /* function for initializing the view */
        initView: function(target) {
            this.createUI(target, this.addInputHandler);
        },

        /*
        // this method updates the whole list
        displayToDos: function(todoList) {
            var location = this.location();
            var template = this.template;
            var output = "";

            while (location.firstChild) {
                location.removeChild(location.firstChild);
            }

            for (var i = 0; i < todoList.length; i++) {
                var view = {
                    todoName: todoList[i].todoName
                };

                output += Mustache.render(template, view);
            }

            location.innerHTML = output;
        },*/

        /* update each todos position in its id */
        updateTodoPositions: function() {
            var li = document.querySelectorAll("#todo-list-items .todo");

            for (var i = 0; i < todoList.length; i++) {
                li[i].id = i;
            }
        },

        /* Append new todo to list */
        displayNewTodo: function(todoList, position) {
            var location = this.location();
            var template = this.template;

            var view = {
                /* we need the todoName from the last added todo to the list 
                -> the index is equal to lenght - 1 */
                todoName: todoList[todoList.length - 1].todoName
            };

            var newTodo = document.createElement("li");
            newTodo.classList.add("todo");
            newTodo.innerHTML = Mustache.render(template, view);

            location.appendChild(newTodo);

            this.updateTodoPositions();

            this.addDeleteButtonEvent(newTodo);

            this.addEditButtonEvent(newTodo);
        },

        /* when new todo is rendered, add click event  listener on its delete button. */
        addDeleteButtonEvent: function(todoElement) {
            /* handler that we pass to the event listener */
            var addDeleteButtonHandler = function(event) {
                var position = parseInt(event.target.parentNode.id);
                controller.deleteTodo(position);
                this.removeEventListener('click', addDeleteButtonHandler);
            };

            /* search todoElement nodes for delete button 
            and add the event listener to call deleteTodo method from controller */
            if (todoElement.hasChildNodes()) {
                var children = todoElement.children;

                for (var i = 0; i < children.length; i++) {
                    var deleteButton = children[i];

                    if (deleteButton.classList.contains("delete")) {
                        deleteButton.addEventListener('click', addDeleteButtonHandler);
                    }
                }
            }
        },

        removeTodo: function(position) {
            var location = this.location();

            if (location.hasChildNodes()) {
                var children = location.children;

                for (var i = 0; i < children.length; i++) {
                    if (i === position) {
                        location.removeChild(children[i]);
                    }
                }
            }

            this.updateTodoPositions();
        },

        addEditButtonEvent: function(todoElement) {
            var createEditInput = this.createEditInput;

            /* handler that we pass to the event listener */
            var addEditButtonHandler = function(event) {
                createEditInput(todoElement);
                this.removeEventListener('click', addEditButtonHandler);
            };

            /* search todoElement nodes for edit button 
            and add the event listener to call createEditInput method */
            if (todoElement.hasChildNodes()) {
                var children = todoElement.children;

                for (var i = 0; i < children.length; i++) {
                    var editButton = children[i];

                    if (editButton.classList.contains("edit")) {
                        editButton.addEventListener('click', addEditButtonHandler);
                    }
                }
            }
        },

        createEditInput: function(todoElement) {
            var todoName = "";

            if (todoElement.hasChildNodes()) {
                var children = todoElement.children;

                for (var i = 0; i < children.length; i++) {
                    /* Get current todoName for adding it to edit placehodler */
                    if (children[i].classList.contains("todo-text")) {
                        todoName = children[i].textContent;
                    }

                    /* change Edit button to Save button */
                    if (children[i].classList.contains("edit")) {
                        children[i].classList.add("save");
                        children[i].textContent = "save";
                    }
                }
            }

            /* create the edit input */
            var input = document.createElement("input");
            input.type = "text";
            input.name = "edit-todo" + parseInt(todoElement.id);
            /* populate the input with the current todoName */
            input.value = todoName;
            input.id = "edit-todo-" + parseInt(todoElement.id);
            input.classList.add("text-input", "edit-input");

            /* append the input at the end of the todo element and move focus to it*/
            todoElement.appendChild(input);
            input.focus();

            this.addSaveEditTodoEvent(todoElement);
        },

        addSaveEditTodoEvent: function(todoElement) {
            var removeEditInput = this.removeEditInput;

            /* get the new todoName */
            var newTodoName = function() {
                if (todoElement.hasChildNodes()) {
                    var children = todoElement.children;

                    for (var i = 0; i < children.length; i++) {
                        var node = children[i];

                        /* check if child is the edit input and get the text inside */
                        if (node.classList.contains("edit-input")) {
                            return node.textContent;
                        }
                    }
                }
            };

            /* handler that we pass to the event listener */
            var addSaveEditTodoHandler = function(event) {
                var position = parseInt(event.target.parentNode.id);
                controller.editTodo(position, newTodoName());
                removeEditInput(todoElement);
                this.removeEventListener('click', addSaveEditTodoHandler);
            };

            /* search todoElement nodes for save button 
            and add the event listener to call and editTodo removeEditInput methods */
            if (todoElement.hasChildNodes()) {
                var children = todoElement.children;

                for (var i = 0; i < children.length; i++) {
                    var saveButton = children[i];

                    if (saveButton.classList.contains("save")) {
                        saveButton.addEventListener('click', addSaveEditTodoHandler);
                    }
                }
            }
        },

        removeEditInput: function(todoElement) {
            if (todoElement.hasChildNodes()) {
                var children = todoElement.children;

                for (var i = 0; i < children.length; i++) {
                    var editInput = children[i];

                    if (editInput.classList.contains("edit-input")) {
                        todoElement.removeChild(editInput);
                    }
                }
            }
        },

        editTodo: function(todoElement) {

        }
    };

    var controller = {
        addTodo: function(todoName) {
            if (todoName !== "") {
                todoListModel.addTodo(todoName);
                view.displayNewTodo(todoList);
            }
        },

        deleteTodo: function(position) {
            todoListModel.deleteTodo(position);
            view.removeTodo(position);
        },

        editTodo: function(position, newTodoName) {
            todoListModel.editTodo(position, newTodoName);
            view.displayNewTodo(todoList);
        }
    };

    function init(target) {
        view.initView(target);
    }

    return {
        init: init
    };
}

/*
(function (window){
    'use strict';

    function defineToDoList() {
        var ToDoList = {};
        
        var list = [];

        return ToDoList;
    }

    if (typeof(ToDoList) === 'undefined') {
        window.ToDoList = defineToDoList();
    }
    else {
        console.log("ToDoList is already defined.");
    }
})(window);
*/
