/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        hasViewPermission();
        changeLang();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

};

function changeLang(){
    i18n.init({lng:i18n.lng(),resGetPath:'../../locales/__lng__/__ns__.json'},function(){
      $('body').i18n();
    });     
}

/**
 * Check current user have permission to view current page or not.
 * @return {Boolean}  
 */
function hasViewPermission(){
    return sessionStorage.getItem("authorized")==="true";
}

function getUser(){
  return JSON.parse(sessionStorage.user);
}

function get(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
    return "";
} 

function leaveAStepCallback(obj, context){
  var classStr="success";
  var ret = compare($("#ans-"+ (context.fromStep -1)).val(),$("#input-"+ (context.fromStep -1)).val())

  if(!ret){
    $("#sublife").trigger("click");
    classStr="failed";
  }
  $(".swMain .actionBar .msgBox").removeClass("failed");
  $(".swMain .actionBar .msgBox").removeClass("success");
  $(".swMain .actionBar .msgBox").addClass(classStr);
  $(".swMain").smartWizard('showMessage', $("#mess-"+ (context.fromStep -1)).html());

  return ret;
};

function compare(oldStr,newStr){
  return (oldStr.trim().replace(/ /g,"") === newStr.trim().replace(/ /g,""));
}

function filter(data,key,value){
    var uniqueGroups = [];
    $.each(data, function(idx,val) {
        if(data[idx][key] == value){
            uniqueGroups.push(data[idx]);
        }
    });
    return uniqueGroups;
}

function gameOver(uid,xp){
    alert("Game over");
}

function grammarChoiceLeaveStep(obj,context){
  var ret = compare($("#ans-"+ (context.fromStep -1)).val(),$("#input-"+ (context.fromStep -1)).val());
  if(!ret){
    $("#sublife").trigger("click");
    $(".swMain").smartWizard('showMessage', $("#mess-"+ (context.fromStep -1)).html());
  }

  return ret;
}

function akiraShuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/**
 * Need to shuffle the generated answer again
 * @param  {[type]} data   [description]
 * @param  {[type]} ansKey [description]
 * @return {[type]}        [description]
 */
function genAnswers(data,ansKey,numberOfAns){
    var uniqueGroups = [];
    $.each(data, function(idx,val) {
        var obj = [];

        var rand1;
        obj.push(data[idx][ansKey]);
        
        do{
            rand1 = Math.floor((Math.random() * data.length));
        }while(rand1 == idx);
        obj.push(data[rand1][ansKey]);

        if(numberOfAns==3){
            var rand2;
            do{
                rand2 = Math.floor((Math.random() * data.length));
            }while(rand2 == idx || rand2 == rand1);
            obj.push(data[rand2][ansKey]);
        }

        uniqueGroups[idx]=akiraShuffle(obj);
    });
    return uniqueGroups;
}

/**
 * Generate answer for translate game in grammar
 * @return {[type]} [description]
 */
function genAnswers2(data){
    var uniqueGroups = [];
    $.each(data, function(idx,val) {
        var obj = data[idx]["hiragana"].trim().replace(/ /g,"").split("") ;

        uniqueGroups[idx]=akiraShuffle(obj);
    });
    return uniqueGroups;   
}