// angular module with name and arraay of dependencies
angular.module('IRX', ['ui.router','IRX.controllers']) 

	//first function to be called after loading dependencies
	.config(function ($stateProvider,$urlRouterProvider,$httpProvider){
		alert("config");		
        
        $stateProvider

            //different states(url) for the IRX
        	.state('baseHeader', 
            {   
                //url name
                url: "/baseHeader",
                // define views to be load under this state
                views:
                {   
                    //name of the views
                    'view1': 
                    {   
                        //template to be loaded in view
                        templateUrl: "templates/baseHeader.html" 
                    }
                }
            })

            .state('newPage',
            {
                url:'/newPage',
                views:
                {
                    'view1':
                    {
                        templateUrl: "templates/newPage.html" 
                    }
                }
            })

            //"open" state inside newPage state (Nested States).Uses (.)dot to show another state inside a state
            .state('newPage.open',
            {
                url:'/open',
                views:
                {
                    'new1':
                    {
                        template:'<p>hello i am new1</p>'
                    },
                    'new2':
                    {
                        template:'<p>hello i am new2</p>'
                    }
                }
            })

        //if no state found then this default state will be loaded
        $urlRouterProvider.otherwise('/baseHeader');
	})

    //Initialization of variables and constant 
	.run(function (){
		alert("run");
	})
