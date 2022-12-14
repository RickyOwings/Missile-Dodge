const bombShape = [
    new Vector2(-5,0),
    new Vector2(5,0)
]
class Bomb extends GameObject{
    constructor(position, velocity, canvasElement){
        super({position:position, vecolity:velocity, canvasElement:canvasElement});
        this.lifeTime = 5000;
        this.sound = new Audio("./Assets/Sounds/bombdrop.wav")
        this.sound.play();
    }
    update(progress){
        super.update(progress)
        this.lifeTime-=progress
        if(this.lifeTime<0){
            this.blowup()
        }
    }
    blowup(){
        for(let i = 0; i < GameObject.instances.length; i++){
            let other = GameObject.instances[i];
            if(other.position.deltaDist(this.position)<100){
                other.die();
            }
        }
        this.garbage = true;
        let explosion = new Explosion(this.position, this.canvasElement);
        explosion.size = 5;
    }
    draw(){
        super.draw();
        this.drawObjectRelVectorArrayAsWire(bombShape,{strokeStyle:"#0f0"});
    }
}