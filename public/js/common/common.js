
function Common() {
	this.postReqLeads="post";
	this.sellPostLeads="sell";
  this.postReqLeadsA = "_postA_";
  this.agentIdArr = [];
  this.viewModelPost=null;
  this.aPostReqViewModel = null;
  this.viewModelSell = null;
  this.sessName = "";
  this.sessEmailId = "";
  this.sessType ="user";
  if($('#__sess_name').html() != undefined){
      this.sessName=$('#__sess_name').val();
  }
  if($('#__sess_emailId').html() != undefined){
      this.sessEmailId=$('#__sess_emailId').val();
  }
  if($('#__sess_type').html() != undefined){
      this.sessType=$('#__sess_type').val();
  }

}
Common.prototype.getViewModel = function(type) {
	var classInstance = this;
  

    var viewModel = {
      data:{
      	emailId:ko.observable(classInstance.sessEmailId),
      	projectId:ko.observable(""),
      	agentId:ko.observableArray(),
      	name:ko.observable(classInstance.sessName).extend({ required: true}),
      	mobileNo:ko.observable(""),
      	city:ko.observable(""),
      	bhk:ko.observable(""),
      	type:ko.observable(classInstance.sessType),
      	proName:ko.observable(""),
      	locality:ko.observable(""),
        localityId:ko.observable(""),
        propertyType:ko.observable(""),
        action:ko.observable(""),
        origin:ko.observable(type),
        showCity:ko.observable(""),
        createLogin:ko.observable(false),
        bhkArr:ko.observableArray(),
        typeArr:ko.observableArray()
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
      var obj={
        status:400, 
        heading:"Registration Error",
        content:"Please check your form have correct information."
      };
      if(classInstance.viewModel.password() != classInstance.viewModel.cnfPassword()){
        $('._msg').addClass('_ajActive').addClass('_ajError').text("Please check your password.")
        httpUtils.checkStatus(obj,false,true,null,obj);
        return false;
      }
      if(!$("#register-box").find(".reg_chckbx").find("input[type='checkbox']").is(":checked")){
        httpUtils.checkStatus(obj,false,true,null,obj);
       return false; 
      }
      classInstance.register();
    },
		openTab:function(tabID) {
			classInstance.viewModel.tabID(tabID);
      classInstance.viewModel.emailId('');
      classInstance.viewModel.password('');
      classInstance.viewModel.cnfPassword('');
      classInstance.viewModel.userId('');
      classInstance.viewModel.name(''); 
      classInstance.viewModel.type('user'); 
      $('.ui.reg_chckbx').find("input").removeAttr("checked");
      $("._msg").removeClass("_ajActive").removeClass("._ajError").text('');
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
      return false;
    });

   $('#sell').on('change','input[name="city"]',function(){
      var city = $(this).val();
      city = city.replace(/&nbsp;/gi,'')
      city = city.trim();

      classInstance.viewModelSell.data.city(city)
      
    });
   $('#post').on('change','input[name="city"]',function(){
      var city = $(this).val();
      city = city.replace(/&nbsp;/gi,'')
      city = city.trim();

      classInstance.viewModelPost.data.city(city)
      
    });
   $('#_postA_').on('change','input[name="city"]',function(){
      var city = $(this).val();
      city = city.replace(/&nbsp;/gi,'')
      city = city.trim();

      classInstance.aPostReqViewModel.data.city(city)
      
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
                classInstance.viewModelSell.data.localityId(ui.item.locationId)
                classInstance.viewModelSell.data.projectId(ui.item.id)
                classInstance.setpropertiesOfForm(ui,classInstance.viewModelSell)
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
                classInstance.aPostReqViewModel.data.localityId(ui.item.locationId)
                classInstance.aPostReqViewModel.data.projectId(ui.item.id)
                classInstance.setpropertiesOfForm(ui,classInstance.aPostReqViewModel)
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
                classInstance.viewModelPost.data.localityId(ui.item.locationId)
                classInstance.viewModelPost.data.projectId(ui.item.id)
                classInstance.setpropertiesOfForm(ui,classInstance.viewModelPost)
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
      data.ignoreLogin=true;
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
      propertyType:{
        identifier : 'propertyType',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please select your Property Type'
          }
        ]
      },
      bhk:{
        identifier : 'bhk',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your name'
          }
        ]
      },
      action:{
        identifier : 'action',
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
            type   : 'length[9]',
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
     var obj={
       status:data.status 
     };
    if(data.status==0){
      $('.close.icon').click();
      obj.heading="Confirmation Mail Sent";
      obj.content="Please check your email account and verify your status.";
    }else {
      obj.heading="Error";
      obj.content=data.result[0];
    }
    __overlaySideBar(obj);
  })
};  

function __overlaySideBar(obj){
  $('#confirmation-mail-sent').find("._vrfy_hdr").text(obj.heading);
  if(obj.status==0){
    $('#confirmation-mail-sent').find("._vrfy_msg").removeClass("_ajError").addClass("successMsg").text(obj.content);
  }else{
    $('#confirmation-mail-sent').find("._vrfy_msg").removeClass("successMsg").addClass("_ajError").text(obj.content);
  }
  $('#confirmation-mail-sent').sidebar( 'overlay').sidebar('show');
  setTimeout(function(){
    $('#confirmation-mail-sent').sidebar( 'overlay').sidebar('hide');
  },3000);
}
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
    var Obj={
      status:0,
      heading:"Contact Details Sent",
      content:"Your details has been sent to Agent. Agent will contact you in short while."
    }  
    if(data.status==0){
      $(".close").click();
    }else {
      Obj.status=data.status;
      Obj.content="please check your information. Your information is incorrect."
    }
    __overlaySideBar(Obj);
  });
}
Common.prototype.setpropertiesOfForm = function(ui,viewModel) {
  viewModel.data.bhkArr([])
  viewModel.data.typeArr([])
  if(ui.item.bhk){
    ko.utils.arrayPushAll(viewModel.data.bhkArr,ui.item.bhk);
  }
if(ui.item.type){
    ko.utils.arrayPushAll(viewModel.data.typeArr,ui.item.type);
  }
   

//viewModel.data.bhk(ui.item.id)
};
Common.prototype.captureLeadsProject = function(form) {
var name = $("#"+form).find('input[name="name"]').val();
var emailId = $("#"+form).find('input[name="emailId"]').val();
var mobileNo = $("#"+form).find('input[name="mobileNo"]').val();
var bhk = $("#"+form).find('input[name="bhk"]').val();
var action = $("#"+form).find('input[name="action"]').val();
var propertyType = $("#"+form).find('input[name="propertyType"]').val();
var projectId = $("#"+form).find('#_projectIdP_').val();
var proName = $("#"+form).find('input[name="proName"]').val();
var type = $("#"+form).find('input[name="type"]:checked').val();
var createLogin = $("#"+form).find('._createLoginP_').hasClass('checked');

var data = {
  "name":name,
  "emailId":emailId,
  "mobileNo":mobileNo,
  "projectId":projectId,
  "type":type,
  "bhk":bhk,
  "action":action,
  "propertyType":propertyType,
  "proName":proName,
  "createLogin":createLogin,
  "origin":"post"
}
var agentid = $('#'+form).find('#_agentIdP_').val();
if (agentid && agentid != "") {
  data["dealerId"]=agentid;
};
  var type = "leads";
  httpUtils.post("/capture-lead",
    data,
     { },"JSON",function(data){
      var leadsObj={
        status:0,
        heading:"Lead Captured",
        content:data.message
      }
      if(data.status!=0){
        leadsObj.status=data.status;
        leadsObj.content="Please check information you have sent."
      }else{
        $(".close").click();
      }  
      if(httpUtils.checkStatus(data,true,true,leadsObj,leadsObj)){
       
      }
    
  })
}

Common.prototype.initializeFromLocalStorage = function(viewModel) {

  var city = localStorage.getItem("city");
    var action = localStorage.getItem("action");
    if(city){
        viewModel.data.city(city)
        viewModel.data.showCity(city)
    } 
    if(action){
        viewModel.data.action(action)
    }
}

Common.prototype.resetForm = function(viewModel,form) {
  var classInstance = this
  viewModel.data.proName("");
  viewModel.data.locality("");
  viewModel.data.projectId("");
  viewModel.data.agentId("");
  viewModel.data.bhk("");
  viewModel.data.type(classInstance.sessType);
  viewModel.data.bhkArr([]);
  viewModel.data.typeArr([]);
  viewModel.data.propertyType("");
  form.find('.ui.dropdown').dropdown('restore defaults');
      
}

Common.prototype.captureLeads = function(type) {

	var classInstance = this;
	var viewModel = null;
	var parent = "";
  var successObj={};
  var failureObj={};
  

  
  if(type == classInstance.postReqLeads){
		viewModel = classInstance.viewModelPost;
    successObj={
   
      heading:"Post Requirement"
    
    };
    failureObj={
    
      heading:"Post Requirement"
     
    };
	} else if(type == classInstance.sellPostLeads){

    successObj={
      
      heading:"Sell Property"
     
    };
     failureObj={
      
      heading:"Sell Property"
     
    };
		viewModel = classInstance.viewModelSell;
    viewModel.data.type("user");

	} else {
     successObj={
    
      heading:"Post Requirement"
    
    };
    failureObj={
     
      heading:"Post Requirement"
    
    };
    viewModel = classInstance.aPostReqViewModel;

    var agentId = viewModel.data.agentId();
    if(agentId && agentId.length >0){
      viewModel.data["dealerId"] = agentId[0].irxId  
    }
    viewModel.data.origin('post')
  }
  var createLogin = $('#'+type).find('.__createLogin').hasClass('checked');
  viewModel.data.createLogin(createLogin);
  httpUtils.post("/capture-lead",
		viewModel.data,
		 { },"JSON",function(data){

      if(httpUtils.checkStatus(data,true,true,successObj,failureObj)){
	       $('.close.icon').click();
      }
		
	})
};
Common.prototype.upgradeUser=function(){
  httpUtils.post("/upgrade-user", {},{ },"JSON",function(data){
      var obj={
        heading:"Upgrade Successfully"
      }
      if(data.status==0){
        obj.content="Congratulations !! you have been upgraded successfully to agent."
      }else{
        obj.content="you already upgraded";
      }
      if(httpUtils.checkStatus(data,true,true,obj,obj)){
        window.location.reload();
      }
    
  })
}	
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

                var locationId ={}
                if(item.fields['location.locality'] &&  item.fields['location.locality'].length >0){
                    var lId = item.fields['location.locality'];
                    locationId = lId[0];
                }
                  var bhk =[]
              if(item.fields['bhk'] &&  item.fields['bhk'].length >0){
                  bhk = item.fields['bhk'];
              
              }
              var type =[]
              if(item.fields['type'] &&  item.fields['type'].length >0){
                  type = item.fields['type'];
              
              }
                var productType =""
                if(item.fields.productType &&  item.fields.productType.length >0){
                    productType = item.fields.productType[0];
                }
                return {id:item.fields.id[0],name:name,location:location,productType:productType,locationName:locationName,real:nameValue,locationId:locationId,bhk:bhk,type:type,_type:item.type};
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
    $("._upgrd").click(function(){
      common.upgradeUser();
    })
    // function _autocomplete(selector){
    //     selector.autocomplete({
    //         source: function(request, response){
    //             var _self = this;
    //             var reqData={
    //                 "text":request.term,
    //                 "city":selector.parents(".ui.inverted.menu").find("input[name='city']").val()
    //             }
                
    //        },
    //         minLength: 2,
    //         dataType: "json",
    //         cache: false,
    //         focus:function(event, ui){
    //             $(this).val(ui.item.real);
    //             return false;
    //         },
    //         select: function( event, ui ) {
    //             // var textName = classInstance.removeHtml(ui.item.name)
    //             // classInstance.viewModelSell.data.proName(textName)

    //             // classInstance.viewModelSell.data.locality(ui.item.locationName)
    //             // classInstance.viewModelSell.data.projectId(ui.item.id)
    //             return false;
    //         }
    //     });
    
    //     selector.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
    //         $(".ui-widget-content .ui-state-focus");
    //          return $( "<li>" ).append( '<a class="item" style="padding:0;"><div class="content"><div class="itLabel header" style="padding:0;">'+item.name+'</div></div></a>').appendTo(ul);
    //     };
    // }
    // _autocomplete($("#__postReqSearch"));
    // _autocomplete($("#__sellPostSearch"));
});
