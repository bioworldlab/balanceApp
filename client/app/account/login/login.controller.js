'use strict';

angular.module('balanceApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

  $scope.login = function(form) {
            $scope.submitted = true;

            if (form.$valid) {
                Auth.login({
                        userName: $scope.user.userName,
                        password: $scope.user.password
                    })
                    .then(function() {
                        // Logged in, redirect to home
                        console.log('woks');
                        $location.path('/');
                    })
                    .catch(function(err) { console.log('errors')
                        $scope.errors.other = err.message;
                    });
            }
        };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
