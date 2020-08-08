const model = {
  A: new Observable.BehaviorSubject([[1, 2], [3, 4]]),
};

function createMatrix(matrix, parent, editable) {
  const table = document.createElement('table');
  for (let i = 0; i < matrix.length; ++i) {
    const tr = document.createElement('tr');
    for (let j = 0; j < matrix[i].length; ++j) {
      const td = document.createElement('td');
      if (editable) {
        const input = document.createElement('input');
        input.setAttributeNS(null, 'type', 'number');
        input.setAttributeNS(null, 'class', 'cell');
        input.setAttributeNS(null, 'value', matrix[i][j]);
        input.setAttributeNS(null, 'onchange', `updateA(event, model.A, ${i}, ${j})`);
        td.appendChild(input);
      } else {
        const span = document.createElement('span');
        span.innerText = matrix[i][j].toFixed(2);
        td.appendChild(span);
        td.setAttributeNS(null, 'class', 'wide-cell');
      }
      tr.appendChild(td);
    }
    if (editable) {
      const removeRowButton = document.createElement('button');
      removeRowButton.innerText = '-';
      removeRowButton.setAttributeNS(null, 'onclick', `removeRow(model.A, ${i})`);
      tr.appendChild(removeRowButton);

      const addColumnButton = document.createElement('button');
      addColumnButton.innerText = '+';
      addColumnButton.setAttributeNS(null, 'onclick', `addRow(model.A, ${i})`);
      tr.appendChild(addColumnButton);
    }
    table.appendChild(tr);
    if (editable && i === matrix.length - 1) {
      const removeButtonRow = document.createElement('tr');
      const addButtonRow = document.createElement('tr');
      for (let j = 0; j < matrix[i].length; ++j) {
        const removeColumnsButton = document.createElement('button');
        removeColumnsButton.innerText = '-';
        removeColumnsButton.setAttributeNS(null, 'onclick', `removeColumn(model.A, ${j})`);
        const removeButtonRowTd = document.createElement('td');
        removeButtonRowTd.appendChild(removeColumnsButton);
        removeButtonRow.appendChild(removeButtonRowTd);

        const addRowButton = document.createElement('button');
        addRowButton.innerText = '+';
        addRowButton.setAttributeNS(null, 'onclick', `addColumn(model.A, ${j})`);
        const addButtonRowTd = document.createElement('td');
        addButtonRowTd.appendChild(addRowButton);
        addButtonRow.appendChild(addButtonRowTd);
      }
      table.appendChild(removeButtonRow);
      table.appendChild(addButtonRow);
    }
  }
  parent.innerHTML = '';
  parent.appendChild(table);
}

function addColumn(matrixObservable, index) {
  const A = matrixObservable.get();
  matrixObservable.next(A.map(r =>
    [...r.slice(0, index + 1), 0, ...r.slice(index + 1)]
  ));
}

function addRow(matrixObservable, index) {
  const A = matrixObservable.get();
  A.splice(index + 1, 0, Array.from({ length: A[0].length }, _ => 0));
  matrixObservable.next(A);
}

function removeColumn(matrixObservable, index) {
  const A = matrixObservable.get();
  matrixObservable.next(A.map(c => c.filter((r, i) => i !== index)));
}

function removeRow(matrixObservable, index) {
  const A = matrixObservable.get();
  matrixObservable.next(A.filter((r, i) => i !== index));
}

function updateA(event, matrixObservable, i, j) {
  const A = matrixObservable.get();
  A[i][j] = parseInt(event.target.value, 10);
  matrixObservable.next(A);
}

function main() {
  const aElement = document.getElementsByClassName('A')[0];
  const uElement = document.getElementsByClassName('U')[0];
  const sElement = document.getElementsByClassName('S')[0];
  const vElement = document.getElementsByClassName('V')[0];
  model.A.subscribe(A => {
    createMatrix(model.A.get(), aElement, true);
    const { U, S, V } = numeric.svd(A);
    createMatrix(U, uElement, false);
    // Convert S to column vector
    createMatrix(Array.from({ length: S.length }, (_, i) => [S[i]]), sElement, false);
    createMatrix(V, vElement, false);
  });
  model.A.next(model.A.get());
}

window.onload = main;
