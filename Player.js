const input = {
    'w':0,
    's':0,
    'a':0,
    'd':0,
    '=':0,
    '-':0,
    'q':0
};
var clickInput = {
    '1':0
}
const playerWings = [
    new Vector2(-10,5),
    new Vector2(10,0),
    new Vector2(-10,-5)
]
const pipperShape = [
    new Vector2(0,0),
    new Vector2(2000,0)
]
const searchAngle = Math.PI/8;
const searchDist = 900;
const searchShape = [
    new Vector2(0,0),
    Vector2.fromAngleAndMagnitude(searchAngle/2, searchDist),
    new Vector2(searchDist,0),
    Vector2.fromAngleAndMagnitude(-searchAngle/2, searchDist)
]
const playerColor = "#0f0";
document.addEventListener('mousedown',(event)=>{
    input["mousedown"]=1;
})
document.addEventListener('mouseup', (event)=>{
    input["mousedown"]=0;
})
document.addEventListener('keydown', (event)=>{
    input[event.key]=1;
    if (event.key == " ") input["mousedown"] = 1;
    if (event.key == "ArrowDown") input["q"] = 1;
});
document.addEventListener('keyup', (event)=>{
    input[event.key]=0;
    if (event.key == " ") input["mousedown"] = 0;
    if (event.key == "ArrowDown") input["q"] = 0;
});
document.addEventListener('keypress',(event)=>{
    clickInput[event.key] = 1;
})
class Player extends GameObject{
    constructor({
        position = new Vector2(0,0),
        velocity = new Vector2(0,0),
        rotation = 0,
        canvasElement = undefined,
    }){
        super({
            position:position, 
            vecolity:velocity, 
            rotation:rotation,
            canvasElement:canvasElement
        });
        this.lockTime = 2000;
        this.lockTimer = 0;
        this.health = 10;
        this.dead = false;
        this.missilePings = 0;
        this.type = "player";
        this.soundEngine = new Audio("./Assets/Sounds/engine.wav");
        this.warningSound = new Audio("./Assets/Sounds/active radar.wav");
        this.missileLockSound = new Audio("./Assets/Sounds/aquiretarget.wav");
        this.missileLockSound.preservesPitch = false;
        this.lockSoundLoopPoint = 0;
        this.lockSoundLength = 61;
        this.roBomb = 30000;
        this.bombTimer = 30000;
        this.bombColor = "#f002"
        //Engine sound loop
        setInterval(()=>{
            this.soundEngine.pause(),
            this.soundEngine.currentTime = 0;
            this.soundEngine.play();
        },2311);
        //Warning sound loop
        setInterval(()=>{
            this.warningSound.pause();
            this.warningSound.currentTime = 0;
            this.warningSound.play();
        },952);
        //Missile lock loop
        setInterval(()=>{
            this.missileLockSound.pause();
            this.missileLockSound.playbackRate = (this.lockTimer/this.lockTime)+1;
            this.missileLockSound.currentTime = 0;
            this.missileLockSound.play();
        },((this.lockTimer/this.lockTime)+1)*61)
        this.hasInputed = false;
        window.addEventListener("keydown", ()=>{
            if(this.hasInputed){return}
            //this.soundEngine.play();
            //this.warningSound.play();
            //this.missileLockSound.play();
            this.hasInputed = true;
        });
        //0 guns, 1 missile
        this.fireMode = 0;
        this.gunRof = 50;
        this.fireTimer = 0;
    }
    soundUpdate(){
        this.soundEngine.volume = 0.3 + 0.1 * input["w"] - 0.1 * input["s"];
        if(this.missilePings>0){
            this.warningSound.volume = 0.1;
        }else{
            this.warningSound.volume = 0;
        }
    }
    update(progress){
        super.update(progress);
        this.healthCheck();
        this.parentCamera();
        if(this.dead){
            this.rotVelocity*=0.99;
            this.velocity = this.velocity.multiply(new Vector2(0.99,0.99))
            return
        }
        this.firingUpdate(progress)
        this.soundUpdate();
        let vel = this.velocity.distance();
        let fastTurn = 160;
        let turnSpeed = 20;
        let grad = 12800;
        let velCurve = (grad * turnSpeed)/((vel - fastTurn)**2 + grad);
        this.rotAcceleration = (input["a"] - input["d"])*velCurve;
        this.rotVelocity *= 0.9
        let moveForceMag = ((input["w"] - 0.5 * input["s"])+1)*80;
        this.acceleration = Vector2.fromAngleAndMagnitude(this.rotation,moveForceMag);
        if(input["q"]){
            let drag = Vector2.fromAngleAndMagnitude(this.rotation + Math.PI, vel);
            this.acceleration = this.acceleration.add(drag)
        }
        this.velocity = this.velocity.multiply(new Vector2(0.998, 0.998));
        this.liftVector();
    }
    healthCheck(){
        if(this.dead){return};
        if(this.health<0){
            this.die();
        }
    }
    firingUpdate(progress){
        if(clickInput['1']==1){
            clickInput['1']=0;
            this.switchFireMode();
        }
        switch(this.fireMode){
            case 0:
                if(this.fireTimer>this.gunRof){
                    if(input["mousedown"]){
                        new Bullet(this.velocity, this.rotation, this.position, this.canvasElement, this.type);
                        this.fireTimer = 0;
                        this.lockColor = "#f004"
                    }else{
                        this.lockColor = "#00f4"
                    }
                }
                this.missileLockSound.volume = 0;
            break;
            case 1:
                if(input["mousedown"]){
                    this.lockTimer+=progress;
                    if(this.lockTimer>this.lockTime){
                        this.lockTimer = this.lockTime;
                        this.lockColor = "#f004"
                        this.fireMissile();
                    }
                }else{
                    this.lockTimer = 0;
                    this.lockColor ="#00f4"
                }

                this.lockSoundLoopPoint = (this.lockTimer/this.lockTime)*this.lockSoundLength
                this.missileLockSound.volume = 0.05;
            break;
            case 2:
                if(this.bombTimer>this.roBomb){
                    this.bombColor = "#f002"
                }else{
                    this.bombColor = "#00f2"
                }
                if(input["mousedown"]&&this.bombTimer>this.roBomb){
                    new Bomb(this.position, this.velocity,this.canvasElement)
                    this.bombTimer = 0;
                }
                this.missileLockSound.volume = 0;
            break;
        }
        this.bombTimer+=progress;
        this.fireTimer+=progress;
    }
    calcBombPosition(){
        let bombTime = 5000;
        return this.position.add(this.velocity.multiply(new Vector2(5,5)));
    }
    fireMissile(){
        for(let i = 0; i < GameObject.instances.length; i++){
            let enemy = GameObject.instances[i];
            if(!enemy.isAAA){continue};
            let delta = this.position.subtract(enemy.position)
            delta = delta.rotateVector(-this.rotation - Math.PI)
            let angle = delta.atan2();
            console.log(angle)
            if(Math.abs(angle)>searchAngle){continue};
            if(this.position.deltaDist(enemy.position)>searchDist){continue};
            console.log(angle);
            let missile = new Missile({position:this.position, angle:this.rotation,target:enemy, canvasElement:this.canvasElement});
            missile.velocity = missile.velocity.add(this.velocity);
            missile.color = "#0f0"
            this.lockTimer = 0;
        }
    }
    fireModes = 3;
    switchFireMode(){
        if(this.fireMode==2){
            this.fireMode = 0;
        }else{
            this.fireMode++
        }
    }
    liftVector(){
        let liftVector = this.velocity.rotateVector(-this.rotation);
        liftVector = liftVector.multiply(new Vector2(0,-2));
        liftVector = liftVector.rotateVector(this.rotation);
        this.acceleration = this.acceleration.add(liftVector);
    }
    parentCamera(){
        GameObject.camera.position = this.position;
        GameObject.camera.zoom *= 0.99**(input['-']-input['='])
    }
    draw(){
        super.draw();
        //wings
        let wingShrink = 0.9**Math.abs(this.rotVelocity*8);
        let forceMag = ((input["w"] - 0.5 * input["s"])+1)*10;
        let flame = [
            new Vector2(-10, 1),
            new Vector2((-forceMag)-10,0),
            new Vector2(-10, -1)
        ]
        let wingsTransform = Vector2.multArray(playerWings, new Vector2(1,wingShrink));
        let prograde = [
            new Vector2(0,0),
            this.velocity.rotateVector(-this.rotation).multiply(new Vector2(0.5,0.5))
        ]
        if(this.dead){
            this.drawObjectRelVectorArrayAsWire(playerWings, {strokeStyle:"#aaa", lineWidth:"1px"});
            return
        }
        if(this.fireMode==0){
            this.drawObjectRelVectorArrayAsWire(pipperShape, {strokeStyle:this.lockColor, lineWidth:"1px"});
        }
        if(this.fireMode==1){
            this.drawObjectRelVectorArrayAsWire(searchShape, {strokeStyle:this.lockColor, lineWidth:"1px"})
        }
        if(this.fireMode==2){
            this.drawCircle(100,this.calcBombPosition(),{strokeStyle:this.bombColor})
            this.drawObjectRelVectorArrayAsWire([new Vector2(), this.calcBombPosition().subtract(this.position).rotateVector(-this.rotation)],this.position,{strokeStyle:this.bombColor, lineWidth:"2px"})
        }
        this.drawObjectRelVectorArrayAsWire(prograde, {strokeStyle:"#ff01", lineWidth:"1px"})
        this.drawObjectRelVectorArrayAsWire(flame, {strokeStyle:"#fa0",lineWidth:"1px"});
        this.drawObjectRelVectorArrayAsWire(wingsTransform, {strokeStyle:"#0f0", lineWidth:"1px"});
    }
    die(){      
        if(this.dead){return}  
        this.warningSound.volume = 0;
        this.soundEngine.volume = 0;
        this.missileLockSound = 0;
        this.dead = true;
        this.health = 0;
        window.setTimeout(()=>{
            new Explosion(this.position,this.canvasElement);
            this.remove();
        },5000);
    }
    damage(amount){
        this.health-=amount;
    }
    remove(){

        super.remove();
    }
    
}
