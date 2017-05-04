// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

    .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

    .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'OrderingCtrl'
    })

        .state('app.cart', {
        url: '/cart',
        views: {
            'menuContent': {                
                templateUrl: 'templates/cart.html'
            }
        }
    })

        .state('app.setmeals', {
        url: '/setmeals',
        views: {
            'menuContent': {
                templateUrl: 'templates/setmeals.html'
            }
        }
    })

        .state('app.appetizers', {
        url: '/appetizers',
        views: {
            'menuContent': {
                templateUrl: 'templates/appetizers.html'
            }
        }
    })

        .state('app.maindishes', {
        url: '/maindishes',
        views: {
            'menuContent': {
                templateUrl: 'templates/maindishes.html'
            }
        }
    })

        .state('app.sidedishes', {
        url: '/sidedishes',
        views: {
            'menuContent': {
                templateUrl: 'templates/sidedishes.html'
            }
        }
    })

        .state('app.beverages', {
        url: '/beverages',
        views: {
            'menuContent': {
                templateUrl: 'templates/beverages.html'
            }
        }
    })

        .state('app.desserts', {
        url: '/desserts',
        views: {
            'menuContent': {
                templateUrl: 'templates/desserts.html'
            }
        }
    })

        .state('app.salads', {
        url: '/salads',
        views: {
            'menuContent': {
                templateUrl: 'templates/salads.html'
            }
        }
    })

        .state('app.soups', {
        url: '/soups',
        views: {
            'menuContent': {
                templateUrl: 'templates/soups.html'
            }
        }
    })

        .state('app.viewbill', {
        url: '/viewbill',
        views: {
            'menuContent': {
                templateUrl: 'templates/viewbill.html'
            }
        }
    })
    
        .state('app.invoice', {
        url: '/invoice',
        views: {
            'menuContent': {
                templateUrl: 'templates/invoice.html',
                params: {
                    dishList: null
                }  
            }
        }
    })

        .state('app.promocode', {
        url: '/promocode',
        views: {
            'menuContent': {
                templateUrl: 'templates/promocode.html'
            }
        }
    })

        .state('app.settings', {
        url: '/settings',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/settings.html',
                controller: 'SettingsCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/setmeals');
});
