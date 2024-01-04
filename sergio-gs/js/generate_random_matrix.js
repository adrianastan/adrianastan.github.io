

function generateRandomMatrix(rows, columnValues) {
    // Initialize an array to store the generated matrix
    let matrix = [];

    for (let i=0; i<columnValues[0]; i+=1)
        for (let j=0; j<columnValues[1]; j+=1)
            for (let k=0; k<columnValues[2]; k+=1)
                matrix.push([i,j,k]);
          
    /*for (let i = matrix.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap array elements
        [matrix[i], matrix[j]] = [matrix[j], matrix[i]];
    }*/
    //console.log(matrix.length)
    return matrix;   
}


// Function to check if two rows have two common values
function hasTwoCommonValues(row1, row2) {
  let commonCount = 0;
  for (let i = 0; i < row1.length; i++) {
    if (row1[i] === row2[i]) {
      commonCount++;
    }
  }
  return commonCount === 2;
}

function orderMatrix2(inputMatrix){
    //first row
    let matrix = JSON.parse(JSON.stringify(inputMatrix));
    let orig_length = matrix.length;
    let sel_row = Math.floor(Math.random() * matrix.length);
    var newMatrix = [matrix[sel_row]];
    var pp = matrix[sel_row];
    var newMatrixLength = 1;
   // console.log("Sel row: ", matrix[sel_row]);
    matrix.splice(sel_row, 1);
     
   // console.log("New matrix: ", matrix.length);
    do {
        var temp_matrix = [];
        for (let i=0; i< matrix.length; i++){
            if (hasTwoCommonValues(pp, matrix[i]))
                temp_matrix.push(i)     
        }
        /*console.log("Temp_matrix:", JSON.stringify(temp_matrix));*/
        if (temp_matrix.length > 0){
            sel_row = Math.floor(Math.random() * temp_matrix.length);
            /*console.log("Sel row:", sel_row);*/
            newMatrix.push(matrix[temp_matrix[sel_row]]);
            pp = matrix[temp_matrix[sel_row]];
            matrix.splice(temp_matrix[sel_row], 1);
        }
        else{
            //console.log("exiting at iteration: ", newMatrix.length, "out of", orig_length);
            break;
            /*console.log("***** SELECTING RANDOM ****");
            sel_row = Math.floor(Math.random() * matrix.length);
            console.log("Sel row:", sel_row);
            newMatrix.push(matrix[sel_row]);
            pp = matrix[sel_row];
            matrix.splice(sel_row, 1);*/
        }
        
    } while(newMatrix.length < orig_length);
    return newMatrix;
    
}


var attempts = 0;
var matrix = []
var orig_length;
matrix = generateRandomMatrix(90, [2,15,3]);
do {
        orig_length = matrix.length;
        //console.log("matrix orig:", JSON.stringify(matrix));
        nm = orderMatrix2(matrix);
        attempts+=1;
} while ((nm.length<orig_length) && (attempts < 1000));

console.log("Attempts: ", attempts);
console.log(JSON.stringify(nm), nm.length, matrix.length);

for (let i=0; i<matrix.length; i+=1)
       if (!JSON.stringify(nm).includes(JSON.stringify(matrix[i]))){
           console.log("One is not included", matrix[i]);
           break;
       }
           
