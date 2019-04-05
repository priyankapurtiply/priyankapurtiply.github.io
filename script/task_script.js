
var apiURL = "https://www.fsi.illinois.edu/demo/data.cfm";
var apiKeyVal = "906fb0b13df5d4a8c2af20a87381368e";

function getTasks() {
    var requestData = {
        "action": "getTasks",
        "apiKey": apiKeyVal
    };
    angularTable(apiURL, requestData);
}

function angularTable(apiURL, getAllTasks) {
    var app = angular.module("myApp", []);
    app.controller('tasksCtrl', function($scope, $http) {
        $http.post(apiURL, JSON.stringify(getAllTasks))
            .then(function(response) {
                $scope.tasklist = response.data; });

        	$scope.closeModal = function() {

            $scope.singleTaskSelected = false;
            $scope.selectedAll = false;
            angular.forEach($scope.tasklist, function(selected) {
                if (selected.selected) {
                    selected.selected = false;
                    $scope.selectedTask.task_description = '';
                    $scope.selectedTask.due_date = '';
                    $scope.selectedTask.completed = '';
                    $scope.selectedTask.task_id = '';
                }
                $('#myModal').modal('hide');
            });

        };

        $scope.errorMessage = false;

        $scope.addTask = function() {

            var newTaskParam = {
                "action": "createTask",
                "task_description": $scope.selectedTask.task_description,
                "due_date": $scope.selectedTask.due_date,
                "completed": $scope.selectedTask.completed,
                "apiKey": apiKeyVal
            };
            $http.post(apiURL, JSON.stringify(newTaskParam))
                .then(function success(response) {
                    var newtaskID = response.data;
                    $scope.selectedTask.task_id = newtaskID["task_id"];
                    var maxID = (Math.max.apply(null, $scope.tasklist.map(x => x.id)) || 0) + 1;


                    $scope.tasklist.push({
                        'task_description': $scope.selectedTask.task_description,
                        'due_date': $scope.selectedTask.due_date,
                        'completed': $scope.selectedTask.completed,
                        'task_id': $scope.selectedTask.task_id
                    });
                    $scope.selectedTask.task_description = '';
                    $scope.selectedTask.due_date = '';
                    $scope.selectedTask.completed = '';
                    $scope.selectedTask.task_id = '';
                    $('#myModal').modal('hide');

                }, function error(response) {
                    alert(response.data);
                });
        }

        $scope.deleteTask = function() {
            var deleteTaskParam = {
                action: "deleteTask",
                task_id: $scope.selectedTask.task_id,
                apiKey: apiKeyVal
            };

            $http.post(apiURL, JSON.stringify(deleteTaskParam))
                .then(function success(response) {
                    var newDataList = [];
                    $scope.selectedAll = false;
                    angular.forEach($scope.tasklist, function(selected) {
                        if (!selected.selected) {
                            newDataList.push(selected);
                        }
                        $scope.tasklist = newDataList;
                        $scope.selectedTask.task_description = '';
                        $scope.selectedTask.due_date = '';
                        $scope.selectedTask.completed = '';
                        $scope.selectedTask.task_id = '';
                        $('#myModal').modal('hide');
                    });
                }, function error(response) {
                    alert(response.data);
                });
        }

 
        $scope.singleTaskSelected = false;

        $scope.setSelectedTask = function(task) {
            if ($scope.tasklist.filter(x => x.selected).length > 1) {
                $scope.selectedTask = null;
                $scope.singleTaskSelected = false;
            } else {
                $scope.selectedTask = angular.copy($scope.tasklist.find(x => x.selected));
               
                    
                $scope.singleTaskSelected = !!$scope.selectedTask;
            }
        }
        $scope.addNewTaskButtonClick = function() {
            $scope.singleTaskSelected = false;
        }

        $scope.editTask = function() {
            var editTaskParam = {
                action: "updateTask",
                task_description: $scope.selectedTask.task_description,
                due_date: $scope.selectedTask.due_date,
                completed: $scope.selectedTask.completed,
                task_id: $scope.selectedTask.task_id,
                apiKey: apiKeyVal
            };

            $http.post(apiURL, JSON.stringify(editTaskParam))
                .then(function success(response) {

                    var taskToEdit = $scope.tasklist.find(x => x.task_id === $scope.selectedTask.task_id);
                    taskToEdit.task_description = $scope.selectedTask.task_description;
                    taskToEdit.due_date = $scope.selectedTask.due_date;
                    taskToEdit.completed = $scope.selectedTask.completed;
                    taskToEdit.selected = false;
                    $scope.selectedTask.task_description = '';
                    $scope.selectedTask.due_date = '';
                    $scope.selectedTask.completed = '';
                    $scope.selectedTask.task_id = '';
                    $scope.singleTaskSelected = false;

                    $('#myModal').modal('hide');
                }, function error(response) {
                    alert(response.data);
                });
        }
		$scope.integerval = /^[0-1]$/;
    });

}

$(function () {
	  $("#datepicker").datepicker({ 
	        autoclose: true, 
	        todayHighlight: true
	  }).datepicker('update', new Date());
	});
