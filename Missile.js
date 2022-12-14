const missileShape = [
    new Vector2(6,0),
    new Vector2(5,1),
    new Vector2(6,0),
    new Vector2(5,-1),
    new Vector2(6,0),
    new Vector2(-6,0)
]
class Missile extends GameObject {
    constructor({position, angle, target, canvasElement}){
        super({position:position, rotation:angle, canvasElement:canvasElement});
        this.type = "missile";
        this.target = target;
        this.pinged = false;
        this.lead = new Vector2(0,0);
        this.fuel = 5000;
        this.fuelTime = 0;
        this.notchedTimer = 0;
        this.timeToNotch = 1000;
        this.notchedBy = 20;
        this.notched = false;
        this.detonate = false;
        this.initLifeTime = 15000;
        this.lifeTime = 15000;
        this.removedPing = false;
        this.color = "#f00"
        this.targetRot = 0;
        this.turnRate = .3;
        this.dragValue = 0.999;
        Missile.warning();
    }
    update(progress){
        super.update(progress);
        this.pingTarget();
        this.checkDetonate();
        if(this.detonate){this.doDetonate();};
        this.boost(progress);
        this.lifeTime-=progress;
        this.turn()
        this.liftVector();
        this.checkNotched(progress);
        if(!this.notched){this.targetRot = this.findLead(progress)}
    }
    turn(){
        let deltaRot = this.targetRot - this.rotation;
        let is360Angle = false;
        while(!is360Angle){
            if(deltaRot>Math.PI){
                deltaRot-=Math.PI*2
            }else if(deltaRot<=-Math.PI){
                deltaRot+=Math.PI*2
            }else{
                is360Angle = true
            }
        }
        if(deltaRot>0){
            this.rotVelocity = this.turnRate;
        }else{
            this.rotVelocity = -this.turnRate;
        }
    }
    pingTarget(){
        if(this.pinged){return}
        this.target.missilePings++
        this.pinged = true;
    }
    drag(){
        this.velocity = this.velocity.multiply(new Vector2(this.dragValue,this.dragValue));
    }
    boost(progress){
        if(this.fuelTime<this.fuel){
            this.acceleration = Vector2.fromAngleAndMagnitude(this.rotation, 150);
            this.fuelTime+=progress;
        }
        this.drag();
    }
    checkNotched(progress){
        let deltaV = this.target.velocity.subtract(this.velocity);
        deltaV = deltaV.rotateVector(this.rotation);
        if(Math.abs(deltaV.y)<this.notchedBy){
            this.notchedTimer+=progress;
            if(this.notchedTimer>this.timeToNotch){
                this.notched = true
                this.removePing();
            }
        }else{
            this.notchedTimer = 0;
        }
    }
    removePing(){
        if(this.removedPing){return};
        if(!this.pinged){return}
        console.log("missile lost target")
        this.target.missilePings--
        this.removedPing = true;
    }
    checkDetonate(){
        let distance = this.target.position.deltaDist(this.position);
        let vel = this.velocity.distance();
        if(distance<20||this.lifeTime<0){
            this.detonate = true;
        }
        if(distance<20){
            this.target.die();
        }
    }
    doDetonate(){
        if(!this.notched){this.removePing()}
        let explosion = new Explosion(this.position, this.canvasElement);
        this.remove();
    }
    findLead(progress){
        let dist = this.position.deltaDist(this.target.position);
        let deltaV = this.target.velocity.subtract(this.velocity);
        let velAndDist = this.target.velocity.multiply(new Vector2(dist/1000,dist/1000));
        let lead = this.target.position.add(velAndDist);
        return lead.deltaAtan2(this.position)
    }
    liftVector(){
        let liftVector = this.velocity.rotateVector(-this.rotation);
        liftVector = liftVector.multiply(new Vector2(0,-8));
        liftVector = liftVector.rotateVector(this.rotation);
        this.acceleration = this.acceleration.add(liftVector);
    }
    draw(){
        super.draw()
        if(this.notched){
            this.drawObjectRelVectorArrayAsWire(missileShape, {strokeStyle:"#aaa",lineWidth:"1px"});
            return;
        }
        this.drawObjectRelVectorArrayAsWire(missileShape,{strokeStyle:this.color, lineWidth:"1px"});
    }
}
class LongRangeMissle extends Missile{
    fuel = 1000;
    stage = 0;
    lifeTime = 30000;
    notchedBy = 5;
    turnRate = 0.1;
    dragValue = 0.9995;
    boost(progress){
        switch (this.stage){
            case 0:
                this.acceleration = Vector2.fromAngleAndMagnitude(this.rotation, 1000);
                if(this.fuel<this.fuelTime){
                    this.stage++
                    this.fuelTime = 0;
                }
                this.fuelTime+=progress;
                this.drag();
            break;
            case 1:
                let dist = this.position.deltaDist(this.target.position);
                if(dist<2000){
                    this.stage++
                    this.turnRate = 0.4;
                }
                this.drag();
            break;
            case 2:
                this.acceleration = Vector2.fromAngleAndMagnitude(this.rotation,50);
                if(this.fuel<this.fuelTime){
                    this.stage++
                }
                this.fuelTime+=progress;
                //this.drag();
            break;
            case 3:
                this.drag();
            break;
        }
    }
    pingTarget(){
        if(this.stage==2){
            super.pingTarget();
        }
    }
    draw(){
        super.draw();
        if(this.stage>=2){return}
        this.drawCircle(2000,this.position, {strokeStyle:this.color+2,lineWidth:"1px"})
    }
}
Missile.sound = new Audio("./Assets/Sounds/missile.wav");
Missile.sound.playing = false;
Missile.sound.volume = 1;
Missile.warning = ()=>{
    if(Missile.sound.playing){return}
    console.log("sound played");
    Missile.sound.pause();
    Missile.sound.currentTime = 0;
    Missile.sound.play();
    Missile.sound.playingSet();
}
Missile.sound.playingSet = ()=>{
    Missile.sound.playing = true;
    window.setTimeout(()=>{Missile.sound.playing = false},470);
}