angular.module('IRX.controllers', [])

	//Providers like factory and constant defined before controllers

	//controller's name followed by its definition and dependencies
	.controller('firstController', function($scope,$location) {
  		alert("controller");
  		//define a function 
      	$scope.show = function(){
      		//access data1 in controller
        	alert($scope.data1);
        	//first opens "newPage" and then load "open" state
        	$location.path('/newPage/open'); // navigation handling
      	}
  	})