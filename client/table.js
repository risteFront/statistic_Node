(function () {
  // $.post( "ajax/test.html", function( data ) {   $( ".result" ).html( data );
  // });
  angular
    .module('myApp', ["ngTable", 'ui.router'])
    .config([
      '$compileProvider',
      function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
      }
    ])
    // .config(function ($stateProvider, $urlRouterProvider) { $stateProvider
    //  .state('/.', {             url: '/', templateUrl: 'index.ejs'             })
    //             .state('uploads', {           url: '/uploads'             });
    //
    //         $urlRouterProvider.otherwise('/');     })
    .controller('mainCtrl', [
      '$scope',
      '$http',
      '$state',
      function ($scope, $http, $state) {

        // var jsonData = "text/csv;charset=utf-8," +
        // encodeURIComponent(JSON.stringify(data,0,4));
        $scope.saveFile = function () {
          $http
            .post("http://localhost:8000/uploads")
            .success(function (data) {
              $scope.loading = false;
              console.log(data)

              var dataFromRes = data

              function filterByID(item) {
                if (item.etime) {
                  return true;
                }
                return false;
              }

              var arrByID = dataFromRes.filter(filterByID);

              var reformattedArray = arrByID.map(function (obj) {
                var rObj = {};

                rObj.ulCounter = obj.ulCounter
                rObj.etime = obj.etime
                rObj.deui = obj.deui
                rObj.gw = obj.gw
                return rObj;
              });
              var temp
              var byUlcounter
              byUlcounter = reformattedArray.slice(0);
              byUlcounter.sort(function (a, b) {
                return a.ulCounter - b.ulCounter;
              });
              console.log(byUlcounter);

              var opts = [
                {
                  sheetid: 'One',
                  header: true
                }, {
                  sheetid: 'Two',
                  header: false
                }
              ];
              var res = alasql('SELECT * INTO XLSX("restest344b.xlsx",?) FROM ?', [opts, [data]
              ]);
            })
            .error(function (data, status) {
              alert('Please insert a csv file');
            })
        }

        $scope.saveFile2 = function saveFile() {
          console.log('test')
          // var opts = [
          //   {
          //     sheetid: 'One',
          //     header: true
          //   }, {
          //     sheetid: 'Two',
          //     header: false
          //   }
          // ];
          // var res = alasql('SELECT * INTO XLSX("restest344b.xlsx",?)  FROM ?', [opts, [byUlcounter]
          // ]);

        }
        // $scope.jsonUrl = 'data:' + jsonData; $scope.clickMe = function(){
        // $scope.loading = true;
        //
        //   // $scope.displayed= [];   // var data = [] $state.go('uploads'); for (var
        // j = 0; j < $scope.myWelcome.length; j++) {
        // $scope.displayed.push($scope.myWelcome[j]); data.push($scope.myWelcome[j]) }
        //      })      }; // $(document).ready(function() {
        // $('#example').DataTable( {          data: response.data,          columns: [
        //             { title: "ulCounter" },        { title: "timestamp" },
        //   { title: "fcnt" },              { title: "deui" },              { title:
        // "gw" },              { title: "ftime" },              { title: "ft2d" },
        //         { title: "snr" },  { title: "rssi" },              { title: "ant" },
        //             { title: "lsnr" },              { title: "rssic" },
        // { title: "lat" },          { title: "lon" }
        //
        //
        //
        //          ]      } );  } );

      }
    ])
    .directive('loading', function () {
      return {
        restrict: 'E',
        replace: true,
        template: '<div class="loading"><img src="http://www.nasa.gov/multimedia/videogallery/ajax-' +
            'loader.gif" width="20" height="20" />LOADING...</div>',
        link: function (scope, element, attr) {
          scope
            .$watch('loading', function (val) {
              if (val) 
                $(element).show();
              else 
                $(element).hide();
              }
            );
        }
      }
    })

})()