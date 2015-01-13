
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
  SearchBar.prototype.init=function(){

    var _classInstance = this;

    _classInstance.viewModel = {
      name : ko.observable(""),
      bhk : ko.observable(""),
      order : ko.observable("asc"),
      searchType : ko.observable(""),
      sProAgents : ko.observable(false),
      projectId : ko.observable(""),
      searchF : function(formElement) {
        
        var self= this;
        var data =
            {
              name : self.name(),
              bhk : self.bhk(),
              order : self.order(),
              projectId : self.projectId()        
            }; 
            
            if(self.searchType()=='project'){
              if(typeof(project)!="undefined"){
                _classInstance.fetchProjectResult(data)
              }else{
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
                var type=""
                if(item.type){
                  
                  type="<div class='itLabel'>"+_classInstance.type[item.type]+"</div>"

                }
                 return $( "<li>" ).append( "<a><div class='itLabel'>"+item.name+"</div>"+type+"</a>" ).appendTo(ul);
              };  
   
    ko.applyBindings(_classInstance.viewModel,document.getElementById('searchF'));
  }
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
       
          response($.map(data.result, function(item) {
                        
                        return {id:item._source.id,name:item._source.name};
                      }));
        }
    })
    }
    SearchBar.prototype.agentAutocomplete=function(text,request,response){
      var classInstance = this;
      httpUtils.get("/autocomplete",{"text":text},"JSON",function(data){
        if(data.status==0){
       
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
})