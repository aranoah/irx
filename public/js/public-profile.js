
  function PublicProfile(options){
    this.url = null;
    this.viewModel = null;
    this.parentContainer = 'content'
    this.showProjects='project';
    this.showLocations='location';
    this.showReviews='review';
    
    this.projectsOnPage = 3;
    this.locationsOnPage = 3;
    this.page = {pageSize:5,start:0};
    this.locPage = {pageSize:5,start:0};
    this.reviewPage = {pageSize:5,start:0}
    this.userId = options.userId;
  } 

  PublicProfile.prototype.init = function() {
    var _classInstance = this;
    _classInstance.aPostReqViewModel = common.getViewModel('postAgent');
    common.aPostReqViewModel = _classInstance.aPostReqViewModel;
    ko.applyBindings(_classInstance.aPostReqViewModel,document.getElementById("_postA_"));
    _classInstance.viewModel = {
      msg:ko.observable(),
      projects: ko.observableArray(),
      reviews : ko.observableArray(),
      locations : ko.observableArray(),
      showMoreReviews : ko.observable(false),
      shouldShow : ko.observable(''),
      showButton : ko.observable('view'),
      showLocButton : ko.observable('view'),
      showAllProjects : function() {

          _classInstance.listProjects();
          this.shouldShow(_classInstance.showProjects);
      },
      claimProfile : function(id){
        httpUtils.get("/claim-profile/"+id,{},function(data){
          if(data.status == 0){
            
          }
        })
      },
      fbIntegration:function(irxId){
        
        return '<div class="fb-like" data-href="<%=locals.hosturl%>/'+irxId+'" data-layout="button_count" data-action="like" data-show-faces="true" data-share="false"></div>';
      },
      getDate : function (date){
        var d = new Date(date)
           
            var strHrs = ""+d.getHours()
            var hrs= strHrs.length>1?d.getHours():"0"+d.getHours();
            var strMin = ""+d.getMinutes();
            var min= strMin.length>1?d.getMinutes():"0"+d.getMinutes();
            var meridian = hrs>=12?"pm":"am"
            return d.toDateString()+" "+hrs+":"+min+" "+meridian;
      },
      hideAllProjects : function() {
          this.showButton('view');
          this.shouldShow('');
          _classInstance.resetPage();
          this.projects(this.projects().slice(0,3));
          
      },
      showAllLocations : function() {

          _classInstance.listUserLocations();
          this.shouldShow(_classInstance.showLocations);
      },
      hideAllLocations : function() {
          this.showLocButton('view');
          this.shouldShow('');
          _classInstance.resetLocPage();
          this.locations(this.locations().slice(0,3));
          
      },
      enquire : function(){
        $('#_userIdC_').val($('#'+_classInstance.parentContainer).find('#__irxId').val())
        $("#cInfo input[name='name'],#cInfo input[name='emailId'],#cInfo input[name='mobileNo']").val('');
        $('#cInfo').modal({
          closable:false
        }).modal('show');
       
      },
      listMoreReviews : function(){
        _classInstance.listReviews(true)
      },
      addReply : function(){
        var rating = $('.rate').rating('get rating');
        httpUtils.post("/irx/review/"+_classInstance.userId,{"msg":_classInstance.viewModel.msg(),"rating":rating},{},"JSON",function(data){
          if(data.status == 0){
            if(data.result != null){
              _classInstance.viewModel.reviews.unshift(data.result)

            }
          }
        })
      },
      addAgent:function(name,id,companyName,imageUrl){
        var agent={"name":name,"id":id,"companyName":companyName,"irxId":id,imageUrl:imageUrl}
        var arr=[];
        arr.push(agent)
        common.resetForm(_classInstance.aPostReqViewModel,$('#_postA_').find('form'));
        _classInstance.aPostReqViewModel.data.agentId([])
        //for future it has been kept araay and push all so that we can select multuiple agents
        // and send them leads
        common.initializeFromLocalStorage(_classInstance.aPostReqViewModel);
        ko.utils.arrayPushAll(_classInstance.aPostReqViewModel.data.agentId,arr);
        //console.log("yo !!",_classInstance.aPostReqViewModel.data.agentId())
       
        $('#_postA_').modal({
              closable:false
            }).modal('show');
        },
        listReviews : function(){
          _classInstance.resetReviwPage();
          _classInstance.listReviews(false);

        }
      }
     
    ko.applyBindings(_classInstance.viewModel,document.getElementById(_classInstance.parentContainer));
    _classInstance.listProjects();
    _classInstance.listUserLocations();
    _classInstance.addToLastVisited();
    var ratingPlugin = $('.rate').rating();
  
  };
  PublicProfile.prototype.resetPage = function() {
    this.page.start = this.projectsOnPage;
  }
  PublicProfile.prototype.resetLocPage = function() {
    this.locPage.start = this.locationsOnPage;
  }
  PublicProfile.prototype.resetReviwPage = function() {
    this.reviewPage.start = 0;
  }


  PublicProfile.prototype.listProjects = function() {
    
    var classInstance = this;
    httpUtils.get("/list-user-projects/"+classInstance.userId,{page:classInstance.page},"JSON",function(data){
       if(data.status==0){
        if(data.result != null){
          ko.utils.arrayPushAll(classInstance.viewModel.projects,data.result.projects)
        classInstance.page.start = Number(data.page.start)+Number(data.page.pageSize);
        if (data.page.hasMore) {
          classInstance.viewModel.showButton('view');
        }else{
          classInstance.viewModel.showButton('hide');
        }
        }
        
       } 
    })
  }

PublicProfile.prototype.listReviews = function(append) {
    
    var classInstance = this;
    httpUtils.get("/reviews/"+classInstance.userId,{page:classInstance.reviewPage},"JSON",function(data){
       if(data.status==0){
        var newList=[];
        if(data.result != null){
          if(!append){
            classInstance.viewModel.reviews([])
          }
          ko.utils.arrayPushAll(classInstance.viewModel.reviews,data.result)

        classInstance.reviewPage.start = Number(data.page.start)+Number(data.page.pageSize);
        if (data.page.hasMore==true) {
          
          classInstance.viewModel.showMoreReviews(true);
        }else{

          classInstance.viewModel.showMoreReviews(false);
        }
        $('.ui.star.rating.indiv')
          .rating({
            interactive:false,
            maxRating: 5
          })
        ;
        }
        
       } 
    })
  }
   PublicProfile.prototype.listUserLocations = function() {
    var classInstance = this;
    httpUtils.get("/list-user-locations/"+classInstance.userId,{page:classInstance.locPage},"JSON",function(data){
       if(data.status==0){
        ko.utils.arrayPushAll(classInstance.viewModel.locations,data.result)
         classInstance.locPage.start = Number(data.page.start)+Number(data.page.pageSize);
        if (data.page.hasMore==true) {
          classInstance.viewModel.showLocButton('view');
        }else{

          classInstance.viewModel.showLocButton('hide');
        }
       } 
    })
  }
  PublicProfile.prototype.addToLastVisited = function(){
    httpUtils.post("/add-last-visited",{"name":$('#__name_').val(),"url":"http://indianrealtyexchange.com/"+$('#__id_').val(),"type":"user"},{},"JSON",function(data){
        
        })
  }
  $(document).ready(function(){
    var userId=$('#__userId').val();
    var publicProfile = new PublicProfile({"userId":userId})
    publicProfile.init();
  })