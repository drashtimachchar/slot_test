'use strict';

(function() {

class MainController {

 constructor($http,$mdMedia,$mdDialog) {
    this.message = 'Hello';
    this.$http=$http;
    this.appointment = [];
    this.slots = [];
    this.$mdMedia = $mdMedia;
    this.$mdDialog = $mdDialog;

    // Configure dates
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 
    // Create date and slots array
    this.days = [{dd:dd,mm:mm,yyyy:yyyy}];
    this.slots= [{h:'9',m:'00'},{h:'10',m:'00'},{h:'11',m:'00'},{h:'12',m:'00'},{h:'13',m:'00'},{h:'14',m:'00'},{h:'15',m:'00'},{h:'16',m:'00'},{h:'17',m:'00'}];
  }

  save(appointment){
    appointment.active=true;
    this.$http.post('/api/slots',appointment).then(res=>{
        this.dates = this.allot(this.slots,this.days,this.appointments);
        this.$http.get('/api/slots').then(response=>{
            this.appointments=response.data;
            this.dates = this.allot(this.slots,this.days,this.appointments);
        });
    });
  }
  
  $onInit(){
    var vm = this;
    this.$http.get('/api/slots').then(response=>{
        this.appointments=response.data;
        this.dates = this.allot(this.slots,this.days,this.appointments);
    });
  }
  delete(d){
      this.$http.delete('/api/slots/'+d._id);
  }
  

allot(slots, days, appointments){
 var a = [];
    _.each(days, function(d) { 
        var k=new Date(d.yyyy,d.mm,d.dd);
        
        var v = [];
        _.each(slots, function(s) { 
            var x = new Date(d.yyyy,d.mm,d.dd,s.h,s.m);
            var mx = moment(x);
            var active = true;
            _.each(appointments, function(g) { 
                var sdt = moment(new Date(g.date));
                if(moment.duration(sdt.diff(mx))._milliseconds===0){
                    active = false;
                }
            })
            v.push({date:x,active:active});
        })
        a.push({k:k,v:v});
    })
return a;
}


  showAdvanced(slot) {
      
      var vm = this;
    var useFullScreen = (this.$mdMedia('sm') || this.$mdMedia('xs'))  && this.customFullscreen;
    this.$mdDialog.show({
      controller: function($scope,$mdDialog,slot){
          $scope.customer = {};
          $scope.customer.slot = slot;
        $scope.answer = function(answer){
            $mdDialog.hide(answer);
        };
      },
      templateUrl: 'app/addData.html',
      locals : {
          slot : slot
      },
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })
    .then(function(answer) {
        answer.date = answer.slot.date;
        vm.save(answer);
    });
  }
}

angular.module('testApp')
  .component('slots', {
    templateUrl: 'app/slot.html',
    controller: MainController
  });

})();