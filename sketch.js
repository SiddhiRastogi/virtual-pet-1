//Create variables here
 var dog,happyDog;
 var database;
 var foodS,foodStock
 var foodObj
 var lastFed
 var gameState , readingGameState
 var currentTime
 var bedroom , garden , washroom

function preload()
{
  //load images here
  dogImg = loadImage("images/Dog.png");
  dog1Img = loadImage("images/happy dog.png");

  bed = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
}

function setup() {
  createCanvas(1000,600);
  database = firebase.database();
  
  dog = createSprite(500,400,20,20);
  dog.addImage(dogImg);
  dog.scale = 0.2;
  
  // read food from database

  foodStock = database.ref('food');
  foodStock.on("value",readStock,error)
  console.log(foodStock)
  
// read game state from database
readingGameState = database.ref('gameState');
readingGameState.on("value",function(data){
  gameState = data.val()
})

// read feed time from database

feedTime = database.ref('feedTime');
feedTime.on("value" , function(data){
lastFed = data.val();
})

  feed = createButton("feed the dog");
feed.position(700,95);
feed.mousePressed(feedDog);

addFood = createButton("Add Food");
addFood.position(800,95);
addFood.mousePressed(addFoods);

foodObj = new Food()
}


function draw() { 
  background(46,139,87) 
  dog.display();
  
  //add styles here
 
  textSize(20);
  fill("black");
  text("Food Remaining :"+foodS , 100,100)

 

  currentTime = hour();

  if(currentTime == (lastFed + 1)){
    foodObj.garden();
    update("playing");
  
  }

  if(currentTime === (lastFed + 2)){
    foodObj.washroom();
    update("bathing");
  }

  if(currentTime === (lastFed + 4)){
    foodObj.bedroom();
    update("sleeping");
  }
  else{
    update("hungry");
    foodObj.display();
  }

  if(gameState!=="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg)
  }
  drawSprites();
}


function readStock(data){
foodS = data.val(); 
console.log(foodS);
foodObj.updateFoodStock(foodS)
}

function writeStock(foodS){
  database.ref('/').update({
    'food':foodS
  });
}
 function error(){
   console.log("error");
 }

// updating the food stock in the database

 function feedDog(){
   dog.addImage(dog1Img);
   foodObj.deductFood();
   database.ref('/').update({
     food : foodObj.getFoodStock(),
     feedTime:hour(),
     gameState : "hungry"
   })
   console.log(foodObj.getFoodStock);
 }

 function addFoods(){
   foodS++
   database.ref('/').update({
     food : foodS
   })
 }

 function update(state){
 database.ref('/').update({
   gameState : state
 
 })
}