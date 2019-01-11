var TodoApp;
(function (TodoApp) {
    var todoApplication = angular.module("todo", []);
    var TodoController = (function () {
        function TodoController(todoSrv) {
            var _this = this;
            this.todoSrv = todoSrv;
            this.current_task = null;
            this.addTask = function () {
                _this.todoSrv.addTask(_this.current_task);
                _this.current_task = null;
            };
            this.finishTask = function (index) {
                _this.todoSrv.finishTask(index);
            };
            this.deleteAll = function () {
                _this.todoSrv.deleteAll();
            };
        }
        Object.defineProperty(TodoController.prototype, "tasks", {
            get: function () {
                return this.todoSrv.tasks;
            },
            enumerable: true,
            configurable: true
        });
        TodoController.$inject = ["todoService"];
        return TodoController;
    }());
    TodoApp.TodoController = TodoController;
    todoApplication.controller("ToDoController", TodoController);
    var ToDoService = (function () {
        function ToDoService() {
            this.tasks = [];
            this.completed_tasks = [];
        }
        ToDoService.prototype.addTask = function (current_task) {
            if (current_task != null) {
                this.tasks.push(current_task);
            }
        };
        ToDoService.prototype.finishTask = function (index) {
            this.completed_tasks.push(this.tasks[index]);
            this.tasks.splice(index, 1);
        };
        ToDoService.prototype.deleteAll = function () {
            this.tasks = [];
        };
        return ToDoService;
    }());
    TodoApp.ToDoService = ToDoService;
    todoApplication.service("todoService", ToDoService);
    todoApplication.component("todoComponent", {
        controller: TodoController,
        template: "<div class=\"container\">\n                        <form>\n                            <div class=\"input-group\">\n                            <input type=\"text\" class=\"form-control\" placeholder=\"Add new tasks...\" ng-model=\"$ctrl.current_task\">\n                            <div class=\"input-group-btn\">\n                                <button class=\"btn btn-default\" type=\"submit\" ng-click=\"$ctrl.addTask()\">\n                                <i class=\"fas fa-plus-circle\"></i>\n                                </button>\n                            </div>\n                            </div>\n                        </form>\n                        <div ng-repeat=\"task in $ctrl.tasks track by $index\">\n                            </br><div class=\"checkbox\">\n                                <input type=\"checkbox\" value=\"1\" id=\"cd\"/>\n                                <label class=\"strikethrough\" for=\"cd\">{{ task }}</label>\n                            </div>\n                            <button id=\"emoji-button\" ng-click=\"$ctrl.finishTask($index)\">\n                                <span class=\"fas fa-minus-circle text-info\"></span>\n                            </button>\n                        </div>\n                        <button id=\"delete-all\" type=\"button\" class=\"btn btn-danger btn-sm\" ng-click=\"$ctrl.deleteAll()\">\n                                <i class=\"fas fa-trash-alt\"></i> Delete All\n                        </button>\n                    </div>"
    });
})(TodoApp || (TodoApp = {}));
