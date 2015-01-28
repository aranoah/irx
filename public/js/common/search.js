
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
      searchType : ko.observable(""),
      sProAgents : ko.observable(false),
      projectId : ko.observable(""),
      city : ko.observable(""),
      showCity : ko.observable("city"),

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
              maxPrice : self.maxPrice()     
            }; 
            
            if(self.searchType()=='project'){
              if(typeof(project)!="undefined"){
                
                _classInstance.fetchProjectResult(data)
              }else{
               alert($('#_city_').val())
               $(formElement).attr('action','/project-listing')
                return true;
              }
            } else if(self.searchType()=='agent'){
              if(typeof(agent)!="undefined"){
                if(self.sProAgents()){
                  _classInstance.fetchAgentOfProResult(data)
                }else{
                  _classInstance.fetchAgentResult(data)  
                }
                
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
     $("#__searchAuto").autocomplete({
           
            source: function(request, response){
                var _self = this;
                if(_classInstance.viewModel.searchType()=='project'){
                  _classInstance.projectAutocomplete(request.term,request,response)
                } else if(_classInstance.viewModel.searchType()=='agent'){
                  _classInstance.agentAutocomplete(request.term,request,response)
                }
              },
              minLength: 2,
              dataType: "json",
              cache: false,
              appendTo:'#autoDiv',
              select: function( event, ui ) {

                  $('#__searchAuto').val(ui.item.name)
                   _classInstance.viewModel.name(ui.item.name);
                   if(_classInstance.viewModel.searchType()=='agent'){
                    if(_classInstance.type[ui.item.type]=='project'){
                      
                      _classInstance.viewModel.sProAgents(true);
                      _classInstance.viewModel.projectId(ui.item.id);
                    } else{
                       _classInstance.viewModel.sProAgents(false);
                      _classInstance.viewModel.projectId("");
                    }
                    
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
                    data = "<div class='itLabel header'>Press search ..</div>"
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
    SearchBar.prototype.fetchAgentResult=function(data){
      var classInstance = this;
      classInstance.viewModel.projectId("");
      classInstance.viewModel.sProAgents(false);
      
           httpUtils.post("/list-agents",
            {filters:classInstance.viewModel.filters,page:classInstance.page}
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
    SearchBar.prototype.fetchAgentOfProResult=function(data){
      var classInstance = this;
      alert(classInstance.viewModel.projectId())
           httpUtils.get("/prefered-agents/"+classInstance.viewModel.projectId(),
            {}
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
    
    SearchBar.prototype.projectAutocomplete=function(text,request,response){
      var classInstance = this;
      httpUtils.get("/project-autocomplete",{"text":text},"JSON",function(data){
       if(data.status==0){
        
          var arr = data.result;
         if(data.result == null){
          arr = new Array();
         }
         console.log(arr)
         arr.push({_source:{id:-1}})
          response($.map(arr, function(item) {
                        
            return {id:item._source.id,name:item._source.name,location:item._source.location};
          }));
        }
    })
    }
    SearchBar.prototype.agentAutocomplete=function(text,request,response){
      var classInstance = this;
      httpUtils.get("/autocomplete",{"text":text},"JSON",function(data){
        if(data.status==0){
           var arr = data.result;
         if(data.result == null){
          arr = new Array();
         }
         console.log(arr)
         arr.push({_source:{id:-1}})
          response($.map(data.result, function(item) {
                        
            return {id:item._source.id,name:item._source.name,type:item._type};
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
    sBar.viewModel.showCity("city")
  }

})