import { Field, Circuit } from 'snarkyjs';

/* @param x an n*m matrix, encoded as x[i][j] for row i column j.
 * @param y an o*n matrix, both encoded as y[i][j] for row i column j.
 * Returns an o*m matrix.
 */
let matrix_mul = function (
  n: number,
  m: number,
  o: number,
  x: Field[][],
  y: Field[][]
): Field[][] {
  var res: Field[][] = [];
  /* Initialize output matrix */
  for (var i = 0; i < o; i++) {
    for (var j = 0; j < m; j++) {
      res[i][j] = Field.zero;
    }
  }
  /* Compute the output matrix. */
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      for (var k = 0; k < o; k++) {
        res[k][j] = res[k][j].add(x[i][j].mul(y[k][i]));
      }
    }
  }
  return res;
};

export function circuit(): Field[][] {
  let n = 3;
  let m = 4;
  let o = 3;
  let x = Circuit.witness(
    Circuit.array(Circuit.array<Field>(Field, m), n),
    () => {
      return [
        [Field.random(), Field.random(), Field.random(), Field.random()],
        [Field.random(), Field.random(), Field.random(), Field.random()],
        [Field.random(), Field.random(), Field.random(), Field.random()],
      ];
    }
  );
  let y = Circuit.witness(
    Circuit.array(Circuit.array<Field>(Field, o), m),
    () => {
      return [
        [Field.random(), Field.random(), Field.random(), Field.random()],
        [Field.random(), Field.random(), Field.random(), Field.random()],
        [Field.random(), Field.random(), Field.random(), Field.random()],
      ];
    }
  );
  return matrix_mul(n, m, o, x, y);
}
