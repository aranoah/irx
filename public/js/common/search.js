
  function SearchBar(){
    this.page={
      start:0,
      pageSize:3
    }
  }
  SearchBar.prototype.init=function(){

    var _classInstance = this;

    _classInstance.viewModel = {
      name : ko.observable(""),
      bhk : ko.observable(""),
      order : ko.observable("asc")
      propertyType : ko.observable(""),
      searchF : function(formElement) {
        
        var self= this;
        var data =
            {
              name : self.name(),
              bhk : self.bhk(),
              type : self.propertyType(),
              order : self.order()        
            }; 
            if(typeof(project)!="undefined"){
                _classInstance.fetchResult(data)
              }else{
               $(formElement).attr('action','/project-listing')
                return true;
              }
      }
         
    }
     $("#__searchAuto").autocomplete({

            source: function(request, response){
                var _self = this;

              _classInstance.getProjectListing(request.term,request,response)
              },
              minLength: 2,
              dataType: "json",
              cache: false,
              appendTo:'#autoDiv',
              select: function( event, ui ) {
                  $('#__searchAuto').val(ui.item.name)
                   _classInstance.viewModel.name(ui.item.name);

                   return false;
              }
              }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
                $(".ui-widget-content .ui-state-focus");
                 return $( "<li>" ).append( "<a><div class='itLabel'>"+item.name+"</div></a>" ).appendTo(ul);
              };  
   
    ko.applyBindings(_classInstance.viewModel,document.getElementById('searchF'));
  }
   SearchBar.prototype.fetchResult=function(data){
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
    SearchBar.prototype.getProjectListing=function(text,request,response){
      var classInstance = this;
      httpUtils.get("/project-autocomplete",{"text":text},"JSON",function(data){
        if(data.status==0){
       
          response($.map(data.result, function(item) {
                        
                        return {id:item._source.id,name:item._source.name};
                      }));
        }
    })
    }

$(document).ready(function(){

  var sBar = new SearchBar();
  sBar.init();
})