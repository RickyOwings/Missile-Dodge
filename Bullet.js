const bulletShape = [
    new Vector2(-2,0),
    new Vector2(2,0)
]
class Bullet extends GameObject {
    constructor(parentVel, angle, position, canvas,type){
        super({position:position, vecolity:parentVel, rotation:angle, canvasElement:canvas});
        let bulletVel = Vector2.fromAngleAndMagnitude(this.rotation, 1000);
        this.lifeTime = 5000;
        this.isBullet = true;
        this.type = type;
        this.velocity = this.velocity.add(bulletVel);
        this.sound = new Audio("./Assets/Sounds/bulletSound.wav");
        this.sound.play();
    }
    update(progress){
        super.update(progress);
        for(let i = 0; i < GameObject.instances.length; i++){
            let other = GameObject.instances[i];
            if(other.type==this.type||other.type=="map"||other.type == "missile"||other.isBullet){continue};
            let dist = this.position.deltaDist(other.position);
            if(dist<10){
                other.damage(1);
                let bulletHit = new Audio("./Assets/Sounds/bulletHit.wav");
                bulletHit.play()
                this.garbage = true;
            }
        }
        this.lifeTime-=progress;
        if(this.lifeTime<0){
            this.garbage = true;
        }
    }
    draw(){
        super.draw();
        this.drawObjectRelVectorArrayAsWire(bulletShape, {strokeStyle:"#fff", lineWidth:"1px"})
    }
}