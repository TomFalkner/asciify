var ascii_apocalypse = (function(){
    var app,
        averageColor,
        canvas,
        context,
        charBufferCtx,
        charCompare,
        drawImage,
        drawCharacter,
        getBestLetter,
        getCharacterData,
        getColorCharacterData,
        getImageData,
        theCharacters,
        placeImage;

    theCharacters = ['a', 'b', 'c', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'O', 'P', 'Q', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '@', '#', '$', '%', '&', '*', '-', '+', '=', '|', '<', '>', '?', '.', '_', ' '];

    averageColor = function(imageBuffer) {
        var result,
        count = 0,
        red = 0,
        green = 0,
        blue = 0,
        alpha = 0,
        bufferLength = imageBuffer.length,
        i = 0;

        for (i; i < bufferLength; i += 4){

            red += imageBuffer[i];
            green += imageBuffer[i + 1];
            blue += imageBuffer[i + 2];
            alpha += imageBuffer[i + 3];

            count++;
        }

        red = Math.round(red / count);
        green = Math.round(green / count);
        blue = Math.round(blue / count);
        alpha = Math.round(alpha / count);

        result = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha  + ')';
        return result;
    };
    charCompare = function(bufferOne, bufferTwo){
        var result = 0,
        i = 0,
        red,
        green,
        blue,
        alpha,
        bufferLength = bufferOne.length;

        for (i; i < bufferLength; i +=4){
            red = Math.pow((bufferTwo[i] - bufferOne[i]), 2);
            green = Math.pow((bufferTwo[i + 1] - bufferOne[i + 1]), 2);
            blue = Math.pow((bufferTwo[i + 2] - bufferOne[i + 2]), 2);
            alpha = Math.pow((bufferTwo[i + 3] - bufferOne[i + 3]), 2);

            result += Math.sqrt(red + green + green + alpha);
        }

        return Math.round(result);
    };

    drawImage = function(theImage) {
        context.drawImage(theImage, 0, 0);
    };

    drawCharacter = function(aCharacter, characterColor) {
        characterColor = characterColor || 'rgba(0, 0, 0, 255)';
        charBufferCtx.clearRect(0, 0, 10, 10);
        charBufferCtx.fillStyle = characterColor;
        charBufferCtx.font = '14px monospace';
        charBufferCtx.textAlign = "center";
        charBufferCtx.fillText(aCharacter, 5, 9);
    };
    getBestLetter = function(imageBuffer){
        //Will return a buffer of the character that matches.
        var i = 0,
        j = 0,
        closestValue = 4294967295, //MAX INT
        charLength = theCharacters.length,
        result,
        currentValue, 
        characterData,
        avgColor;

        avgColor = averageColor(imageBuffer.data); 

        for (i; i < charLength; i++) {

            characterData = getColorCharacterData(theCharacters[i], avgColor);

            currentValue = charCompare(characterData.data, imageBuffer.data);
            if (currentValue < closestValue){
                closestValue = currentValue;
                result = characterData;
            }

        }
        return result;
    };

    getCharacterData = (function(){
        var previousLetters = {};
        return function(aLetter){


            if(previousLetters.hasOwnProperty(aLetter)){
                return previousLetters[aLetter];
            }
            drawCharacter(aLetter);
            previousLetters[aLetter] = charBufferCtx.getImageData(0, 0, 10, 10);
            return previousLetters[aLetter];
        };
    }());

    getColorCharacterData = function(aLetter, aColor){
        var result;
        drawCharacter(aLetter, aColor);
        result = charBufferCtx.getImageData(0, 0, 10, 10);
        return result;
    };

    getImageData = function(offsetX, offsetY){
        return context.getImageData(offsetX, offsetY, 10, 10);
    };



    app = {
        draw:function(callBack){
            var x = 0, 
            y = 0, 
            incX = 10, 
            incY = 10,
            drawInterval,
            canvasHeight = canvas.height;
            canvasWidth = canvas.width;


            drawInterval = window.setInterval(function(){
                for(x; x < canvasWidth; x += incX){
                    var currentChunk = getImageData(x, y),
                    newChunk = getBestLetter(currentChunk);

                    context.putImageData(newChunk, x, y);
                }
                x = 0;

                y += incY;
                if(y >= canvasHeight){
                    window.clearInterval(drawInterval);
                    if(typeof(callBack) == "function"){
                        callBack();
                        console.log("draw complete");
                    }
                }

            }, 1);

        },
        testDistance:function(){
            var char1,
            char2,
            result;

            char1 = getCharacterData('a');
            char2 = getCharacterData('b');
            result = charCompare(char1.data, char2.data);
            console.log(result);

        },

        create:function(imageArray, count) {
            destination = imageArray[count];
            this.init(imageArray[count]);
            var that = this;

            this.draw(function(){
                newImage = canvas.toDataURL();
                console.log(newImage);
                destination.src = newImage;
                console.log("swap complete");
                count++;
                if(count < imageArray.length){
                    ascii_apocalypse.create(imageArray, count);
                }
            });
        },
        testAverage:function(){
            var result;

            var currentChunk = getImageData(0, 0);
            result = averageColor(currentChunk.data);
            console.log(result);

        },
        swap:function(theImage, theCanvas, oldImage) {
            var newImage,
            destination;
            if(! oldImage){
                destination = theImage;
            }

            this.init(theImage, theCanvas);

            this.draw(function(){
                newImage = canvas.toDataURL();
                console.log(newImage);
                destination.src = newImage;
                console.log("swap complete");
            });
        },
        multiswap:function(imageList) {
            if(!imageList){
                imageList = document.getElementsByTagName('img');
            }
            var newImage,
            destination,
            arrayLength,
            imageArray;
            if(imageList instanceof NodeList) {
                imageArray = Array.prototype.slice.call(imageList);
                arrayLength = imageArray.length;
            } else {
                alert('Multi swap requires a NodeList');
                return;
            }

            this.create(imageArray, 0);

        },
        now:function(){
            this.multiswap();
        },
        init:function(theImage){
            canvas = document.createElement('canvas');
            canvas.width = theImage.width;
            canvas.height = theImage.height;


            context = canvas.getContext('2d');

            drawImage(theImage);
            charBufferCtx = (function(){
                var charBuffer = document.createElement('canvas'),
                theContext;
                charBuffer.width = 10;
                charBuffer.height = 10;
                theContext = charBuffer.getContext('2d');
                return theContext;
            })();
        }
    }; 
    return app;
}());
