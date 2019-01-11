namespace TodoApp {
    let todoApplication = angular.module("todo", []); 

    export class TodoController {
        static $inject = ["todoService"];
        constructor(private todoSrv: ToDoService){}

        public current_task = null;

        public get tasks() {
            return this.todoSrv.tasks;
        }

        public addTask = () => {
            this.todoSrv.addTask(this.current_task);
            this.current_task=null;
        }

        public finishTask = (index: number) => {
            this.todoSrv.finishTask(index);
        }

        public deleteAll = () => {
            this.todoSrv.deleteAll();
        }
    }

    todoApplication.controller("ToDoController", TodoController);

    export class ToDoService {
        public tasks: string[] = [];
        public completed_tasks: string[] = [];

        public addTask(current_task: string){
            if(current_task != null){
                this.tasks.push(current_task);
            }
        }
        
        public finishTask(index: number){
            this.completed_tasks.push(this.tasks[index]);
            this.tasks.splice(index, 1);
        }

        public deleteAll(){
            this.tasks = [];
        }
    }

    todoApplication.service("todoService", ToDoService)

    todoApplication.component("todoComponent", {
        controller: TodoController,
        template: `<div class="container">
                        <form>
                            <div class="input-group">
                            <input type="text" class="form-control" placeholder="Add new tasks..." ng-model="$ctrl.current_task">
                            <div class="input-group-btn">
                                <button class="btn btn-default" type="submit" ng-click="$ctrl.addTask()">
                                <i class="fas fa-plus-circle"></i>
                                </button>
                            </div>
                            </div>
                        </form>
                        <div ng-repeat="task in $ctrl.tasks track by $index">
                            </br><div class="checkbox">
                                <input type="checkbox" value="1" id="cd"/>
                                <label class="strikethrough" for="cd">{{ task }}</label>
                            </div>
                            <button id="emoji-button" ng-click="$ctrl.finishTask($index)">
                                <span class="fas fa-minus-circle text-info"></span>
                            </button>
                        </div>
                        <button id="delete-all" type="button" class="btn btn-danger btn-sm" ng-click="$ctrl.deleteAll()">
                                <i class="fas fa-trash-alt"></i> Delete All
                        </button>
                    </div>`
    })
}