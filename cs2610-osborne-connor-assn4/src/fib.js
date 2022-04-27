
document.title = 'Dynamic Fibonacci Sequence in JavaScript';

var div = document.createElement('div');
div.setAttribute('class', 'red fib-container');
document.querySelector('body').appendChild(div);

var para = document.createElement('p');
para.textContent = "Slider for Fibbonacci Sequence ";
div.appendChild(para);

var f = document.createElement('form');
f.setAttribute('id', 'list-of-divs');

var l = document.createElement('label');
l.textContent = 'Fib (0)';
l.setAttribute('id', 'list-label');

var input = document.createElement('input');
input.setAttribute('type','range');
input.setAttribute('min', '0');
input.setAttribute('max', '11');
input.setAttribute('value', '0');
input.setAttribute('oninput', 'listSlider(this)');

f.appendChild(l);
f.appendChild(input);

div.appendChild(f);

var div2 = document.createElement('div');
div2.setAttribute('class', 'fib-container');
div2.setAttribute('id', 'tree-of-divs');
div.appendChild(div2);

var newDiv = document.createElement('div');
newDiv.setAttribute('class', 'fib-item');

var p = document.createElement('p');
p.textContent = 'Fib(0) = 0';
newDiv.appendChild(p);

div2.appendChild(newDiv);

var fib = function(depth){

    //these are my base cases
    if (depth == 0) {
        let a = {
            div: document.createElement('div'),
            val: 0
        }
        p = document.createElement('p');
        a.div.setAttribute('class', 'fib-item');
        p.textContent = `Fib(${depth}) = ${a.val}`;
        a.div.appendChild(p);
        return a;

    }

    if (depth == 1) {
        let b = {
            div: document.createElement('div'),
            val: 1
        }
        p = document.createElement('p');
        b.div.setAttribute('class', 'fib-item');
        p.textContent = `Fib(${depth}) = ${b.val}`;
        b.div.appendChild(p);
        return b;

    }

    let div = document.createElement('div');
    div.setAttribute('class', 'fib-item');
    let left = fib(depth -1);
    left.div.setAttribute('class', 'fib-left fib-item');
    let right = fib(depth -2);
    right.div.setAttribute('class', 'fib-right fib-item');
    pDiv = document.createElement('p');
    pDiv.textContent = `Fib(${depth}) =${left.val + right.val}`;
    div.appendChild(pDiv);
    div.appendChild(left.div);
    div.appendChild(right.div);
    //console.log(div);
    return {
        div: div,
        val: (left.val + right.val)
    }

}


var listSlider = function(me) {
    // Put the slider's value into the <label>
    var label = document.querySelector('#list-label');
    label.textContent = `Fib(${me.value})`;

    var tree = document.querySelector('#tree-of-divs');
    if (tree) {
        tree.remove();
    }

    tree = document.createElement('div');
    tree.setAttribute('id', 'tree-of-divs');
    tree.setAttribute('class', 'fib-container');

    var treeObj = fib(me.value).div;
    tree.appendChild(treeObj);

    var theForm = document.querySelector('#list-of-divs');
    theForm.appendChild(tree);
}