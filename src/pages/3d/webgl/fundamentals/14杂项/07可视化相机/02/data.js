

export const cubeArrays={
     positions :  [
         -1, -1,  1,  // cube vertices
          1, -1,  1,
         -1,  1,  1,
         1,  1,  1,
         -1, -1,  3,
         1, -1,  3,
         -1,  1,  3,
         1,  1,  3,
         0,  0,  1,  // cone tip
     ] ,
     indices:[
        0, 1, 1, 3, 3, 2, 2, 0, // cube indices
        4, 5, 5, 7, 7, 6, 6, 4,
        0, 4, 1, 5, 3, 7, 2, 6,
     ]
};