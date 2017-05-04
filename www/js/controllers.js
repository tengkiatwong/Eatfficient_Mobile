angular.module('starter.controllers', [])

    .controller('OrderingCtrl', ['$scope', '$rootScope', '$ionicModal', '$timeout', '$ionicPopup', '$state', 'Orders', 'Payments', 'Menus', 'Tables', 'Promotions', 'Members', 'Outlets', 'CardTypeIdentifier', '$interval', function($scope, $rootScope, $ionicModal, $timeout, $ionicPopup, $state, Orders, Payments, Menus, Tables, Promotions, Members, Outlets, CardTypeIdentifier, $interval) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $rootScope.balance = 0;
        $scope.loginData = {};
        $scope.badgeCount = 0;
        $scope.order = {
            'tableNumber':1,
            'isTakeaway':false,
            'dishList':[]
        }

        $scope.receipt = {
            contact: ""
        }


        $scope.orders=[
            {'dishList':null}
        ];
        $scope.balance = 0;
        $scope.discount = {
            'value': null
        }
        $scope.amtPaid;
        $scope.paymentType="epayment";
        $scope.promoCodeEntered;
        $scope.promoCode;
        $scope.code ={};
        $scope.selectedItem;
        $scope.menu = {}
        $scope.promotions = {};
        $scope.setMeal = {};
        $scope.appetizers = {};
        $scope.mainCourse = {};
        $scope.sideDish = {};
        $scope.beverages = {};
        $scope.desserts = {};
        $scope.salads = {};
        $scope.soups = {};
        $scope.pointsPolicy = {
            numberOfPoints: null,
            discount: null,
            redeemable: false    
        }

        $scope.comments = [
            { "comment": " " },
            { "comment": "Less Spicy" },
            { "comment": "More Spicy" },
            { "comment": "Less Salt" },
            { "comment": "More Salt" },
            { "comment": "Less Oil" },
            { "comment": "More Oil" },
            { "comment": "Other:"}
        ] 

        $scope.orderCart = [
            //        { "name": "Eggs Benedict", "dishId": 1, "price": 5, "img": "idish1.jpg", "description": "Rise with the benedict  ", 'quantity': 2, 'comment': 'No oil'},
            //        { "name": "Eggs Benedict 2", "dishId": 2, "price": 3, "img": "idish2.jpg", "description": "Feel afreshed with a taste of the creamy well-made benedict, number 2", 'quantity': 3, 'comment': 'No oil' }, 
            //        { "name": "Spring Roll?", "dishId": 3, "price": 4, "img": "idish3.jpg", "description": "this is a dish", 'quantity': 1, 'comment': 'No oil' }, 
            //        { "name": "Random Chicken Wings", "dishId": 4, "price": 6, "img": "idish4.jpg", "description": "this is a dish", 'quantity': 1, 'comment': 'No oil' },
            //        { "name": "The Real Spring Roll", "dishId": 5, "price": 2, "img": "idish5.jpg", "description": "this is a dish", 'quantity': 3, 'comment': 'No oil' }, 
        ];
        $scope.member = {
            'isVIP': null,
            'name': null,
            'birthDate': null,
            'contactNumber': null,
            'points': null,
            'memberID': 0,
            'redeemed': false
        }
        $scope.menuSelected = "setmeals";
        $scope.today;

        $scope.extractMenuDish = function(submenu){
            switch(submenu.category){
                case 'Set Meal':
                    var setMealList = submenu.setMealIDs.split('#');
                    for(o in setMealList){                    
                        var tempList = (setMealList[o].split('@'));
                        var tempItem = {};
                        //                        tempItem.setMealId = tempList[0];
                        tempItem.dishId = parseInt(tempList[0]);
                        tempItem.name = tempList[1];
                        tempItem.price = tempList[2];
                        tempItem.description = tempList[3];
                        if(tempItem.description == 'null'){
                            tempItem.description = null;
                        }
                        tempItem.selectionList = tempList[4];
                        tempItem.img = "img/setmeal.jpg";
                        setMealList[o] = tempItem;
                    };
                    for(o in setMealList){
                        setMealList[o].selectionList = setMealList[o].selectionList.split('*');
                    }
                    for(i in setMealList){
                        for(j in setMealList[i].selectionList){
                            var tempList = setMealList[i].selectionList[j].split('%');
                            var tempItem = {};
                            tempItem.category = tempList[0];
                            tempItem.selectNumber = tempList[1];
                            tempItem.selectDishList = tempList[2].split('~');
                            setMealList[i].selectionList[j] = tempItem; 

                            for(k in tempItem.selectDishList){
                                var tempList2 = tempItem.selectDishList[k].split('^');
                                var tempItem2 = {};
                                tempItem2.dishId = parseInt(tempList2[0]);
                                tempItem2.name = tempList2[1];
                                tempItem2.price = tempList2[2];
                                tempItem2.description = tempList2[3];
                                if(tempItem2.description == 'null'){
                                    tempItem2.description = null;
                                }
                                tempItem.selectDishList[k] = tempItem2;
                            }
                        }
                    }
                    $scope.setMeal = setMealList;                    
                    break;
                case 'Appetizers':    
                    var appetizersList = submenu.dishIDs.split('#');
                    for(o in appetizersList){
                        var tempList = appetizersList[o].split('@');
                        var tempItem = {};
                        tempItem.dishId = parseInt(tempList[0]);
                        tempItem.name = tempList[1];
                        tempItem.price = tempList[2];
                        tempItem.description = tempList[3];
                        if(tempItem.description == 'null'){
                            tempItem.description = null;
                        }
                        tempItem.img = 'http://52.187.179.134:8080'+tempList[4]+'.jpg';
                        appetizersList[o] = tempItem;
                    }

                    $scope.appetizers = appetizersList; 
                    break;
                case 'Main Course':
                    var maincourseList = submenu.dishIDs.split('#');
                    for(o in maincourseList){
                        var tempList = maincourseList[o].split('@');
                        var tempItem = {};
                        tempItem.dishId = parseInt(tempList[0]);
                        tempItem.name = tempList[1];
                        tempItem.price = tempList[2];
                        tempItem.description = tempList[3];
                        if(tempItem.description == 'null'){
                            tempItem.description = null;
                        }
                        tempItem.img = 'http://52.187.179.134:8080'+tempList[4]+'.jpg';
                        maincourseList[o] = tempItem;
                    }

                    $scope.mainCourse = maincourseList;                    
                    break;
                case 'Side Dish':
                    var sidedishList = submenu.dishIDs.split('#');
                    for(o in sidedishList){
                        var tempList = sidedishList[o].split('@');
                        var tempItem = {};
                        tempItem.dishId = parseInt(tempList[0]);
                        tempItem.name = tempList[1];
                        tempItem.price = tempList[2];
                        tempItem.description = tempList[3];
                        if(tempItem.description == 'null'){
                            tempItem.description = null;
                        }
                        tempItem.img = 'http://52.187.179.134:8080'+tempList[4]+'.jpg';
                        sidedishList[o] = tempItem;
                    }
                    $scope.sideDish = sidedishList;
                    break;
                case 'Beverages':
                    var beveragesList = submenu.dishIDs.split('#');
                    for(o in beveragesList){
                        var tempList = beveragesList[o].split('@');
                        var tempItem = {};
                        tempItem.dishId = parseInt(tempList[0]);
                        tempItem.name = tempList[1];
                        tempItem.price = tempList[2];
                        tempItem.description = tempList[3];
                        if(tempItem.description == 'null'){
                            tempItem.description = null;
                        }
                        tempItem.img = 'http://52.187.179.134:8080'+tempList[4]+'.jpg';
                        beveragesList[o] = tempItem;
                    }

                    $scope.beverages = beveragesList;
                    break;
                case 'Desserts':
                    var dessertsList = submenu.dishIDs.split('#');
                    for(o in dessertsList){
                        var tempList = dessertsList[o].split('@');
                        var tempItem = {};
                        tempItem.dishId = parseInt(tempList[0]);
                        tempItem.name = tempList[1];
                        tempItem.price = tempList[2];
                        tempItem.description = tempList[3];
                        if(tempItem.description == 'null'){
                            tempItem.description = null;
                        }
                        tempItem.img = 'http://52.187.179.134:8080'+tempList[4]+'.jpg';
                        dessertsList[o] = tempItem;
                    }

                    $scope.desserts = dessertsList; 
                    break;
                case 'Salads':
                    var saladsList = submenu.dishIDs.split('#');
                    for(o in saladsList){
                        var tempList = saladsList[o].split('@');
                        var tempItem = {};
                        tempItem.dishId = parseInt(tempList[0]);
                        tempItem.name = tempList[1];
                        tempItem.price = tempList[2];
                        tempItem.description = tempList[3];
                        if(tempItem.description == 'null'){
                            tempItem.description = null;
                        }
                        tempItem.img = 'http://52.187.179.134:8080'+tempList[4]+'.jpg';
                        saladsList[o] = tempItem;
                    }

                    $scope.salads = saladsList;
                    break;
                case 'Soups':
                    var soupsList = submenu.dishIDs.split('#');
                    for(o in soupsList){
                        var tempList = soupsList[o].split('@');
                        var tempItem = {};
                        tempItem.dishId = parseInt(tempList[0]);
                        tempItem.name = tempList[1];
                        tempItem.price = tempList[2];
                        tempItem.description = tempList[3];
                        if(tempItem.description == 'null'){
                            tempItem.description = null;
                        }
                        tempItem.img = 'http://52.187.179.134:8080'+tempList[4]+'.jpg';                        
                        soupsList[o] = tempItem;
                    }

                    $scope.soups = soupsList;                    
                    break;
                default:
                    break;                
            }
        }
        Menus.getMenu().then(function(){
            console.log("this is the data retrieved");
            $scope.menus = Menus.menus;
            for(d in $scope.menus.dishDetails){
                $scope.extractMenuDish($scope.menus.dishDetails[d]);
            }
            for(s in $scope.menus.setMealDetails){
                $scope.extractMenuDish($scope.menus.setMealDetails[s]);
            }
            console.log($scope);
        });

        // Get today's date
        var init = function(){
            var todayDate = new Date();
            var dd = todayDate.getDate();
            var mm = todayDate.getMonth()+1; //January is 0!

            var yyyy = todayDate.getFullYear();

            var monthNames = ["January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"
                             ];

            $scope.date = todayDate.getDate();
            $scope.month = monthNames[todayDate.getMonth()+1];
            $scope.year = todayDate.getFullYear();

            if(dd<10){
                dd='0'+dd;
            } 
            if(mm<10){
                mm='0'+mm;
            } 
            var todayDate = yyyy+'-'+mm+'-'+dd;
            $scope.today = todayDate;   
        }

        init();

                                 $interval(function(){
                                           Menus.getMenu().then(function(){
                                                                console.log("this is the data retrieved");
                                                                $scope.menus = Menus.menus;
                                                                for(d in $scope.menus.dishDetails){
                                                                $scope.extractMenuDish($scope.menus.dishDetails[d]);
                                                                }
                                                                for(s in $scope.menus.setMealDetails){
                                                                $scope.extractMenuDish($scope.menus.setMealDetails[s]);
                                                                }
                                                                console.log($scope);
                                                                });
                                           }, 5000);
                                 
                                 
        Outlets.getOutletPointsPolicy().then(function(data){
            var tokenizer = data.data.split(":");
            if(tokenizer[0] == false){
                return;
            }
            else{
                $scope.pointsPolicy.numberOfPoints = parseInt(tokenizer[1]);
                $scope.pointsPolicy.discount = parseInt(tokenizer[2]);
                $scope.pointsPolicy.redeemable = true;
            }
        }) 

        $scope.processPromotions = function(){
            for(o in $scope.promotions){                
                $scope.promotions[o].active = false;
                for(i in $scope.promotions[o].customerGroup){
                    if($scope.promotions[o].customerGroup[i]=="All customers"){
                        $scope.promotions[o].active = true;
                    }
                    if($scope.promotions[o].customerGroup[i]=="Member"){
                        if($scope.member.memberName){
                            $scope.promotions[o].active = true;
                        }
                    }
                    if($scope.promotions[o].customerGroup[i]=="Promotion Code"){
                        if($scope.promoCode == $scope.promotions[o].promoCode){
                            $scope.promotions[o].active = true;
                        }
                    }
                }
            }
        }

        Promotions.getAllPromotions().then(function(){
            console.log('call promotions finish');
            $scope.promotions = Promotions.promotions;
            $scope.processPromotions();
        })


        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/modal_login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalLogin = modal;
        });


        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/modal_addtocart.html', {
            scope: $scope,
            animation: 'fade-in'
        }).then(function(modal) {
            $scope.modalAddItem = modal;
        }); 

        // Create the promocode modal that we will use later
        $ionicModal.fromTemplateUrl('templates/modal_promocode.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalPromoCode = modal;
        });

        // Create the promocode modal that we will use later
        $ionicModal.fromTemplateUrl('templates/modal_entercontactnum.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalReceiptContact = modal;
        });

        //        Create the epayment modal that we will use later
        $ionicModal.fromTemplateUrl('templates/modal_epayment.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalEpayment = modal;
        });

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });          

        // Open the login modal
        $scope.login = function() {
            $scope.loginData={};
            $scope.modalLogin.show();
        };   

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);
            Members.verifyMember( $scope.loginData.contactNumber).then(function(data){
                if(data.data.message == 'Member found'){
                    $scope.member = data.data;
                    console.log($scope.member);
                    $scope.processPromotions();
                    console.log('after member login' ,$scope.promotions);
                    $scope.modalLogin.hide();
                }
                if(data.data.message == 'Member not found'){
                    var alertPopup = $ionicPopup.alert({            
                        template: '<p style="text-align:center">Member not found</p>'
                    });

                    alertPopup.then(function(res) {
                        if(res) {                                         
                            console.log("Yes")
                        } else {
                            console.log('No');
                        }
                    });
                }
            }) 


        };     

        $scope.doLogout = function(){
            var confirmPopup = $ionicPopup.confirm({            
                template: '<p style="text-align:center">Log out?</p>'
            });

            confirmPopup.then(function(res) {
                if(res) {                                         
                    $scope.member = {
                        'isVIP': null,
                        'name': null,
                        'birthDate': null,
                        'contactNumber': null,
                        'points': null,
                        'memberID': 0,
                        'redeemed': false,
                    }
                    $scope.processPromotions();        
                } else {
                    console.log('Press wrong');
                }
            });
        }

        $scope.enterReceiptContact = function(){
            $scope.receipt.contactNumber = "";
            $scope.modalReceiptContact.show();
        }

        $scope.receiptContact = function(contact){
            $scope.receipt.contact = contact;
            console.log($scope.receipt.contact);
            $scope.modalReceiptContact.hide();
        }

        $scope.clickMenu = function(choice){
            $scope.menuSelected=choice;
        }

        $scope.goToCart = function() {
            $scope.badgeCount=0;
            console.log($scope.orderCart);                
            if($scope.orderCart.length==0){
                var alertPopup = $ionicPopup.alert({            
                    template: '<p style="text-align:center">Your order cart is empty!</p>'
                });

                alertPopup.then(function(res) {
                    if(res) {                                         
                        console.log("Yes")
                    } else {
                        console.log('No');
                    }
                }); 
            }
            else {            
                $state.go('app.cart');

                console.log($scope);
            }
        }

        $scope.addItem = function(item){
            console.log('add item', item)
            $scope.selectedItem = item;
            $scope.selectedItem.quantity=1;
            $scope.selectedItem.comment = null;
            $scope.selectedItem.otherComment = null;
            if(item.selectionList){
                $scope.selectedItem.selectionList = item.selectionList;
                for(o in $scope.selectedItem.selectionList){
                    $scope.selectedItem.selectionList[o].selectedDish=[];
                }                
            }
            $scope.modalAddItem.show();
        }

        $scope.addToCart = function(item) {          
            $scope.modalAddItem.hide(); 
            item.sideDishes = [];
            item.sideDishNames = [];
            if(item.comment=="Other:"){
                item.comment=item.otherComment;
            }
            if(item.comment==" " || item.comment=="" || item.comment==null){
                delete item.comment;             
            } 
            if(!item.selectionList){
                delete item.sideDishes;
            }
            //            else{
            //                delete item.sideDishes;
            //                item.category="Alacarte";
            //            }
            for(i in item.selectionList){
                for(j in item.selectionList[i].selectedDish){
                    for(k in item.selectionList[i].selectDishList){
                        if(item.selectionList[i].selectedDish[j].name == item.selectionList[i].selectDishList[k].name){
                            item.selectionList[i].selectedDish[j].dishId = item.selectionList[i].selectDishList[k].dishId;
                            item.price = parseInt(item.price) + parseInt(item.selectionList[i].selectDishList[k].price);
                            item.sideDishes.push(item.selectionList[i].selectDishList[k].dishId);
                            item.sideDishNames.push({'name': item.selectionList[i].selectDishList[k].name});
                        }
                    }
                }
            }
            console.log('new order', item)
            $scope.orderCart.push(item);
            $scope.badgeCount++;
        }

        $scope.upArrow = function(selectedItem){
            selectedItem.quantity++;
        }

        $scope.downArrow = function(selectedItem){
            selectedItem.quantity--;
        }    

        $scope.removeItemFromCart = function(index){
            $scope.orderCart.splice(index,1);
        }

        $scope.sendOrder = function(){        
            if($scope.orderCart.length ==0){
                var alertPopup = $ionicPopup.alert({            
                    template: '<p style="text-align:center">Your order cart is empty!</p>'
                });

                alertPopup.then(function(res) {
                    if(res) {                                         
                        console.log("Yes")
                    } else {
                        console.log('No');
                    }
                }); 
                return;
            }
            $scope.order.dishList = $scope.orderCart;
            console.log($scope.order);
            Orders.newOrder($scope.order).then(function(){
                var alertPopup = $ionicPopup.alert({            
                    template: '<p style="text-align:center">Orders sent!</p>'
                });

                alertPopup.then(function(res) {
                    if(res) {                                         
                        console.log("Yes")
                    } else {
                        console.log('No');
                    }
                });
                $scope.orderCart=[];
            })
        }

        //redeem member loyalty rewards
        $ionicModal.fromTemplateUrl('templates/modal_redeemReward.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.redeemRewardModal = modal;      
        });

        $scope.redeemReward = function(){
            $scope.redeemRewardModal.show();
        }

        $scope.redeemMemberPoints = function() {
            //redeem points
            if($scope.member.points < $scope.pointsPolicy.numberOfPoints){
                var alertPopup = $ionicPopup.alert({            
                    template: '<p style="text-align:center">Not enough points to redeem</p>'
                });

                alertPopup.then(function(res) {
                    if(res) {                                         
                        console.log("Yes")
                    } else {
                        console.log('No');
                    }
                });
            }
            $scope.member.redeemed = true; 
            $scope.redeemRewardModal.hide();
        }

        $scope.viewBill = function(){
            Orders.getTableOrder($scope.order.tableNumber).then(function(data){    
                $scope.orders = data.data;
                console.log("message: " + $scope.orders.Message);
                for(i in $scope.orders){
                    for(o in $scope.orders[i].dishList){
                        if($scope.orders[i].dishList[o][$scope.orders[i].dishList[o].dishId].length!=0){
                            for(j in $scope.orders[i].dishList[o][$scope.orders[i].dishList[o].dishId]){
                                var tempArr = $scope.orders[i].dishList[o][$scope.orders[i].dishList[o].dishId][j].split(':');
                                $scope.orders[i].dishList[o][$scope.orders[i].dishList[o].dishId][j] = {};
                                $scope.orders[i].dishList[o][$scope.orders[i].dishList[o].dishId][j].dishId = tempArr[0];
                                $scope.orders[i].dishList[o][$scope.orders[i].dishList[o].dishId][j].name = tempArr[1];
                            }
                        }
                    }
                }
                console.log($scope.orders)         
                $scope.combineOrders();
            });
        }

        $scope.combineOrders = function(){
            if(!$scope.orders.length){
                return;
            }        
            else{           
                /*
            for(o in $scope.orders){
                if($scope.orders[o].orderStatus=='OrderReceived' || $scope.orders[o].orderStatus=='OrderProcessing'){
                    alert("There are orders not completed!");
                    return;
                }
            }
            */
                var tempOrderList = {
                    'orderId' : '',
                    'dishList': [],
                    'tableNumber': $scope.orders[0].tableNumber,
                    'isTakeaway': false
                };
                for(var i=0; i<$scope.orders.length; i++){                           
                    if(!$scope.orders[i].isPaid){
                        tempOrderList.orderId = tempOrderList.orderId+','+$scope.orders[i].orderId;
                        for(d in $scope.orders[i].dishList){
                            tempOrderList.dishList.push($scope.orders[i].dishList[d]);
                        }
                        $scope.orders.splice(i,1);
                        i--;                
                    }
                }        
                tempOrderList.orderId = tempOrderList.orderId.substr(1);
                if(tempOrderList.dishList.length!=0){
                    $scope.orders.unshift(tempOrderList);
                }                                                     
            }
            console.log('after combining', $scope);
        }

        $scope.getSubtotal = function(dishList){
            $scope.subtotal=0;
            for(o in dishList){
                $scope.subtotal+=dishList[o].price*dishList[o].quantity;
            }
            return $scope.subtotal;
            console.log($scope.subtotal);
        }

        //        $scope.getGst = function(){
        //            return $scope.getSubtotal()*1.1*0.07;
        //        }

        //        $scope.getTotal = function(){
        //            $scope.total = Math.round( ($scope.getSubtotal()+$scope.getServiceCharge())*100 )/100;
        //            return $scope.total;
        //        }

        $scope.getDiscount = function(dishList){            
            $scope.discount.discountedprice = $scope.subtotal;
            $scope.discount.value = 0;

            for(o in $scope.promotions){
                                 for(i in $scope.promotions[o].customerGroup){
                if($scope.discount.discountedprice != 0){
                    if($scope.promotions[o].customerGroup[i] == "Promotion Code"){
                        if($scope.promotions[o].active){
                            $scope.applyPromotion($scope.promotions[o]);
                        }
                    }
                                 }
                }
            }
            for(o in $scope.promotions){
                                  for(i in $scope.promotions[o].customerGroup){
                if($scope.discount.discountedprice != 0){
                    if($scope.promotions[o].customerGroup[i] == "All customers"){
                        if($scope.promotions[o].active){
                            $scope.applyPromotion($scope.promotions[o]);
                        }
                    }
                }
                                 }
            }
            for(o in $scope.promotions){
                                  for(i in $scope.promotions[o].customerGroup){
                if($scope.discount.discountedprice != 0){
                    if($scope.promotions[o].customerGroup[i] == "Member"){
                        if($scope.promotions[o].active){
                            console.log('member is active');
                            console.log($scope.promotions[o].promoID)
                            $scope.applyPromotion($scope.promotions[o]);
                        }
                    }
                                 }
                }
            }

            if($scope.member.redeemed){
                console.log('checking ' + $scope.discount.discountedprice + " " + $scope.pointsPolicy.discount)
                if($scope.discount.discountedprice < $scope.pointsPolicy.discount){
                    $scope.discount.discountedprice = 0;
                }
                else{
                    $scope.discount.discountedprice -= $scope.pointsPolicy.discount;
                }
            }

            // for(o in $scope.promotions){
            //     if($scope.discount.discountedprice != 0){
            //         if($scope.promotions[o].customerGroup == "Visa"){
            //             if($scope.details.creditType == "visa"){
            //                 console.log('applying visa promotions');
            //                 $scope.applyPromotion($scope.promotions[o]);
            //             }
            //         }
            //     }
            // }
            // for(o in $scope.promotions){
            //     if($scope.discount.discountedprice != 0){
            //         if($scope.promotions[o].customerGroup == "MasterCard"){
            //             if($scope.details.creditType == "mastercard"){
            //                 console.log('applying mastercard promotions');
            //                 $scope.applyPromotion($scope.promotions[o]);
            //             }
            //         }
            //     }
            // }
            // for(o in $scope.promotions){
            //     if($scope.discount.discountedprice != 0){
            //         if($scope.promotions[o].customerGroup == "American Express(AMEX)"){
            //             if($scope.details.creditType == "amex"){
            //                 console.log('applying amex promotions');
            //                 $scope.applyPromotion($scope.promotions[o]);
            //             }
            //         }
            //     }
            // }
            // for(o in $scope.promotions){
            //     if($scope.discount.discountedprice != 0){
            //         if($scope.promotions[o].customerGroup == "Diners Club"){
            //             if($scope.details.creditType == "diners"){
            //                 console.log('applying diners promotions');
            //                 $scope.applyPromotion($scope.promotions[o]);
            //             }
            //         }
            //     }
            // }
            // for(o in $scope.promotions){
            //     if($scope.discount.discountedprice != 0){
            //         if($scope.promotions[o].customerGroup == "OCBC"){
            //             if($scope.details.creditType == "ocbc"){
            //                 console.log('applying ocbc promotions');
            //                 $scope.applyPromotion($scope.promotions[o]);
            //             }
            //         }
            //     }
            // }
            // for(o in $scope.promotions){
            //     if($scope.discount.discountedprice != 0){
            //         if($scope.promotions[o].customerGroup == "DBS"){
            //             if($scope.details.creditType == "dbs"){
            //                 console.log('applying dbs promotions');
            //                 $scope.applyPromotion($scope.promotions[o]);
            //             }
            //         }
            //     }
            // }
            // for(o in $scope.promotions){
            //     if($scope.discount.discountedprice != 0){
            //         if($scope.promotions[o].customerGroup == "UOB"){
            //             if($scope.details.creditType == "uob"){
            //                 console.log('applying uob promotions');
            //                 $scope.applyPromotion($scope.promotions[o]);
            //             }
            //         }
            //     }
            // }
            // for(o in $scope.promotions){
            //     if($scope.discount.discountedprice != 0){
            //         if($scope.promotions[o].customerGroup == "Standard Chartered"){
            //             if($scope.details.creditType == "stanchart"){
            //                 console.log('applying stanchart promotions');
            //                 $scope.applyPromotion($scope.promotions[o]);
            //             }
            //         }
            //     }
            // }
            // for(o in $scope.promotions){
            //     if($scope.discount.discountedprice != 0){
            //         if($scope.promotions[o].customerGroup == "Citibank"){
            //             if($scope.details.creditType == "citibank"){
            //                 console.log('applying citibank promotions');
            //                 $scope.applyPromotion($scope.promotions[o]);
            //             }
            //         }
            //     }
            // }
            // for(o in $scope.promotions){
            //     if($scope.discount.discountedprice != 0){
            //         if($scope.promotions[o].customerGroup == "Maybank"){
            //             if($scope.details.creditType == "maybank"){
            //                 console.log('applying maybank promotions');
            //                 $scope.applyPromotion($scope.promotions[o]);
            //             }
            //         }
            //     }
            // }
            $scope.discount.value = $scope.subtotal - $scope.discount.discountedprice;
            if($scope.discount.value == 0){
                return 0;
            }
            else{
                return $scope.discount.value;
            }
        }

        $scope.applyPromotion = function(promotion){
            console.log("promotion ID is", promotion.promoID);
            var startDate = new Date(promotion.startDate);
            console.log('start date ', startDate);
            var endDate = new Date(promotion.endDate);
            console.log('end date ', endDate);
            var today = new Date();
            today.setDate(today.getDate());
            console.log('today ', today);
            if(today>=startDate && today <= endDate){
                var startTime = promotion.startTime.substring(0,2);
                console.log('start time ', startTime);
                var endTime = promotion.endTime.substring(0,2);
                console.log('end time ', endTime);
                var currentHour = today.getHours();
                console.log('current hour ', currentHour);
                if(currentHour >= startTime && currentHour <= endTime){
                    if(promotion.flatrate == 0){
                        var promoPercentage = parseInt(promotion.percentage)/100;
                        $scope.discount.discountedprice = $scope.discount.discountedprice * (1-promoPercentage);                        
                    }
                    else{
                        var flatrate = parseInt(promotion.flatrate);
                        $scope.discount.discountedprice -= flatrate;
                    }
                }
            }
        }

        $scope.getServiceCharge = function(dishList){
            $scope.serviceCharge = ($scope.subtotal-$scope.discount.value)*0.1;
            return $scope.serviceCharge;
        }

        $scope.getBalance = function(dishList){  
            $scope.balance = Math.round(($scope.subtotal - $scope.discount.value + $scope.serviceCharge)*100)/100;                    
            //            $scope.balance = Math.round(($scope.getTotal(dishList)*(1-($scope.promoCode.discount+$scope.member.discount)/100  ))*100)/100                        
            return $scope.balance;
        }        

        $scope.openPayment = function(){             
            if(!$scope.promoCodeEntered){               
                $scope.modalPromoCode.show();
            }
            else{
                $scope.noPromoCode();
            }
        }
        $scope.check = function(){
            console.log($scope);
        }

        $scope.$on('modal.hidden', function(event, modal){
            if(modal.name == 'epayment'){
                console.log('HIDDEN');
                modal.remove();
            }
        })

        $scope.noPromoCode = function(){
            $scope.modalPromoCode.hide();
            $scope.modalEpayment.show();

            if(!$rootScope.paypalbuttonloaded){

                // Render the PayPal button

                paypal.Button.render({                                

                    // Set your environment

                    env: 'sandbox', // sandbox | production

                    // PayPal Client IDs - replace with your own
                    // Create a PayPal app: https://developer.paypal.com/developer/applications/create

                    client: {
                        sandbox:    'AXgdDXWoG0qaeCSqCIy54ldh7J1sLdwNiy1rfHAi4QKBG3cZeqiZtXakKUzN5J0ZikaiBWV9RbKxhIPK',
                        // production: 'Aco85QiB9jk8Q3GdsidqKVCXuPAAVbnqm0agscHCL2-K2Lu2L6MxDU2AwTZa-ALMn_N0z-s2MXKJBxqJ'
                    },

                    // Wait for the PayPal button to be clicked

                    payment: function() {                                             
                        $scope.modalEpayment.hide();
                        // Make a client-side call to the REST api to create the payment

                        return paypal.rest.payment.create(this.props.env, this.props.client, {
                            transactions: [
                                {
                                    amount: { total: $scope.balance, currency: 'SGD' }
                                }
                            ]
                        });
                    },

                    commit:true,
                    // Wait for the payment to be authorized by the customer

                    onAuthorize: function(data, actions) {

                        // Execute the payment

                        return actions.payment.execute().then(function() {
                            //                        document.querySelector('#paypal-button-container').innerText = 'Payment Complete!';
                            // var alertPopup = $ionicPopup.alert({            
                            //     template: '<p style="text-align:center">Payment Complete</p>'
                            // });

                            // alertPopup.then(function(res) {
                            //     if(res) {                                         
                            //         console.log("Yes");                    
                            //         $scope.processPromotions();  
                            //         $scope.modalPromoCode.hide();              
                            //         console.log($scope.promotions);
                            //     } else {
                            //         console.log('No');
                            //     }
                            // });
                            var paymentDetails = {
                                balance: $scope.balance,
                                amtTendered: $scope.balance,
                                discount: {
                                    value: $scope.discount.value
                                }
                            }
                            Payments.createEPayment(0, $scope.member.memberID, paymentDetails, $scope.orders[0], $scope.member.redeemed, $scope.receipt.contact).then(function(data){
                                if(data.data == "error1"){
                                    Payments.createCashPaymentOffline(0, $scope.member.memberID, paymentDetails, $scope.orders[0],$scope.member.redeemed, $scope.receipt.contact).then(function(data){
                                        var alertPopup = $ionicPopup.alert({            
                                            template: '<p style="text-align:center">Server is offline. Member Points cannot be claimed. Payment is complete.</p>'
                                        });

                                        alertPopup.then(function(res) {
                                            if(res) {                                         
                                                console.log("Yes");
                                                $scope.paymentId = data.data;
                                                $scope.member.redeemed = false;
                                                $state.go('app.invoice');  
                                            } else {
                                                console.log('No');
                                            }
                                        }); 
                                    })                                                                
                                }
                                else{
                                    var alertPopup = $ionicPopup.alert({            
                                        template: '<p style="text-align:center">Payment is complete.</p>'
                                    });

                                    alertPopup.then(function(res) {
                                        if(res) {                                         
                                            console.log("Yes");
                                            $scope.paymentId = data.data;
                                            $scope.member.redeemed = false;
                                        } else {
                                            console.log('No');
                                        }
                                    }); 

                                    $scope.paymentId = data.data;
                                    $scope.member.redeemed = false;
                                    $state.go('app.invoice');  
                                }

                            })                            
                        });
                    }

                }, '#paypal-button-container');

                $rootScope.paypalbuttonloaded=true;
            }


        }

        //        $scope.sendPayment = function(){
        //            console.log('function called');
        //            payment.paymentMethod = 'Epayment';
        //            payment.discount.value = $scope.discount.value;
        //            payment.balance = $scope.balance;
        //            payment.amtTendered = $scope.balance;
        //            /*
        //        Payments.createPayment(payment, $scope.orders[0]).then(function(){
        //            var alertPopup = $ionicPopup.alert({            
        //                template: '<p style="text-align:center">Payment made.</p>'
        //            });
        //
        //            alertPopup.then(function(res) {
        //                if(res) {                                         
        //                    console.log("Yes")
        //                } else {
        //                    console.log('No');
        //                }
        //            });
        //            $scope.orders=[
        //                {'dishList':null}
        //            ]; 
        //        })
        //        */
        //        }     

        $scope.tablePaging = function(){
            var confirmPopup = $ionicPopup.confirm({            
                template: '<p style="text-align:center">Request for Assistance?</p>'
            });

            confirmPopup.then(function(res) {
                if(res) {                                         
                    console.log("Yes");
                    Tables.pageTable($scope.order.tableNumber);
                } else {
                    console.log('No');
                }
            });
        }    

        $scope.cancelPayment = function(){
            $scope.modalPromoCode.hide();
        }

        $scope.getNumber = function (number){
            var arr = [];
            for(i=0; i<number; i++){
                arr.push('');
            }            
            return arr;
        }

        $scope.submitPromoCode = function (){
            $scope.promoCodeEntered = false;
            $scope.promoCode = null;
            for(o in $scope.promotions){
                if($scope.promotions[o].customerGroup == "Promotion Code"){
                    console.log('promo code ', $scope.promotions[o].promoCode)
                    if($scope.promotions[o].promoCode == $scope.code.value){
                        $scope.promoCode = $scope.code.value;                       
                        $scope.promoCodeEntered = true;
                    }
                }
            }
            if(!$scope.promoCodeEntered){
                $scope.code = {};

                var alertPopup = $ionicPopup.alert({            
                    template: '<p style="text-align:center">Promotion Code Invalid</p>'
                });                              

                alertPopup.then(function(res) {
                    if(res) {                                         
                        console.log("Yes");                                            
                        $scope.processPromotions();  
                        console.log($scope.promotions);
                    } else {
                        console.log('No');
                    }
                });
            }
            else{                
                $scope.code = {};

                var alertPopup = $ionicPopup.alert({            
                    template: '<p style="text-align:center">Promotion Code Applied</p>'
                });

                alertPopup.then(function(res) {
                    if(res) {                                         
                        console.log("Yes");                    
                        $scope.processPromotions();  
                        $scope.modalPromoCode.hide();              
                        console.log($scope.promotions);
                    } else {
                        console.log('No');
                    }
                });                                
            }
        }

    }])

    .controller('SettingsCtrl', ['$scope', 'Tables', 'Staffs', '$ionicPopup', function($scope, Tables, Staffs, $ionicPopup) {
        $scope.settings = false;
        $scope.tables;
        $scope.tableClicked;        

        $scope.openSettings = function(password){          
            $scope.settings = true;
            console.log($scope.tables);
        }

        $scope.clickTable = function(){
            $scope.tableClicked = !$scope.tableClicked;
            console.log("inside toggle", $scope);
        }

        $scope.updateTable = function(table){
            $scope.$parent.$parent.order.tableNumber= table.tableNumber;
            $scope.tableClicked = false;     
            console.log($scope);
        }       

        $scope.staffLogin = function(staffId, password){
            Staffs.verifyStaff(staffId, password).then(function(data){            
                if(data.data == 'Password is incorrect.'){
                    var alertPopup = $ionicPopup.alert({            
                        template: '<p style="text-align:center">Password Incorrect</p>'
                    });

                    alertPopup.then(function(res) {
                        if(res) {                                         
                            console.log("Yes")
                        } else {
                            console.log('No');
                        }
                    });
                }
                else if(data.data =='Staff not found.'){
                    var alertPopup = $ionicPopup.alert({            
                        template: '<p style="text-align:center">Staff does not exist</p>'
                    });

                    alertPopup.then(function(res) {
                        if(res) {                                         
                            console.log("Yes")
                        } else {
                            console.log('No');
                        }
                    });
                }
                else {
                    var message = data.data.split('.')[0];
                    var name = data.data.split('.')[1];
                    var staffId = data.data.split('.')[2];
                    if( message == 'Verified'){
                        console.log('correct');
                        // var staff = {
                        //     name: name,
                        //     staffId: staffId
                        // }
                        $scope.settings = true;
                    }
                }            
            })
        }

                                 Tables.getTables().then(function(){
                                                         $scope.tables = Tables.tables;
                                                         $scope.tempArr = [];
                                                         for(var i=1; i<$scope.tables.length; i++){
                                                         $scope.tempArr.push({
                                                                             tableId: i,
                                                                             tableNumber: i
                                                                             })
                                                         }
                                                         $scope.tables = $scope.tempArr; 
                                                         console.log('TABLES OBTAINED ', $scope.tables);
                                                         });
    }])





//        $scope.getAuthToken = function(){
//            Payments.getAuthToken().then(function(){
//                console.log('call access token finish');
//            })
//        }
//
//        $scope.callPaypal = function(amount){
//            //            Payments.testPaypal().then(function(){
//            //                console.log('call finish paypal');
//            //            })
//            console.log('amount is ' ,amount);
//
//
//            $scope.balance = amount;
//        }
//        $scope.checkPayment = function(){
//            Payments.checkPaypalPayment().then(function(){
//                console.log("call finish paypal check");
//            })
//        }       

//            ----------------------PAYPAL-----------------------------
//        $scope.$on("$ionicView.enter", function() {
//            if(!$rootScope.paypalbuttonloaded){
//
//                alert('leave');
//                // Render the PayPal button
//
//                paypal.Button.render({                                
//
//                    // Set your environment
//
//                    env: 'sandbox', // sandbox | production
//
//                    // PayPal Client IDs - replace with your own
//                    // Create a PayPal app: https://developer.paypal.com/developer/applications/create
//
//                    client: {
//                        sandbox:    'AXgdDXWoG0qaeCSqCIy54ldh7J1sLdwNiy1rfHAi4QKBG3cZeqiZtXakKUzN5J0ZikaiBWV9RbKxhIPK',
//                        // production: 'Aco85QiB9jk8Q3GdsidqKVCXuPAAVbnqm0agscHCL2-K2Lu2L6MxDU2AwTZa-ALMn_N0z-s2MXKJBxqJ'
//                    },
//
//                    // Wait for the PayPal button to be clicked
//
//                    payment: function() {                                                
//                        // Make a client-side call to the REST api to create the payment
//
//                        return paypal.rest.payment.create(this.props.env, this.props.client, {
//                            transactions: [
//                                {
//                                    amount: { total: $rootScope.balance, currency: 'SGD' }
//                                }
//                            ]
//                        });
//                    },
//
//                    commit:true,
//                    // Wait for the payment to be authorized by the customer
//
//                    onAuthorize: function(data, actions) {
//
//                        // Execute the payment
//
//                        return actions.payment.execute().then(function() {
//                            document.querySelector('#paypal-button-container').innerText = 'Payment Complete!';
//                            alert("Payment complete!");
//                            $rootScope.paypalbuttonloaded=false;
//                        });
//                    }
//
//                }, '#paypal-button-container');
//
//                $rootScope.paypalbuttonloaded = true;
//
//            }
//        })
