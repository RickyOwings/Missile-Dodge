const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
canvas.fitScreen = ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function update(progress){
    canvas.fitScreen();
    GameObject.updateAll(progress)
}
function draw(){
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    GameObject.drawAll();
}
var lastRender = 0;
var pageInteracted = false;
window.addEventListener('keydown',()=>{pageInteracted = true});
function loop(timestamp){
    let progress = timestamp - lastRender;
    if(pageInteracted){
    update(progress);
    }
    draw();
    lastRender = timestamp;
    window.requestAnimationFrame(loop); 
}
window.requestAnimationFrame(loop);

let map = new Map({canvasElement:canvas})
let player = new Player({canvasElement:canvas, position:new Vector2(-25000,0)});
setInterval(()=>{
    if(player.health>=0){
    document.getElementById("speedometer").innerHTML = `Mach: ${Math.floor(100*player.velocity.distance()*2/663)/100}`
    document.getElementById("goometer").innerHTML = `Gs:${Math.abs(Math.floor(10*player.rotVelocity*100)/100)}`
    document.getElementById("healthoometer").innerHTML = `Health:${player.health}`
    }else{
    document.getElementById("speedometer").innerHTML = ``
    document.getElementById("goometer").innerHTML = ``
    document.getElementById("healthoometer").innerHTML = ``
    }
})

//Setting up enemies
new AAA({canvasElement:canvas, position:new Vector2(-5000,0)});
new GunAAA({canvasElement:canvas, position:new Vector2(-5000,100)});
new AAA({canvasElement:canvas, position:new Vector2(-22500,-9000)});
new AAA({canvasElement:canvas, position:new Vector2(-17000,-4000)});
new AAA({canvasElement:canvas, position:new Vector2(-17000,2000)});
new AAA({canvasElement:canvas, position:new Vector2(-10000,2100)});
new AAA({canvasElement:canvas, position:new Vector2(-10000,-7000)});
new GunAAA({canvasElement:canvas, position:new Vector2(-13000,-7000)});
new LongAAA({canvasElement:canvas, position:new Vector2(-16000,16000)});
new GigaAAA({canvasElement:canvas, position:new Vector2(20000,0)});
new LongAAA({canvasElement:canvas,position:new Vector2(7000,8000)})