const explosionShape = [
    new Vector2(-5.074680, -6.186488),
    new Vector2(3.507699, -6.527832),
    new Vector2(-13.218188, -11.111604),
    new Vector2(-3.514248, -15.012685),
    new Vector2(13.162876, -11.794292),
    new Vector2(16.088688, -6.040197),
    new Vector2(12.382660, -4.479764),
    new Vector2(19.892242, 5.809339),
    new Vector2(10.237065, 7.028427),
    new Vector2(10.675937, 16.049679),
    new Vector2(0.386834, 5.272941),
    new Vector2(-4.196937, 14.879354),
    new Vector2(-14.486040, 11.953543),
    new Vector2(-3.075377, 3.224873),
    new Vector2(-17.899487, 3.858799),
];
class Explosion extends GameObject{
    constructor(position, canvasElement){
        super({position:position, canvasElement:canvasElement});
        this.lifeTime = 300;
        this.sound = new Audio("./Assets/Sounds/explosion.wav");
        this.sound.play();
        this.size = 1;
    }
    update(progress){
        super.update(progress);
        this.lifeTime-=progress;
        if(this.lifeTime<=0){
            this.remove();
        }
    }
    scaledShape(){
        if(this.size==1){return explosionShape}
        let newShape = [];
        for(let i = 0; i < explosionShape.length; i++){
            newShape[i] = explosionShape[i].multiply(new Vector2(this.size, this.size));
        }
        return newShape
    }
    draw(){
        super.draw();
        this.drawObjectRelVectorArrayAsWire(this.scaledShape(), {strokeStyle:"#fa0", lineWidth:"1px"});
    }
}