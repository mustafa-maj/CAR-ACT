class NeuralNetwork{
    constructor(neuronCounts){
        this.levels=[];
        for(let i=0;i<neuronCounts.length-1;i++){
            this.levels.push(new Level(
                neuronCounts[i],neuronCounts[i+1]
            ));
        }
    }

    static feedForward(givenInputs,network){
        let outputs=Level.feedForward(
            givenInputs,network.levels[0]);
        for(let i=1;i<network.levels.length;i++){
            outputs=Level.feedForward(
                outputs,network.levels[i]);
        }
        return outputs;
    }

    static mutate(network,amount=1){
        network.levels.forEach(level => {
            for(let i=0;i<level.biases.length;i++){
                level.biases[i]=lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i=0;i<level.weights.length;i++){
                for(let j=0;j<level.weights[i].length;j++){
                    level.weights[i][j]=lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        });
    }
}

class Level{
    constructor(inputCount,outputCount){
        this.inputs=new Array(inputCount);
        this.outputs=new Array(outputCount);
        this.biases=new Array(outputCount);

        this.weights=[];
        for(let i=0;i<inputCount;i++){
            this.weights[i]=new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level){
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                level.weights[i][j]=Math.random()*2-1;
            }
        }

        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=Math.random()*2-1;
        }
    }

    static feedForward(givenInputs,level){
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i]=givenInputs[i];
        }

        for(let i=0;i<level.outputs.length;i++){
            let sum=0
            for(let j=0;j<level.inputs.length;j++){
                sum+=level.inputs[j]*level.weights[j][i];
            }

            if(sum>level.biases[i]){
                level.outputs[i]=1;
            }else{
                level.outputs[i]=0;
            } 
        }

        return level.outputs;
    }
}

class networkDisplay{
    static drawNetwork(background,network){
        const margin=50;
        const left=margin;
        const top=margin;
        const width=background.canvas.width-margin*2;
        const height=background.canvas.height-margin*2;

        const levelHeight=height/network.levels.length;

        for(let i=network.levels.length-1;i>=0;i--){
            const levelTop=top+
                lerp(
                    height-levelHeight,
                    0,
                    network.levels.length==1
                        ?0.5
                        :i/(network.levels.length-1)
                );

            background.setLineDash([7,3]);
            networkDisplay.drawLevel(background,network.levels[i],
                left,levelTop,
                width,levelHeight,
                i==network.levels.length-1
                    ?['🠉','🠈','🠊','🠋']
                    :[]
            );
        }
    }

    static drawLevel(background,level,left,top,width,height,outputLabels){
        const right=left+width;
        const bottom=top+height;

        const {inputs,outputs,weights,biases}=level;

        for(let i=0;i<inputs.length;i++){
            for(let j=0;j<outputs.length;j++){
                background.beginPath();
                background.moveTo(
                    networkDisplay.#getNodeX(inputs,i,left,right),
                    bottom
                );
                background.lineTo(
                    networkDisplay.#getNodeX(outputs,j,left,right),
                    top
                );
                background.lineWidth=2;
                background.strokeStyle=getRGBA(weights[i][j]);
                background.stroke();
            }
        }

        const nodeRadius=18;
        for(let i=0;i<inputs.length;i++){
            const x=networkDisplay.#getNodeX(inputs,i,left,right);
            background.beginPath();
            background.arc(x,bottom,nodeRadius,0,Math.PI*2);
            background.fillStyle="black";
            background.fill();
            background.beginPath();
            background.arc(x,bottom,nodeRadius*0.6,0,Math.PI*2);
            background.fillStyle=getRGBA(inputs[i]);
            background.fill();
        }
        
        for(let i=0;i<outputs.length;i++){
            const x=networkDisplay.#getNodeX(outputs,i,left,right);
            background.beginPath();
            background.arc(x,top,nodeRadius,0,Math.PI*2);
            background.fillStyle="black";
            background.fill();
            background.beginPath();
            background.arc(x,top,nodeRadius*0.6,0,Math.PI*2);
            background.fillStyle=getRGBA(outputs[i]);
            background.fill();

            background.beginPath();
            background.lineWidth=2;
            background.arc(x,top,nodeRadius*0.8,0,Math.PI*2);
            background.strokeStyle=getRGBA(biases[i]);
            background.setLineDash([3,3]);
            background.stroke();
            background.setLineDash([]);

            if(outputLabels[i]){
                background.beginPath();
                background.textAlign="center";
                background.textBaseline="middle";
                background.fillStyle="black";
                background.strokeStyle="white";
                background.font=(nodeRadius*1.5)+"px Arial";
                background.fillText(outputLabels[i],x,top+nodeRadius*0.1);
                background.lineWidth=0.5;
                background.strokeText(outputLabels[i],x,top+nodeRadius*0.1);
            }
        }
    }

    static #getNodeX(nodes,index,left,right){
        return lerp(
            left,
            right,
            nodes.length==1
                ?0.5
                :index/(nodes.length-1)
        );
    }
}