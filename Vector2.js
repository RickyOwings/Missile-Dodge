class Vector2{
    constructor(x=0,y=0){
        this.x = x;
        this.y = y;
    }
    /**
     * 
     * @param {Vector2} other 
     * @returns {Vector2} 
     */
    add(other){
        let newVector = new Vector2();
        newVector.x = this.x + other.x;
        newVector.y = this.y + other.y;
        return newVector;
    }
    /**
     * 
     * @param {Vector2} other 
     * @returns {Vector2}
     */
    subtract(other){
        let newVector = new Vector2();
        newVector.x = this.x - other.x;
        newVector.y = this.y - other.y;
        return newVector;
    }
    /**
     * 
     * @param {Vector2} other 
     * @returns {Vector2}
     */
    multiply(other){
        let newVector = new Vector2();
        newVector.x = this.x * other.x;
        newVector.y = this.y * other.y;
        return newVector;
    }
    /**
     * 
     * @param {Vector2} other 
     * @returns {Vector2}
     */
    divide(other){
        let newVector = new Vector2();
        newVector.x = this.x / other.x;
        newVector.y = this.y / other.y;
        return newVector;
    }
    /**
     * 
     * @param {Number} angle 
     * @returns {Vector2}
     */
    rotateVector(angle){
        let distance = this.distance();
        let thisAngle = this.atan2();
        return Vector2.fromAngleAndMagnitude(angle+thisAngle,distance);
    }
    /**
     * 
     * @param {Number} angle 
     * @param {Vector2} point 
     * @returns {Vector2}
     */
    rotateFromPoint(angle, point){
        let delta = this.subtract(point);
        let rotatedPoint = delta.rotateVector(angle);
        return rotatedPoint.add(point);
    }
    /**
     * 
     * @returns {Number}
     */
    distance(){
        return Math.sqrt(this.x**2 + this.y**2);
    }
    /**
     * 
     * @param {Vector2} other 
     * @returns {Number}
     */
    deltaDist(other){
        let delta = this.subtract(other);
        return delta.distance();
    }
    /**
     * 
     * @returns {Number}
     */
    atan2(){
        return Math.atan2(this.y,this.x);
    }
    /**
     * 
     * @param {Vector2} other 
     * @returns {Number}
     */
    deltaAtan2(other){
        let delta = this.subtract(other);
        return delta.atan2();
    }
}
/**
 * 
 * @param {Number} angle 
 * @param {Number} magnitude 
 * @returns {Vector2} 
 */
Vector2.fromAngleAndMagnitude = (angle, magnitude) => {
    return new Vector2(
        Math.cos(angle)*magnitude,
        Math.sin(angle)*magnitude
    )
}
/**
 * 
 * @param {Array} Vector2Array 
 * @param {Vector2} Vector 
 */
Vector2.multArray = (Vector2Array, Vector) => {
    let tempArray = [];
    for(let i = 0; i < Vector2Array.length; i++){
        tempArray[i] = Vector2Array[i].multiply(Vector);
    }
    return tempArray;
}