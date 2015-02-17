
function Common() {
	this.postReqLeads="post";
	this.sellPostLeads="sell";
  this.postReqLeadsA = "_postA_";
  this.agentIdArr = [];
  this.viewModelPost=null;
  this.aPostReqViewModel = null;
  this.viewModelSell = null;
}
Common.prototype.getViewModel = function(type) {
	var classInstance = this;
  var sessName = "";
  var sessEmailId = "";
  if($('#__sess_name').html() != undefined){
      sessName=$('#__sess_name').val();
  }
  if($('#__sess_emailId').html() != undefined){
      sessEmailId=$('#__sess_emailId').val();
  }

	  var viewModel = {
      data:{
      	emailId:ko.observable(sessEmailId),
      	projectId:ko.observable(""),
      	agentId:ko.observableArray(),
      	name:ko.observable(sessName).extend({ required: true}),
      	mobileNo:ko.observable(""),
      	city:ko.observable(""),
      	bhk:ko.observable(""),
      	type:ko.observable("user"),
      	proName:ko.observable(""),
      	locality:ko.observable(""),
        propertyType:ko.observable(""),
        action:ko.observable(""),
        origin:ko.observable(type),
        showCity:ko.observable(""),
        createLogin:ko.observable(false)
        //projectName:ko.observable("")
      },
      captureLeads:function(){
       
      	classInstance.captureLeads(type);
      },
      removeAgent:function(data){
        viewModel.data.agentId.remove(data)
      }

    };
    return viewModel;
}
Common.prototype.init = function(first_argument) {
	var classInstance = this;
	
	classInstance.viewModelPost = classInstance.getViewModel(classInstance.postReqLeads);
	classInstance.viewModelSell = classInstance.getViewModel(classInstance.sellPostLeads);
  	

	classInstance.viewModel = {
		userId: ko.observableArray(),
		tabID : ko.observable('login'),
		password: ko.observable(),
    emailId: ko.observable(''),
    cnfPassword : ko.observable(''),
    type :ko.observable(''),
    name :ko.observable(''),
    register : function() {
      
      if(classInstance.viewModel.password() != classInstance.viewModel.cnfPassword()){
        $('._msg').addClass('_ajActive').addClass('_ajError').text("Please check your password.")
        return false;
      }
      
      classInstance.register();
    },
		openTab:function(tabID) {
			classInstance.viewModel.tabID(tabID);
			return false;
		},
		login : function() {
           classInstance.login();
        }

	};
	
    $('#login').on('change','._type_', function(){
      classInstance.viewModel.type($(this).val())
    })
    
    $(document).off('click','.log-in');
    $(document).on('click','.log-in',function() {
      $('#login').modal({
        closable:false
      }).modal('show');
      classInstance.viewModel.openTab('login');  
      classInstance.viewModel.emailId('');
      classInstance.viewModel.password('');
      classInstance.viewModel.cnfPassword('');
      classInstance.viewModel.name(''); 
      classInstance.viewModel.type('user'); 
      $('.ui.reg_chckbx').find("input").removeAttr("checked");
      $("._msg").removeClass("_ajActive").removeClass("._ajError").text('');
      return false;
    });

   $('.sell-post').on('change','input[name="city"]',function(){
      var city = $(this).val();
      city = city.replace(/&nbsp;/gi,'')
      city = city.trim();
      classInstance.viewModelSell.data.city(city)
      localStorage.setItem("city", city);
    });
     $("#"+classInstance.sellPostLeads).find("#__sellPostSearch").autocomplete({

            source: function(request, response){
              
                var _self = this;
               var data={
                  "text":request.term,
                  "city":classInstance.viewModelSell.data.city()
                }
                if(typeof sBar !='undefined')
                    sBar.projectAutocomplete(data,request,response);
                else
                    getAutocmpleteResult(data,request,response);
              },
              minLength: 2,
              dataType: "json",
              cache: false,
              appendTo:'#autoDivSell',
              select: function( event, ui ) {
               
                 
                var textName = classInstance.removeHtml(ui.item.name)
                classInstance.viewModelSell.data.proName(textName)
                
                classInstance.viewModelSell.data.locality(ui.item.locationName)
                classInstance.viewModelSell.data.projectId(ui.item.id)
                return false;
              }
    }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        $(".ui-widget-content .ui-state-focus");
         return $( "<li>" ).append( '<a class="item" style="padding:0;"><div class="content"><div class="itLabel header" style="padding:0;">'+item.name+'</div></div></a>').appendTo(ul);
      }; 
       $("#"+classInstance.postReqLeadsA).find("#__postReqSearch").autocomplete({

            source: function(request, response){
                var _self = this;
               var data={
                  "text":request.term,
                  "city":classInstance.aPostReqViewModel.data.city()
                }
                if(typeof sBar !='undefined')
                    sBar.projectAutocomplete(data,request,response);
                else
                    getAutocmpleteResult(data,request,response);
                
              },
              minLength: 2,
              dataType: "json",
              cache: false,
              appendTo:'#autoDivPostA',
              select: function( event, ui ) {
                var textName = classInstance.removeHtml(ui.item.name)
                classInstance.aPostReqViewModel.data.proName(textName)
                classInstance.aPostReqViewModel.data.locality(ui.item.locationName)
                classInstance.aPostReqViewModel.data.projectId(ui.item.id)
                return false;
              }
    }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
         $(".ui-widget-content .ui-state-focus");
         return $( "<li>" ).append( '<a class="item" style="padding:0;"><div class="content"><div class="itLabel header" style="padding:0;">'+item.name+'</div></div></a>' ).appendTo(ul);
      };  
   
    $("#"+classInstance.postReqLeads).find("#__postReqSearch").autocomplete({

            source: function(request, response){
                var _self = this;
                  var data={
                  "text":request.term,
                  "city":classInstance.viewModelPost.data.city()
                }
                  if(typeof sBar !='undefined')
                    sBar.projectAutocomplete(data,request,response);
                else
                    getAutocmpleteResult(data,request,response);
                
              },
              minLength: 2,
              dataType: "json",
              cache: false,
              appendTo:'#autoDivPost',
              select: function( event, ui ) {
                var textName = classInstance.removeHtml(ui.item.name) 
                classInstance.viewModelPost.data.proName(textName)
                classInstance.viewModelPost.data.locality(ui.item.locationName)
                classInstance.viewModelPost.data.projectId(ui.item.id)
                return false;
              }
    }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        $(".ui-widget-content .ui-state-focus");
         return $( "<li>" ).append( '<a class="item" style="padding:0;"><div class="content"><div class="itLabel header" style="padding:0;">'+item.name+'</div></div></a>' ).appendTo(ul);
      };  


        $(document).off('click','#_logout_');
        $(document).on('click','#_logout_',function() {
         httpUtils.get("/logout",{},"JSON",function(data){
            if(httpUtils.checkStatus(data)){
              location.href="/";
            }
            
         })
        });
    ko.applyBindings(classInstance.viewModelPost,document.getElementById(classInstance.postReqLeads))
 	  ko.applyBindings(classInstance.viewModelSell,document.getElementById(classInstance.sellPostLeads))
	  ko.applyBindings(classInstance.viewModel,document.getElementById("login"));
 // ko.applyBindings(classInstance.viewModel,document.getElementById("login"));


};
Common.prototype.removeHtml = function(name) {
    if(name){
       return name.replace(/<(?:.|\n)*?>/gm, '');
    } else{
      return "";
    }
                     
};
Common.prototype.login = function() {
	var classInstance = this;
	httpUtils.post("/login",
		{userId:classInstance.viewModel.userId,password:classInstance.viewModel.password},
		 { 'authorization': 'POST' },"JSON",function(data){
		if(httpUtils.checkStatus(data,false,true)){
       location.reload();
		}
	})
};		 
Common.prototype.validateLead = function(_button) {
     $(_button).parents('form').form({
      emailId: {
        identifier : 'emailId',
        rules: [
          {
            type   : 'email',
            prompt : 'Please enter a valid e-mail'
          },
          {
            type   : 'empty',
            prompt : 'Please enter e-mail'
          }
        ]
      }, 
      name: {
        identifier : 'name',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your name'
          }
        ]
      },
      projectId: {
        identifier : 'projectId',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please select a project'
          }
        ]
      },
      mobileNo: {
        identifier : 'mobileNo',
        rules: [
          {
            type   : 'maxLength[10]',
            prompt : 'Please enter a valid mobile number'
          },
          {
            type   : 'empty',
            prompt : 'Please enter a mobile number'
          },
          {
            type   : 'integer',
            prompt : 'Please enter a valid mobile number'
          }
        ]
      }
    });
 $(_button).parents('form').submit();
}
Common.prototype.validateContactInfo = function(_button) {
     $(_button).parents('form').form({
      emailId: {
        identifier : 'emailId',
        rules: [
          {
            type   : 'email',
            prompt : 'Please enter a valid e-mail'
          },
          {
            type   : 'empty',
            prompt : 'Please enter e-mail'
          }
        ]
      }, 
      name: {
        identifier : 'name',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your name'
          }
        ]
      },
    
      mobileNo: {
        identifier : 'mobileNo',
        rules: [
          {
            type   : 'maxLength[10]',
            prompt : 'Please enter a valid mobile number'
          },
          {
            type   : 'empty',
            prompt : 'Please enter a mobile number'
          },
          {
            type   : 'integer',
            prompt : 'Please enter a valid mobile number'
          }
        ]
      }
    });
 $(_button).parents('form').submit();
};
Common.prototype.validateForm = function(_button) {
     
     $(_button).parents('form').form({
      emailId: {
        identifier : 'emailId',
        rules: [
          {
            type   : 'email',
            prompt : 'Please enter a valid e-mail'
          },
          {
            type   : 'empty',
            prompt : 'Please enter e-mail'
          }
        ]
      }, 
      action: {
        identifier : 'action',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please select action'
          },
          {
            type   : 'length[2]',
            prompt : 'Please select action'
          }
        ]
      },
      name: {
        identifier : 'name',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your name'
          }
        ]
      },
      projectId: {
        identifier : 'projectId',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please select a project'
          }
        ]
      },
      mobileNo: {
        identifier : 'mobileNo',
        rules: [
          {
            type   : 'maxLength[10]',
            prompt : 'Please enter a valid mobile number'
          },
          {
            type   : 'empty',
            prompt : 'Please enter a mobile number'
          },
          {
            type   : 'integer',
            prompt : 'Please enter a valid mobile number'
          }
        ]
      }
    });
    $(_button).parents('form').submit();
};
Common.prototype.register = function() {
  var classInstance = this;

  httpUtils.post("/create-user",
    {
      emailId:classInstance.viewModel.emailId,
      password:classInstance.viewModel.password,
      name:classInstance.viewModel.name, 
      type:classInstance.viewModel.type
    },
     {  },"JSON",function(data){
    if(data.status==0){
       $('.close.icon').click();
       $('#confirmation-mail-sent').modal({
          closable:false
        }).modal('show');
    }else {
      $('._msg').addClass('_ajActive').addClass('_ajError').text(data.result[0])
    }
  })
};  

Common.prototype.requestUserDetails = function(form) {

var name = $("#"+form).find('input[name="name"]').val();
var emailId = $("#"+form).find('input[name="emailId"]').val();
var mobileNo = $("#"+form).find('input[name="mobileNo"]').val();
var userId = $("#"+form).find('#_userIdC_').val();

var data = {
  "name":name,
  "emailId":emailId,
  "mobileNo":mobileNo
}
  httpUtils.get("/send-user-details/"+userId,
    data,"JSON",function(data){
    if(data.status==0){
      alert(1)
        
    }else {
      
    }
  })
}

Common.prototype.captureLeadsProject = function(form) {

var name = $("#"+form).find('input[name="name"]').val();
var emailId = $("#"+form).find('input[name="emailId"]').val();
var mobileNo = $("#"+form).find('input[name="mobileNo"]').val();
var projectId = $("#"+form).find('#_projectIdP_').val();
var type = "user"
var data = {
  "name":name,
  "emailId":emailId,
  "mobileNo":mobileNo,
  "projectId":projectId,
  "type":type
}
var agentid = $('#'+form).find('#_agentIdP_').val();
if (agentid && agentid != "") {
  data["agentId"]=agentid;
};
  var type = "leads";
  httpUtils.post("/capture-lead",
    data,
     { },"JSON",function(data){
    if(data.status==0){
    if(httpUtils.checkStatus(data,false,false)){
        if(httpUtils.checkStatus(data,false)){

              $('#'+type).find('#_msg').text("Successfully Submitted");
              $('#'+type).find('#_msg').addClass('_ajActive');
              $('#'+type).find('#_msg').removeClass('_ajError');
              $('#'+type).find('#_msg').addClass('_ajSuccess');
              $('#'+type).find('.ui.buttons').hide();
             }else{
              $('#'+type).find('#_msg').text(data.message);
              $('#'+type).find('#_msg').addClass('_ajActive');
              $('#'+type).find('#_msg').removeClass('_ajSuccess');
              $('#'+type).find('#_msg').addClass('_ajError');
             }
      }
    }else {
      
    }
  })
}

Common.prototype.captureLeads = function(type) {

	var classInstance = this;
	var viewModel = null;
	var parent = "";
  if(type == classInstance.postReqLeads){
		viewModel = classInstance.viewModelPost;
    
	} else if(type == classInstance.sellPostLeads){
		viewModel = classInstance.viewModelSell;
   
	} else {
    viewModel = classInstance.aPostReqViewModel;

    var agentId = viewModel.data.agentId();
    if(agentId && agentId.length >0){
      viewModel.data["dealerId"] = agentId[0].irxId  
    }
    
  }

 

	httpUtils.post("/capture-lead",
		viewModel.data,
		 { },"JSON",function(data){
		if(data.status==0){
      if(httpUtils.checkStatus(data,false,false)){
	      if(httpUtils.checkStatus(data,false)){

              $('#'+type).find('#_msg').text("Successfully Submitted");
              $('#'+type).find('#_msg').addClass('_ajActive');
              $('#'+type).find('#_msg').removeClass('_ajError');
              $('#'+type).find('#_msg').addClass('_ajSuccess');
              $('#'+type).find('.ui.buttons').hide();
             }else{
              $('#'+type).find('#_msg').text(data.message);
              $('#'+type).find('#_msg').addClass('_ajActive');
              $('#'+type).find('#_msg').removeClass('_ajSuccess');
              $('#'+type).find('#_msg').addClass('_ajError');
             }
      }
		}else {
			
		}
	})
};	
var common =null;
function getAutocmpleteResult(reqData,request,response){
    httpUtils.get("/project-autocomplete",reqData,"JSON",function(data){
        if(data.status==0){

            var arr = data.result;
            if(data.result == null){
                arr = new Array();
            }

            arr.push({fields:{id:[-1],name:reqData.text}})
            response($.map(arr, function(item) {
                var name ="",nameValue='';

                if(item.highlight && item.highlight.name && item.highlight.name.length > 0){
                    name = item.highlight.name[0]
                }else{
                    name = item.fields.name
                }
                nameValue=(item.fields.name?item.fields.name[0]:'');
                var location ={}
                if(item.fields['location.city'] &&  item.fields['location.city'].length >0){
                    var lCity = item.fields['location.city'];
                    location = lCity[0];
                }
                var locationName ={}
                if(item.fields['location.name'] &&  item.fields['location.name'].length >0){
                    var lName = item.fields['location.name'];
                    locationName = lName[0];
                }
                var productType =""
                if(item.fields.productType &&  item.fields.productType.length >0){
                    productType = item.fields.productType[0];
                }
                return {id:item.fields.id[0],name:name,location:location,productType:productType,locationName:locationName,real:nameValue};
            }));
        }
    });
}

$(document).ready(function(){
    if(common == null){
        common = new Common();
        common.init();
        var city = localStorage.getItem("city");
        var action = localStorage.getItem("action");
        if(city){
            common.viewModelSell.data.city(city)
            common.viewModelSell.data.showCity(city)
        } 
        if(action){
            common.viewModelSell.data.action(action)
        }
    }
    // function _autocomplete(selector){
    //     selector.autocomplete({
    //         source: function(request, response){
    //             var _self = this;
    //             var reqData={
    //                 "text":request.term,
    //                 "city":selector.parents(".ui.modal").find("input[type='city']").val()
    //             }
                
                
        //    },
        //     minLength: 2,
        //     dataType: "json",
        //     cache: false,
        //     focus:function(event, ui){
        //         $(this).val(ui.item.real);
        //         return false;
        //     },
        //     select: function( event, ui ) {
        //         // var textName = classInstance.removeHtml(ui.item.name)
        //         // classInstance.viewModelSell.data.proName(textName)

        //         // classInstance.viewModelSell.data.locality(ui.item.locationName)
        //         // classInstance.viewModelSell.data.projectId(ui.item.id)
        //         return false;
        //     }
        // });
    
        // selector.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        //     $(".ui-widget-content .ui-state-focus");
        //      return $( "<li>" ).append( '<a class="item" style="padding:0;"><div class="content"><div class="itLabel header" style="padding:0;">'+item.name+'</div></div></a>').appendTo(ul);
        // };
    // }
    // _autocomplete($("#projectId"));
    // _autocomplete($("#__sellPostSearch"));
});
