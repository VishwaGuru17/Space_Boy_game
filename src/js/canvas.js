import platform from '../images/platform.png'
import hills from '../images/hills.png'
import background from '../images/background.png'
import platformsmallTall from'../images/platformsmallTall.png'
import spriteRunLeft from'../images/spriteRunLeft.png'
import spriteRunRight from'../images/spriteRunRight.png'
import spriteStandLeft from'../images/spriteStandLeft.png'
import spriteStandRight from'../images/spriteStandRight.png'
console.log(platform)


const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.5

class Player {
  constructor(){
    this.speed = 7
    this.position = {
      x: 100,
      y: 100
    }

    this.velocity ={
      x: 0,
      y: 0
    }
    this.width = 66;
    this.height = 150;

    this.image = createImage(spriteStandRight)
    this.frames = 0
    this.sprite = {
      stand: {
        right :createImage(spriteStandRight),
        left :createImage(spriteStandLeft),
        cropWidth: 177,
        width:66
      },
      run: {
        right : createImage(spriteRunRight),
        left : createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875
      }
    }

    this.currentSprite = this.sprite.stand.right
    this.currentCropWidth = 177
  }

  draw(){
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400, 


      this.position.x , 
      this.position.y,
      this.width,
      this.height)
  }

  update() {
    this.frames++
    if (this.frames > 59 && this.currentSprite === this.sprite.stand.right || this.currentSprite === this.sprite.stand.left) 
      this.frames = 0
      else if (this.frames > 29 && 
        (this.currentSprite === this.sprite.run.right
         || this.currentSprite === this.sprite.run.left))
        this.frames = 0

    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if(this.position.y + this.height + this.velocity.y <= canvas.height)

    this.velocity.y += gravity

    
  }

}

class Platform{
  constructor({x, y, image}){
    this.position = {
      x,
      y
    }

    this.image = image
    this.width = image.width
    this.height = image.height
    
  }

  draw(){
    c.drawImage(this.image , this.position.x , this.position.y)
  }
}

class GenericObject{
  constructor({x, y, image}){
    this.position = {
      x,
      y
    }

    this.image = image
    this.width = image.width
    this.height = image.height
    
  }

  draw(){
    c.drawImage(this.image , this.position.x , this.position.y)
  }
}

function createImage(imageSrc){
const image = new Image()
image.src = imageSrc
return image
}

let platformImage = createImage(platform)
let platformsmallTallImage = createImage(platformsmallTall)
let player = new Player()

let platforms = []

let genericObjects = []

let lastkey
const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
}

let scrollOffset = 0

function init(){
 platformImage = createImage(platform)
 player = new Player()

 platforms = [
  new Platform({
  x: platformImage.width * 3 + 600 - 3 + platformImage.width - platformsmallTallImage.width, 
  y:270,
  image: createImage(platformsmallTall)
}),



  new Platform({
  x:-1, 
  y:470,
  image: platformImage
}),

new Platform({
  x: platformImage.width - 3, 
  y:470,
  image: platformImage
}),

new Platform({
  x: platformImage.width * 2 + 100, 
  y:470,
  image: platformImage
}),

new Platform({
  x: platformImage.width * 3 + 300, 
  y:470,
  image: platformImage
}),
new Platform({
  x: platformImage.width * 5 + 900, 
  y:470,
  image: platformImage
})



]

 genericObjects = [
  new GenericObject({
    x:-1,
    y:-1,
    image:createImage(background)
  }),

  new GenericObject({
    x:-1,
    y:-1,
    image:createImage(hills)
  })
  ]

 scrollOffset = 0
}

function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0,0,canvas.width,canvas.height)

  genericObjects.forEach(genericObject => {
    genericObject.draw()
  })
  
  platforms.forEach((platform) => {
    platform.draw()
  })

  player.update()

  if(keys.right.pressed && player.position.x < 400){
    player.velocity.x = player.speed
  } else if ((keys.left.pressed && player.position.x
    >100) || keys.left.pressed && scrollOffset == 0 && player.position.x >0)

  {
    player.velocity.x = -player.speed
  }
  else {player.velocity.x = 0

  if (keys.right.pressed) {
    scrollOffset += player.speed
    platforms.forEach((platform) => {
    platform.position.x -= player.speed
  })
   genericObjects.forEach((genericObject)=>{
    genericObject.position.x -= player.speed * .66
   })
  }else if (keys.left.pressed && scrollOffset > 0){
    scrollOffset -= player.speed
    platforms.forEach((platform) => {
      platform.position.x += player.speed
    })
    genericObjects.forEach((genericObject)=>{
    genericObject.position.x += player.speed * .66
   })
  }
}

  //platform collision detection
  platforms.forEach((platform) => {
  if(
    player.position.y + player.height <= platform.position.y 
    && player.position.y +player.height + player.velocity.y >= platform.position.y 
    && player.position.x + player.width >= platform.position.x
    && player.position.x <= platform.position.x + platform.width)
  {
    player.velocity.y =0
  }
})

//sprite switching
if (
  keys.right.pressed &&
  lastkey === 'right' && player.currentSprite !== player.sprite.run.right){
  player.frames = 1
  player.currentSprite = player.sprite.run.right
  player.currentCropWidth = player.sprite.run.cropWidth
  player.width = player.sprite.run.width
  player.currentSprite = player.sprite.run.right
} else if ( keys.left.pressed &&
  lastkey === 'left' && player.currentSprite !== player.sprite.run.left)
{
    player.currentSprite = player.sprite.run.left
    player.currentCropWidth = player.sprite.run.cropWidth
    player.width = player.sprite.run.width
}
else if ( !keys.left.pressed &&
  lastkey === 'left' && player.currentSprite !== player.sprite.stand.left)
{
    player.currentSprite = player.sprite.stand.left
    player.currentCropWidth = player.sprite.stand.cropWidth
    player.width = player.sprite.stand.width
}

else if ( !keys.right.pressed &&
  lastkey === 'right' && player.currentSprite !== player.sprite.stand.right)
{
    player.currentSprite = player.sprite.stand.right
    player.currentCropWidth = player.sprite.stand.cropWidth
    player.width = player.sprite.stand.width
}


   //win condition
  if (scrollOffset > platformImage.width * 5 + 700){
    console.log('you win')
  }

  //loose condition

  if (player.position.y > canvas.height){
    init()
  
  }

  
}
init()
animate()

addEventListener('keydown', ({keyCode}) => {
  switch(keyCode) {
  
  case 65:
    console.log('left')
    keys.left.pressed = true
    lastkey = 'left'
    break

  case 83:
    console.log('down')
    break

    case 68:
    console.log('right')
    keys.right.pressed = true
    lastkey = 'right'
    break

    case 87:
    console.log('up')
    player.velocity.y -= 10
    break
  }


})

addEventListener('keyup', ({keyCode}) => {
  switch(keyCode) {
  
  case 65:
    console.log('left')
    keys.left.pressed = false
    break

  case 83:
    console.log('down')
    break

    case 68:
    console.log('right')
    keys.right.pressed = false
   
    break

    case 87:
    console.log('up')
    break
  }


})