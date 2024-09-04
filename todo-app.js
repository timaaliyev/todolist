(function () {
  // создаем и возвращаем заголовок сайта
  function createAppTitle(title) {
    // создаем html элемент h2
    let appTitle = document.createElement("h2");
    // добавляем элемент в html и кладем туда текст заголовка
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму заполнения заданий
  function createTodoItemForm() {
    // создаем html элемент form для формы списка дел
    let form = document.createElement("form");
    // создаем html элемент input для написания дела
    let input = document.createElement("input");
    // создаем html элемент div для кнопки
    let buttonWrapper = document.createElement("div");
    // создаем html элемент button для создание кнопки
    let button = document.createElement("button");

    // создаем классы для формы
    form.classList.add("input-group", "mb-3");
    // создаем класс для инпута
    input.classList.add("form-control");
    // пишем текст пустой формы перед вводом дела
    input.placeholder = "Enter the name of the new task";
    // создаем класс для положения кнопки
    buttonWrapper.classList.add("input-group-append");
    // создаем классы для кнопки
    button.classList.add("btn", "btn-primary");
    // пишем текст в кнопку
    button.textContent = "Add task";

    // добавляем кнопку в html
    buttonWrapper.append(button);
    // добавляем форму в html
    form.append(input);
    // добавляем див кнопки в html
    form.append(buttonWrapper);

    if (input.value === "") {
      button.disabled = true;
    }

    // возвращаем значения
    return {
      form,
      input,
      button,
    };
  }

  // создаем и возвращаем список дел
  function createTodoList() {
    // создаем html элемент ul для создания списка и вкладываем его в переменную list
    let list = document.createElement("ul");
    // добавляем класс
    list.classList.add("list-group");
    // возвращаем переменную
    return list;
  }

  // создаем и возвращаем элементы внтури списка
  function createTodoItem(id, name, done) {
    // создаем html элемент li для создания дела
    let item = document.createElement("li");
    item.id = id;
    // создаем html элемент div для группирования двух кнопок
    let buttonGroup = document.createElement("div");
    // создаем html элемент button для кнопки Готово
    let doneButton = document.createElement("button");
    // создаем html элемент button для кнопки Удалить
    let deleteButton = document.createElement("button");

    // создаем класс для дела
    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    // пишем текст дела
    item.textContent = name;

    // создаем класс для группы кнопок
    buttonGroup.classList.add("btn-group", "btn-group-sm");
    // создаем класс для кнопки Готово
    doneButton.classList.add("btn", "btn-success");
    // пишем текст для кнопки
    doneButton.textContent = "Done";
    // создаем класс для кнопки Удалить
    deleteButton.classList.add("btn", "btn-danger");
    // пишем текст для кнопки
    deleteButton.textContent = "Delete";

    // добавляем кнопку в html
    buttonGroup.append(doneButton);
    // добавляем кнопку в html
    buttonGroup.append(deleteButton);
    // добавляем группу кнопок в html
    item.append(buttonGroup);

    // возвращаем элементы списка
    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  //функция создающая приложение
  function createTodoApp(container, title = "Task list", listName) {
    let tasks = [];

    // вкладываем в переменную
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoItemForm.input.addEventListener("keyup", function (e) {
      if (todoItemForm.input.value) {
        todoItemForm.button.disabled = false;
       } else {
        todoItemForm.button.disabled = true;
        }
    });
    todoItemForm.form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      let id = generateId(listName);
      let todoItem = createTodoItem(id, todoItemForm.input.value, false);
      let task = {id: id, name: todoItemForm.input.value, done: false};
      tasks.push(task);
      addToStorage(task, listName);

      todoItem.doneButton.addEventListener("click", function () {
        todoItem.item.classList.toggle("list-group-item-success");
        let id = todoItem.item.id
        for (let i = 0; i < tasks.length; ++i) {
          if (id == tasks[i].id) {
            tasks[i].done = !tasks[i].done
          }
        }
        updateStorage(id, listName)
      });
      todoItem.deleteButton.addEventListener("click", function () {
        if (confirm("Are you sure?")) {
          todoItem.item.remove();
          let id = todoItem.item.id
          for (let i = 0; i < tasks.length; ++i) {
            if (id == tasks[i].id) {
              tasks.splice(i, 1)
            }
          }
          removeFromStorage(id, listName)
        }
      });


      todoList.append(todoItem.item);

      todoItemForm.input.value = "";
    });

    readFromStorage(listName);

    function dataToJson(data) {
      return JSON.parse(data);
    }

    function jsonToData(json) {
      return JSON.stringify(json);
    }

    function getFromStorage(key) {
      return localStorage.getItem(key);
    }

    function setToStorage(key, data) {
      localStorage.setItem(key, data);
    }

    function addToStorage(task, listName) {
      let storage = getFromStorage(listName);

      storage = storage ? dataToJson(storage) : [];

      storage.push(task);
      setItemsKey(listName, storage);
    }

    function removeFromStorage(id, listName) {
      let storage = getItemsKey(listName)
      let newStorage = [];
      for (let i = 0; i < storage.length; i++) {
        if (storage[i].id != id) {
          newStorage.push(storage[i])
        }
      }
      setItemsKey(listName, newStorage)
    }

    function updateStorage(id, listName) {
      let storage = getItemsKey(listName)
      for (let i = 0; i < storage.length; i++) {
        if (id == storage[i].id) {
          storage[i].done = !storage[i].done
        }
      }
      setItemsKey(listName, storage)
    }

    function readFromStorage(listName) {
      let storage = getItemsKey(listName)
      if (storage) {
        for (let i = 0; i < storage.length; i++) {
          let todoItem = createTodoItem(storage[i].id, storage[i].name, storage[i].done);
          todoItem.doneButton.addEventListener("click", function () {
            todoItem.item.classList.toggle("list-group-item-success");
            let id = todoItem.item.id
            for (let i = 0; i < tasks.length; ++i) {
              if (id == tasks[i].id) {
                tasks[i].done = !tasks[i].done
              }
            }
            updateStorage(id, listName)
          });
          todoItem.deleteButton.addEventListener("click", function () {
            if (confirm("Are you sure?")) {
              todoItem.item.remove();
              let id = todoItem.item.id
              for (let i = 0; i < tasks.length; ++i) {
                if (id == tasks[i].id) {
                  tasks.splice(i, 1)
                }
              }
              removeFromStorage(id, listName)
            }
          });
          todoList.append(todoItem.item);
        }
      }
    }

    function generateId(listName) {
      let storage  = getItemsKey(listName)
      if (storage && storage.length > 0) {
        return storage.length + 1;
      } else {
        return 0;
      }
    }

    function setItemsKey(key, data) {
      setToStorage(key, jsonToData(data));
    }

    function getItemsKey(key) {
      let storage = dataToJson(getFromStorage(key))

      return storage
    }
  }

  window.createTodoApp = createTodoApp;
})();
