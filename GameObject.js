class GameObject {
    constructor({
        position = new Vector2(),
        vecolity = new Vector2(), 
        acceleration = new Vector2(),
        rotation = 0,
        canvasElement = undefined
    }){ 
        this.seed = Math.random();
        this.canvasElement = canvasElement;
        this.position = position;
        this.velocity = vecolity;
        this.acceleration = acceleration;
        this.rotation = rotation;
        this.rotVelocity = 0;
        this.rotAcceleration = 0;
        
        this.garbage = false;

        this.type = "generic";
        
        this.index = GameObject.instances.length;
        GameObject.instances.push(this);
    }
    update(progress){
        let progressMult = new Vector2(progress/1000, progress/1000);
        this.velocity = this.velocity.add(this.acceleration.multiply(progressMult));
        this.position = this.position.add(this.velocity.multiply(progressMult));

        this.rotVelocity +=this.rotAcceleration*progress/1000
        this.rotation +=this.rotVelocity*progress/1000

        this.acceleration = new Vector2();
        this.rotAcceleration = 0;
    }
    draw(){
        if(this.canvasElement==undefined){return};
    }
    drawObjectRelVectorArrayAsWire(vector2Array, style = {strokeStyle: "#f0f",lineWidth:"1px"}){
        
        let translatedShape = [];
        for(let i = 0; i < vector2Array.length; i++){
            let translate = vector2Array[i].add(this.position);
            let rotate = translate.rotateFromPoint(this.rotation,this.position);
            translatedShape[i] = this.getCanvasPosition(rotate);
        }
        let ctx = this.canvasElement.getContext("2d");
        ctx.strokeStyle = style.strokeStyle;
        ctx.lineWidth = style.lineWidth;
        ctx.beginPath();
        ctx.moveTo(translatedShape[0].x, translatedShape[0].y);
        for(let i = 1; i < translatedShape.length; i++){
            ctx.lineTo(translatedShape[i].x, translatedShape[i].y);
        }
        ctx.closePath();
        ctx.stroke();
    }
    drawCircle(radius,position = new Vector2(0,0), style = {strokeStyle: "#f0f", lineWidth:"1px"}){
        let ctx = this.canvasElement.getContext("2d");
        let canvasRadius = GameObject.camera.zoom * radius;
        let canvasPosition = this.getCanvasPosition(position);
        ctx.strokeStyle = style.strokeStyle;
        ctx.lineWidth = style.lineWidth;
        ctx.beginPath();
        ctx.arc(canvasPosition.x,canvasPosition.y,canvasRadius, 0,Math.PI*2);
        ctx.closePath();
        ctx.stroke();
    }
    /**
     * 
     * @param {Vector2} gameVector 
     * @returns {Vector2}
     */
    getCanvasPosition(gameVector){
        if(this.canvasElement==undefined){throw "canvas element needs to be defined to access canvas coordinates"};
        let camera = GameObject.camera;
        //Set position relative to camera
        gameVector = gameVector.subtract(camera.position);
        //Rotate the vector to align with camera
        gameVector = gameVector.rotateVector(-camera.rotation);
        //Scale to the zoom
        gameVector = gameVector.multiply(new Vector2(camera.zoom, camera.zoom));
        //Flip the y to the other direction
        gameVector = gameVector.multiply(new Vector2(1,-1));
        //Adding canvas width and height
        gameVector = gameVector.add(new Vector2(this.canvasElement.width/2, this.canvasElement.height/2));
        
        return gameVector;

    }
    remove(){
        this.garbage = true;
    }
    damage(){}
    die(){}
}
GameObject.instances = [];
GameObject.updateAll = (progress)=>{
    for(let i = 0; i<GameObject.instances.length; i++){
        GameObject.instances[i].update(progress);
    }
    GameObject.garbageCollector();
    GameObject.indexer();   
}
GameObject.garbageCollector = ()=>{
    for(let i = 0; i<GameObject.instances.length; i++){
        if(GameObject.instances[i].garbage){
            GameObject.instances.splice(i,1);
            i--
        }
    }
}
GameObject.indexer = ()=>{
    for(let i = 0; i < GameObject.instances.length; i++){
        GameObject.instances[i].index = i;
    }
}
GameObject.drawAll = ()=>{
    for(let i = 0; i<GameObject.instances.length; i++){
        GameObject.instances[i].draw();
    }
}
GameObject.camera = {
    position: new Vector2(0,0),
    rotation: 0,
    //When zoom is 1, 1 unit is 1px. When zoom is 2, 1 unit is 2px
    zoom:0.02
}