angular.module('starter.services', [])

.factory('Orders', function($http) {
    // Might use a resource here that returns a JSON array

    var o = {
        orders: [],
    };


    o.newOrder = function(order){      
        for(o in order.dishList){
            if(!order.dishList[o].description){
                order.dishList[o].description = "";
            }
        }
        for(o in order.dishList){
            order.dishList[o].price = parseInt(order.dishList[o].price);
        } 
        console.log("creating new table order with " ,order);
        return $http({
            method: 'GET',
            url:'http://52.187.179.134:8080/TestEnterprise-war/webresources/ejb.OrderingModule/createTableOrder',
            //url:'http://localhost:8080/TestEnterprise-war/webresources/ejb.OrderRestful/createTableOrder',
            params: {"tableNum":order.tableNumber, "isTakeaway":order.isTakeaway, "orderList": angular.toJson(order.dishList)}
        }).then(function(data){
            console.log(data);
            return data;
        })
        // return $http
    }

    o.getTableOrder = function(tableNumber) {
        return $http({
            method: 'GET',
            url:'http://52.187.179.134:8080/TestEnterprise-war/webresources/ejb.OrderingModule/getOrdersByTableNumber',
            //url:'http://localhost:8080/TestEnterprise-war/webresources/ejb.OrderRestful/getTableOrder',
            params: {"tableNum": tableNumber}
        }).success(function(data){               
            for(i in data) {
                console.log("tablenumber of i", data[i].tableNumber)
                data[i].tableNumber = parseInt(data[i].tableNumber);  
                for(j in data[i].dishList){
                    data[i].dishList[j].dishId = parseInt(data[i].dishList[j].dishId);
                    data[i].dishList[j].quantity = parseInt(data[i].dishList[j].quantity);
                    data[i].dishList[j].price = parseFloat(data[i].dishList[j].price);
                }
            }
            console.log("get order by table number", data);
            o.orders = data;       
                      // console.log(o.orders);
                  });
    }

    return o;

})

.factory('Payments', function($http) {
    var p = {};
    p.createEPayment = function(staffId,memberId, paymentDetails, order, redeemed,contactNumber){
        staffId = parseInt(staffId);
        memberId = parseInt(memberId);
        console.log("this is createpayment method, what payment details received is", paymentDetails);
        console.log("this is createpayment method, what order received is", order);
        console.log("this is createpayment method, what staffId received is", staffId);
        console.log("this is createpayment method, what memberId received is", memberId);
         alert('creating epayment');
        return $http({
            method: 'GET',
            url:'http://52.187.179.134:8080/TestEnterprise-war/webresources/ejb.PaymentModule/createEPayment',
            //url:'http://localhost:8080/TestEnterprise-war/webresources/ejb.OrderRestful/deleteTableOrder',
                     params: {"balance" : paymentDetails.balance , "amountPaid": paymentDetails.amtTendered , "discount": paymentDetails.discount.value, "orderId": order.orderId, "memberId": memberId, "staffId" : staffId, "claimPoints":redeemed, "phoneNumber" : contactNumber }
        }).success(function(data){
            console.log("return data from createPayment", data);
                   alert('created epayment');
        });
    }

    p.createCashPaymentOffline = function(staffId,memberId, paymentDetails, order, redeemed, contactNumber){
        if(!memberId){
            memberId = 0;
        }
        redeemed = true;
        staffId = parseInt(staffId);
        memberId = parseInt(memberId);
        console.log("this is createpayment method, what staffId received is", staffId);
        console.log("this is createpayment method, what memberId received is", memberId);
        console.log("this is createpayment method, what payment details received is", paymentDetails);
        console.log("this is createpayment method, what order received is", order);
           console.log("this is createpayment method, what redeemed received is", redeemed);
        return $http({
            method: 'GET',
            url:'http://52.187.179.134:8080/TestEnterprise-war/webresources/ejb.PaymentModule/createCashPaymentOffline',
            //url:'http://localhost:8080/TestEnterprise-war/webresources/ejb.OrderRestful/deleteTableOrder',
            params: {"balance" : paymentDetails.balance , "amountPaid": paymentDetails.amtTendered , "discount": paymentDetails.discount.value, "orderId": order.orderId, "memberId": memberId, "staffId" : staffId, 'claimPoints' :  redeemed,"phoneNumber" : contactNumber }
        }).success(function(data){
            console.log("return data from createPayment", data);        
        });
    }

    p.getAuthToken = function(){
        console.log("getting Auth Token");
        var authstring = btoa("AXgdDXWoG0qaeCSqCIy54ldh7J1sLdwNiy1rfHAi4QKBG3cZeqiZtXakKUzN5J0ZikaiBWV9RbKxhIPK:ENQeFUzXnDHUC6Wa3JId2F04W7ZLgPp4IR--fQgL1J6nj2MmC-d55LCp3iOpaWyWYJb75aLxoRJkl0XU");
        return $http({
            method: 'POST',
            url:'https://api.sandbox.paypal.com/v1/oauth2/token',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + authstring,
            },
            data: 'grant_type=client_credentials'
        })
        .success(function(data){
            console.log('access token success', data.access_token);
        })
        .error(function(error){
            console.error('access token error', error);
        });
    }

    p.testPaypal = function(){
        console.log("calling paypal now");
        return $http({
            method: 'POST',
            url:'https://api.sandbox.paypal.com/v1/payments/payment',
            headers: {
                'Authorization': 'Bearer ' + 'A21AAEtsjrNs3oYcE3OkfHajRmpCIhnKBco6Mn0FoVdfHt2G4uLb4Rxxf1dnRPL1xzcQPkqYmA8ZU9DNe40BJDTcRBNTHRn5g',
                'Accept': 'application/json'
            },
            //url:'http://localhost:8080/TestEnterprise-war/webresources/ejb.OrderRestful/deleteTableOrder',
            data: {
                "intent": "sale",
                "payer":
                {
                    "payment_method": "paypal",
                    "payer_info": {
                        "email" :"eatfficientbuyer@gmail.com",
                    },
                    //                    "funding_instruments": [
                    //                        {
                    //                            "credit_card":
                    //                            {
                    //                                "number": "4032030105059696",
                    //                                "type": "visa",
                    //                                "expire_month": 4,
                    //                                "expire_year": 2022,
                    //                                //                                 "cvv2": "333",
                    //                                "first_name": "Eatfficient",
                    //                                "last_name": "Buyer",
                    //                                "billing_address":
                    //                                {
                    //                                    "line1": "123 Thomson Rd.",
                    //                                    "city": "Singapore",
                    //                                    "postal_code": "308123",
                    //                                    "country_code": "SG"
                    //                                }
                    //                            }
                    //                        }]
                },
                "transactions": [
                {
                    "amount":
                    {
                        "total": "10.00",
                        "currency": "SGD",                           
                    },
                    "description": "This is the payment transaction description.",
                        //                        "payment_options": {
                        //                            "allowed_payment_method": "IMMEDIATE_PAY"
                        //                        },
                        //                        "payee": {                        
                        //                            //                            "email":"eatfficientmanager@gmail.com",
                        //                            "merchant_id": "82HANJRZMKPBY"
                        //                        }
                    }],
                    "redirect_urls": {
                        "return_url": "http://172.25.97.78:8101/#/app/setmeals",
                        "cancel_url": "http://172.25.97.78:8101/#/app/setmeals"
                    }
                }
            }).then(function(data){
                console.log("return data from test paypal", data);        
            }).catch(function(response){
                console.log('error', response);
            })
        }

        p.checkPaypalPayment = function(){
            return $http({
                method: 'GET',
                url:'https://api.sandbox.paypal.com/v1/payments/payment',
                headers: {
                    'Authorization': 'Bearer ' + 'A21AAEPOsIUuI8c-Q9rX0VJlVdAoo0sX4LyzYglr4gO9lqBZllesRqX-0q6_P9n-6mZ25FpF6Ive9roKOltN3mYmMTAgudY_Q',
                    'Accept': 'application/json'
                },
            //url:'http://localhost:8080/TestEnterprise-war/webresources/ejb.OrderRestful/deleteTableOrder',            
        }).success(function(data){
            console.log("return data from createPayment", data);        
        });
    }

    return p;

})

 .factory('Outlets', function($http) {
    var o = {};
    o.getOutletPointsPolicy = function(){        
        return $http({
            method: 'GET',
            url:'http://52.187.179.134:8080/TestEnterprise-war/webresources/ejb.OutletAdminModule/getOutletPointsPolicy',
            //url:'http://localhost:8080/TestEnterprise-war/webresources/ejb.OrderRestful/deleteTableOrder',            
        }).success(function(data){
            console.log("claim points policy", data);        
        });
    }

    return o;

    // need factory('Members'), verify membership

})

.factory('Tables', function($http){
    var t = {
        tables: []
    };
    // var t = {
    //     tables: [
    //         {'tableNumber' : 1},
    //         {'tableNumber' : 2},
    //         {'tableNumber' : 3},
    //         {'tableNumber' : 4},
    //         {'tableNumber' : 5},
    //         {'tableNumber' : 6},
    //         {'tableNumber' : 7},
    //         {'tableNumber' : 8},
    //         {'tableNumber' : 9},
    //         {'tableNumber' : 10},
    //         {'tableNumber' : 11},
    //         {'tableNumber' : 12},
    //         {'tableNumber' : 13},
    //         {'tableNumber' : 14},
    //         {'tableNumber' : 15},
    //         {'tableNumber' : 16},
    //         {'tableNumber' : 17},
    //         {'tableNumber' : 18},
    //         {'tableNumber' : 19},
    //         {'tableNumber' : 20},
    //         {'tableNumber' : 21}
    //     ]                    
    // };

    t.pageTable = function(tableNumber){
        console.log('paging table ' + tableNumber);
        return $http({
            method: 'GET',
            url:'http://52.187.179.134:8080/TestEnterprise-war/webresources/ejb.TableManagementModule/pageStaff',
            params:{ 'TableNum': tableNumber}
        }).success(function(data){
            console.log('page staff success', data)
        })
    }
    
    t.getTables = function(){
        return $http({
            method: 'GET',
            url:'http://52.187.179.134:8080/TestEnterprise-war/webresources/ejb.TableManagementModule/getAllTables',           
        }).success(function(data){
            console.log('getting all tables success', data);
            t.tables = data;
        })
    }

    return t;
})

.factory('Menus', function($http){
    var m = {
        menus: []                  
    };


    m.getMenu = function() {
        return $http({
            method: 'GET',
            url:'http://52.187.179.134:8080/TestEnterprise-war/webresources/ejb.MenuManagementModule/getActiveMenu',            
        }).success(function(data){               
            console.log(data);
            m.menus = data;
            //          console.log(o.orders);
        });
    }
    return m;
})

.factory('Promotions', function($http) {
    var p = {
        promotions:[]
    };

    p.getAllPromotions = function(){
        return $http({
            method: 'GET',
            url:'http://52.187.179.134:8080/TestEnterprise-war/webresources/ejb.SyncDatabaseModule/syncPromotions',            
        }).success(function(data){               
            console.log('promotion', data);                        
            p.promotions = data;
        });
    }
    
    return p;
})

.factory('Members', function($http){
    var m = {

    };


    m.verifyMember = function(contactNum) {
        console.log('verifying member with ' + contactNum);
        return $http({
            method: 'GET',
            url:'http://52.187.179.134:8080/TestEnterprise-war/webresources/ejb.SyncDatabaseModule/verifyMember',    
            params: {'phoneNumber': contactNum }
        }).success(function(data){               
            console.log('member login', data);   
            //            m.menus = data;
            //          console.log(o.orders);
        });
    }
    return m;
})

.factory('Staffs', function($http){
    var s = {

    };

    
    s.verifyStaff = function(staffId, password) {
        console.log('verifying staff with ' + staffId + ', ' + password);
        return $http({
            method: 'GET',
            url:'http://52.187.179.134:8080/TestEnterprise-war/webresources/ejb.SyncDatabaseModule/verifyStaff',    
            params: {'staffId': staffId, 'Password':password }
        }).success(function(data){               
            console.log('staff login', data);   
            //            m.menus = data;
            //          console.log(o.orders);
        });
    }
    return s;
})

.factory('CardTypeIdentifier', function($http){
    var c = {

    };

    
    c.getCardType = function(bin) {
        console.log('getting card type');
        return $http({

            method: 'GET',
            url:'https://api.freebinchecker.com/bin/' + bin,                
            // headers: {
            //     'X-Mashape-Key':'eatfficient',
            //     'Content-Type' : 'application/x-www-form-urlencoded',
            //     'Accept': 'application/json'
            // },
            // data: {'bin-number':bin}
        }).then(function(data){               
            console.log('card type is ', data.toString());   
            //            m.menus = data;
            //          console.log(o.orders);
        });
    }
    return c;
})
