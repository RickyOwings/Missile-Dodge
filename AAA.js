const AAAShape = [
    new Vector2(-10,-10),
    new Vector2(10,-10),
    new Vector2(10,10),
    new Vector2(-10,10)
]
const AAATurretShape = [
    new Vector2(-6,-3),
    new Vector2(6,-3),
    new Vector2(6,3),
    new Vector2(-6,3)
]
class AAA extends GameObject {
    constructor({canvasElement:canvasElement, position:position}){
        super({canvasElement:canvasElement, position:position});
        this.health = 50;
        this.isAAA = true;
        this.type = "enemy";
        this.rof = 15000;
        this.fireTimer = this.rof - 2000
        this.turret = new AAATurret(this.position,this.canvasElement,this.type);
        this.range = 4000;
    }
    update(progress){
        super.update(progress);
        this.healthCheck();
        if(this.fireTimer<this.rof){
            this.fireTimer+=progress;
        }else{
            this.tryFire();
        }
        this.setTurretAngle();
    }
    healthCheck(){
        if(this.health<0){
            this.die()
        }
    }
    damage(amount){
        this.health-=amount;
    }
    tryFire(){
        for(let i = 0; i < GameObject.instances.length; i++){
            if(GameObject.instances[i].type!="player"){continue};
            let player = GameObject.instances[i];
            let distance = this.position.deltaDist(player.position);
            if(distance>this.range){return};
            this.fireMissile(player);
            return;
        }
    }
    fireMissile(target){
        let delta = target.position.subtract(this.position);
        let angle = delta.atan2();
        angle-=Math.PI;
        let missile = new Missile({position:this.position,angle:angle+Math.PI,target:target,canvasElement:this.canvasElement});
        missile.velocity = Vector2.fromAngleAndMagnitude(this.turret.rotation - Math.PI/2, 200)
        this.fireTimer=0;
        console.log("missilefired")
    }
    setTurretAngle(){
        let player = undefined;
        for(let i = 0; i < GameObject.instances.length; i++){
            if(GameObject.instances[i].type!="player"){continue};
            player = GameObject.instances[i];
        }
        if(player==undefined){return};
        this.turret.rotation = this.findLead(player);
    }
    findLead(target){
        let vel = 1000;
        let distance = this.position.deltaDist(target.position);
        let timeToTarget = distance/vel;
        let leadComp = target.velocity.multiply(new Vector2(timeToTarget, timeToTarget));
        let lead = target.position.subtract(leadComp);
        let leadRelative = lead.subtract(this.position);
        return leadRelative.atan2() + Math.PI/2;
    }
    draw(){
        super.draw();
        this.drawObjectRelVectorArrayAsWire(AAAShape, {strokeStyle:"#f00", lineWidth:"1px"});
        this.drawCircle(this.range,this.position,{strokeStyle:"#f002"})
    }
    die(){
            new Explosion(this.position, this.canvasElement);
            this.garbage = true;
            this.turret.garbage = true;
    }
}
class GunAAA extends AAA{
    canFire = true;
    burstTime = 500;
    burstTimer = 0;
    burstInterval = 2000;
    rof = 30;
    range = 3000;
    update(progress){
        this.burstFire();
        super.update(progress);
        this.burstTimer+=progress;
        
    }
    burstFire(){
        if(!this.canFire){return}
        if(this.burstTimer>this.burstTime){
            this.canFire = false;
            setTimeout(()=>{this.burstTimer = 0; this.canFire = true},this.burstInterval);
        }
    }
    fireMissile(target){
        if(!this.canFire){return}
        let dist = this.position.deltaDist(target.position);
        let lead = target.position.add(target.velocity.multiply(new Vector2(dist/900,dist/900)))
        let delta = lead.subtract(this.position);
        let angle = delta.atan2();
        new Bullet(this.velocity, angle,this.position, this.canvasElement,this.type);
        this.fireTimer = 0;
    }
}
class LongAAA extends AAA{
    range = 12000
    rof = 20000
    fireMissile(target){
        let delta = target.position.subtract(this.position);
        let angle = delta.atan2();
        angle-=Math.PI;
        new LongRangeMissle({position:this.position,angle:angle-Math.PI,target:target,canvasElement:this.canvasElement});
        this.fireTimer=0;
        console.log("missilefired")
    }
}
class GigaAAA extends AAA{
    constructor({canvasElement,position}){
        super({canvasElement:canvasElement, position:position});
        this.rof = 100
    }
}
class AAATurret extends GameObject{
    constructor(position,canvas,type){
        super({position:position, canvasElement:canvas});
        this.type = type;
    };
    update(progress){
        super.update(progress);
    }
    draw(){
        super.draw();
        this.drawObjectRelVectorArrayAsWire(AAATurretShape, {strokeStyle:"#f00",lineWidth:"1px"});
    }
}