
  function SearchBar(){
    this.page={
      start:0,
      pageSize:3
    },
    this.type={
      "irx-eproduct":"project",
      "irx-euser":"user"
    }
  }
  SearchBar.prototype.getViewModel = function(){
    var _classInstance = this;
    var viewModel = {
    
      name : ko.observable(""),
      bhk : ko.observable(""),
      order : ko.observable("asc"),
      searchType : ko.observable("project"),
      sProAgents : ko.observable(false),
      sLocAgents : ko.observable(false),
      projectId : ko.observable(""),
      city : ko.observable("gurgaon"),
      showCity : ko.observable("Gurgaon"),
      isLocality : ko.observable(false),
      minPrice : ko.observable(),
      maxPrice : ko.observable(),

      // showFilters : function () {
      //   var filter = [];
      //     if(name()!="")
      //     filter.push(name())

      //      if(bhk()!="")
      //     filter.push(bhk())

      //      if(name()!="")
      //     filter.push(name())

      //    if(type()!="")
      //     filter.push(type())

      //    if(city()!="")
      //     filter.push(city())

      //    if(price()!="")
      //     filter.push(price())
      // },
      searchF : function(formElement) {
        
        var self= this;
        var data =
            {
              name : self.name(),
              bhk : self.bhk(),
              order : self.order(),
              projectId : self.projectId(),
              city : self.city(),
              minPrice : self.minPrice(),
              maxPrice : self.maxPrice(),
              locationFlag : self.isLocality()    
            }; 
              
            if(self.searchType()=='project'){

              if(typeof(project)!="undefined"){
                if(self.isLocality() ){
                  
                  _classInstance.listProjectsOfLocation(_classInstance.viewModel.projectId(),data)
                }else{
                  _classInstance.fetchProjectResult(data)
                }
                
              }else{
                
               $(formElement).attr('action','/project-listing')
                return true;
              }
            } else if(self.searchType()=='agent'){
            
              if(typeof(agent)!="undefined"){
                if(self.sProAgents()){
                  _classInstance.fetchAgentOfProResult(data,false)
                }else if(self.sLocAgents()){
                   _classInstance.fetchAgentOfProResult(data,true)
                }else{
                  _classInstance.fetchAgentResult(data)  
                }
                
              }else{
               
               $(formElement).attr('action','/agent-listing')
                return true;
              }
            } else if(self.searchType()=='locality'){
              
              if(typeof(agent)!="undefined"){
                _classInstance.fetchAgentOfProResult(data,true)
              }else{
               
               $(formElement).attr('action','/agent-listing')
                return true;
              }
            }
           
      }
         
    }
     
    return viewModel;
  }

  SearchBar.prototype.init=function(){

    var _classInstance = this;

    _classInstance.viewModel = _classInstance.getViewModel();

   _classInstance.viewModel.minPriceText = ko.pureComputed(function() {
        var minPrice =  _classInstance.viewModel.minPrice();
        var minPriceText = "";
        if(minPrice){
          return _classInstance.getPriceText(minPrice)
        }else{
          return minPrice;
        }
        
    }, _classInstance.viewModel);

   _classInstance.viewModel.maxPriceText = ko.pureComputed(function() {

        var maxPrice =  _classInstance.viewModel.maxPrice();
        var minPriceText = "";
        if(maxPrice){
          var minPrice = _classInstance.viewModel.minPrice;
          if(minPrice && maxPrice<minPrice){
            
            _classInstance.viewModel.minPrice(100)
          } 
          
          return _classInstance.getPriceText(maxPrice)
        }else{
          return maxPrice;
        }

    }, _classInstance.viewModel);

    // disable dropdown
     $('#searchF').on('change','#__searchType__',function(){
        if($(this).val()=="agent" || $(this).val()=="locality"){
          $('#searchF').find('.__bhk__').dropdown('destroy')
          $('#searchF').find('.__bhk__').addClass('_disabled_')
          
           $('#searchF').find('.__budget__').dropdown('destroy')
          $('#searchF').find('.__budget__').addClass('_disabled_')
        } else{
          $('#searchF').find('.__bhk__').dropdown('enable')
          $('#searchF').find('.__bhk__').removeClass('_disabled_')

          $('#searchF').find('.__budget__').dropdown('enable')
          $('#searchF').find('.__budget__').removeClass('_disabled_')
        }
    });

    // disable dropdown ends here
    $('#searchF').on('change','#_city_',function(){
      var city = $(this).val();
      city = city.replace(/&nbsp;/gi,'')
      city = city.trim();
      _classInstance.viewModel.city(city)
      localStorage.setItem("city", city);
    });
    
    $('#searchF').on('click','._budgetItem_',function(){
      var minPrice = $('#_budget_').find(".minP").val();
      var maxPrice = $('#_budget_').find(".maxP").val();
      if(minPrice){
        _classInstance.viewModel.minPrice(minPrice)
      }
      if(maxPrice){
        _classInstance.viewModel.maxPrice(maxPrice)
      }
    });
    

    // $(".min").focus(function(){
    //   $(".min").toggleClass("active");
    //   $(".__visible").toggleClass("hidden")
    // });
     // $("#__searchAuto").autocomplete({
           
     //        source: function(request, response){
     //            var _self = this;

     //            if(_classInstance.viewModel.searchType()=='project'){
     //              _classInstance.projectAutocomplete(request.term,request,response)
     //            } else if(_classInstance.viewModel.searchType()=='agent'){
     //              _classInstance.agentAutocomplete(request.term,request,response)
     //            } else if(_classInstance.viewModel.searchType()=='locality'){
     //              alert(_classInstance.viewModel.searchType())
     //              _classInstance.projectAutocomplete(request.term,request,response,"location")
     //            }
     //          },
     //          minLength: 2,
     //          dataType: "json",
     //          cache: false,
     //          appendTo:'#autoDiv',
     //          select: function( event, ui ) {

     //              $("#__searchAuto").val(ui.item.name)
     //                _classInstance.resetReqParams();
     //               _classInstance.viewModel.name(ui.item.name);
     //               if(_classInstance.viewModel.searchType()=='agent'){
     //                if(_classInstance.type[ui.item.type]=='project'){
     //                  if(ui.item.productType == 'project'){
     //                    _classInstance.viewModel.sProAgents(true);
     //                  _classInstance.viewModel.projectId(ui.item.id);
     //                  }else{
     //                    alert(1)
     //                    _classInstance.viewModel.sLocAgents(true);
     //                  _classInstance.viewModel.projectId(ui.item.id);
     //                  }
                      
     //                } else{
     //                   _classInstance.viewModel.sProAgents(false);
     //                  _classInstance.viewModel.projectId("");
     //                }
                    
     //              } else if(_classInstance.viewModel.searchType()=='project'){
                    
     //                if(ui.item.productType == 'project'){
                    
     //                  location.href="/project/"+ui.item.id;
     //                } else {
     //                  _classInstance.listProjectsOfLocation(ui.item.id)
     //                }
                    
     //              }
     //               return false;
     //          }
     //          }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
     //            $(".ui-widget-content .ui-state-focus");
     //            var type="";
     //            var icon ="";
     //            if(item.type){
     //              type="<div class='description itLabel'>"+_classInstance.type[item.type]+"</div>"
     //            }

     //            if(item.type=='irx-euser') {
     //              icon = "<i class='icon user right floated'></i>"
     //            }else {
     //              icon ="<i class='icon building outline right floated'></i>"
     //            }
     //            var data = "<a class='item'>"+icon+"<div class='content'><div class='itLabel header'>"+item.name+"</div>"+type+"</div></div></a>"
     //            if(item.id == -1){
     //                data = "<div class='itLabel header _enter_'>Press enter to search...</div>"
     //            }
     //             return $( "<li class='ui divided list'>" ).append(data).appendTo(ul);
                
     //          };  
              $("#__searchAuto").autocomplete({
           
            source: function(request, response){
                var _self = this;
                var data={
                  "text":request.term,
                  "city":_classInstance.viewModel.city()
                }
                if(_classInstance.viewModel.searchType()=='project'){
                  _classInstance.projectAutocomplete(data,request,response)
                } else if(_classInstance.viewModel.searchType()=='agent'){
                  _classInstance.agentAutocomplete(data,request,response)
                } else if(_classInstance.viewModel.searchType()=='locality'){
                  data["type"]="location";
                  _classInstance.projectAutocomplete(data,request,response)
                }
              },
              minLength: 2,
              dataType: "json",
              cache: false,
              appendTo:'#autoDiv',
              select: function( event, ui ) {

                  $("#__searchAutoM").val(ui.item.name)
                    _classInstance.resetReqParams();
                    var textName = ui.item.name;
                     textName = textName.replace(/<(?:.|\n)*?>/gm, '');
                   _classInstance.viewModel.name(textName);
                   if(_classInstance.viewModel.searchType()=='agent'){
                    if(_classInstance.type[ui.item.type]=='project'){
                      if(ui.item.productType == 'project'){
                        
                        _classInstance.viewModel.sProAgents(true);
                      _classInstance.viewModel.projectId(ui.item.id);
                      }else{
                         
                        _classInstance.viewModel.sLocAgents(true);
                        _classInstance.viewModel.isLocality(true)
                      _classInstance.viewModel.projectId(ui.item.id);
                      }
                      
                    } else{
                       _classInstance.viewModel.sProAgents(false);
                      _classInstance.viewModel.projectId("");
                      location.href="/puneet.sharma";
                    }
                    
                  } else if(_classInstance.viewModel.searchType()=='project'){
                    
                    if(ui.item.productType == 'project'){
                    
                      location.href="/project/"+ui.item.id;
                    } else {
                     _classInstance.viewModel.projectId(ui.item.id);
                      _classInstance.viewModel.isLocality(true)
                      
                    }
                    
                  } else if(_classInstance.viewModel.searchType()=='locality'){
                   
                     $('#loc-pop-up').modal({
                        closable:false
                    }).modal('show');

                     _classInstance.viewModel.sLocAgents(true);
                      _classInstance.viewModel.isLocality(true)
                      _classInstance.viewModel.projectId(ui.item.id);
                  }
                   return false;
                  
              }
              }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
                $(".ui-widget-content .ui-state-focus");
                var type="";
                var icon ="";
                if(item.type){
                  type="<div class='description itLabel'>"+_classInstance.type[item.type]+"</div>"
                }

                if(item.type=='irx-euser') {
                  icon = "<i class='icon user right floated'></i>"
                }else {
                  icon ="<i class='icon building outline right floated'></i>"
                }
                var data = "<a class='item'>"+icon+"<div class='content'><div class='itLabel header'>"+item.name+"</div>"+type+"</div></div></a>"
                if(item.id == -1){
                 
                    data = "<a class='item'><div class='itLabel header _enter_'>Seaching for <b>"+item.name+"</b></div></a>"
                }
                 return $( "<li class='ui divided list'>" ).append(data).appendTo(ul);
                
              };  

    ko.applyBindings(_classInstance.viewModel,document.getElementById('searchF'));
  }
  SearchBar.prototype.getPriceText = function(amount) {
    var text = "";
    if(amount.length==4 || amount.length==5){
        amount = Number(amount)/1000;
        text = amount+"K";
      } else if(amount.length==6 || amount.length==7){
        amount = Number(amount)/100000;
        text = amount+"Lac";
      } else if(amount.length>8){
        amount = Number(amount)/10000000;
        text = amount+"Cr";
      } else {
        text = amount
      }
      return text;
  };
    SearchBar.prototype.fetchProjectResult=function(data){
      var classInstance = this;
          
          httpUtils.post("/list-projects-elastic",
                        {filters:data,page:classInstance.page},
                        {},"JSON",function(result){
            if(result.status==0){

              project.renderResult(result,data)
            }else{
            var arr = new Array();
              project.renderResult(arr,data)
            }
        })
     
    }

    SearchBar.prototype.resetReqParams=function(data){
      
      var _classInstance = this;
      _classInstance.viewModel.name("");
      _classInstance.viewModel.projectId("");
    }
    SearchBar.prototype.listProjectsOfLocation=function(localityId,filters){
      var classInstance = this;
          var data = {
            "localityId":localityId
          }
         
          
          httpUtils.post("/list-projects",
                        {filters:data,page:classInstance.page},
                        {},"JSON",function(result){
            if(result.status==0){
              
              project.renderResult(result,filters)
            }else{
            var arr = new Array();
              project.renderResult(arr,filters)
            }
        })
     
    }
    SearchBar.prototype.fetchAgentResult=function(data){
      var classInstance = this;
      classInstance.viewModel.projectId("");
      classInstance.viewModel.sProAgents(false);
      classInstance.viewModel.sProAgents(false);
      
      
           httpUtils.post("/list-agents",
            {filters:data,page:classInstance.page}
            ,{}
            ,"JSON"
            ,function(result){
          
              if(result.status==0){
                agent.renderResult(result,data)
              }else{
                var arr = new Array();
                agent.renderResult(arr,data)
              }
          })
     
    }
    SearchBar.prototype.resetAutocompleteFilters=function(data,location){
      var classInstance = this;
      classInstance.viewModel.sProAgents(false);
      classInstance.viewModel.sLocAgents(false);
    }
    SearchBar.prototype.fetchAgentOfProResult=function(data,location){
      var classInstance = this;
        classInstance.resetAutocompleteFilters();
          var params= {}
          if(location ){
            params = {"location":location}
          }

           httpUtils.get("/prefered-agents/"+classInstance.viewModel.projectId(),
            params
            ,"JSON"
            ,function(result){
          
              if(result.status==0){
                agent.renderResult(result,data)
              }else{
                var arr = new Array();
                agent.renderResult(arr,data)
              }
          })
     
    }
    
    SearchBar.prototype.projectAutocomplete=function(reqData,request,response){
      var classInstance = this;

      httpUtils.get("/project-autocomplete",reqData,"JSON",function(data){
       if(data.status==0){
        
          var arr = data.result;
         if(data.result == null){
          arr = new Array();
         }
       
          arr.push({fields:{id:[-1],name:reqData.text}})
          response($.map(arr, function(item) {
            var name ="";
            if(item.highlight && item.highlight.name && item.highlight.name.length > 0){
               name = item.highlight.name[0]
            }else{
              name = item.fields.name
            }
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
           // alert(locationName)
            return {id:item.fields.id[0],name:name,location:location,productType:productType,locationName:locationName};
          }));
        }
    })
    }
    SearchBar.prototype.agentAutocomplete=function(reqData,request,response){
      var classInstance = this;
      httpUtils.get("/autocomplete",reqData,"JSON",function(data){
        if(data.status==0){
           var arr = data.result;
         if(data.result == null){
          arr = new Array();
         }
         console.log(arr)
          arr.push({fields:{id:[-1],name:reqData.text}})
          response($.map(data.result, function(item) {
            var name ="";
            if(item.highlight && item.highlight.name && item.highlight.name.length > 0){
               name = item.highlight.name[0]
            }else{
              name = item.fields.name
            }    
            var productType="";
            if(item.fields.productType && item.fields.productType.length >0){
              productType = item.fields.productType[0]
            }
            return {id:item.fields.id[0],name:name,type:item._type,productType:productType};
          }));
        }
    })
    }

    var sBar = null;
$(document).ready(function(){

   sBar = new SearchBar();
  sBar.init();
   
  var city = localStorage.getItem("city");
  if(city){
    sBar.viewModel.showCity(city)
    sBar.viewModel.city(city)
  } else{
    sBar.viewModel.showCity("gurgaon")
    sBar.viewModel.showCity("Gurgaon")
  }

})