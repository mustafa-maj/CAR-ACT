class backgroundRoad{
    // car lane simulator details
    constructor(x,width,laneCount=3){
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;

        this.left=x-width/2;
        this.right=x+width/2;

        const infinity=1000000;
        this.top=-infinity;
        this.bottom=infinity;

        const topLeft={x:this.left,y:this.top};
        const topRight={x:this.right,y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const bottomRight={x:this.right,y:this.bottom};
        this.borders=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
    }

    getLaneCenter(laneIndex){
        const laneWidth=this.width/this.laneCount;
        return this.left+laneWidth/2+
            Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }

    draw(background){
        background.lineWidth=5;
        background.strokeStyle="black";

        for(let i=1;i<=this.laneCount-1;i++){
            const x=lerp(
                this.left,
                this.right,
                i/this.laneCount
            );
            
            background.setLineDash([20,20]);
            background.beginPath();
            background.moveTo(x,this.top);
            background.lineTo(x,this.bottom);
            background.stroke();
        }

        background.setLineDash([]);
        this.borders.forEach(border=>{
            background.beginPath();
            background.moveTo(border[0].x,border[0].y);
            background.lineTo(border[1].x,border[1].y);
            background.stroke();
        });
    }
}