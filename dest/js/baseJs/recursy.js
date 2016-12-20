console.log('1');

function pow(x, n) {
    if (n != 1){ // пока n != 1, сводить вычисление pow(x,n) к pow(x,n-1)
        return x * pow(x, n-1);
    } else {
        return x;
    }
}
//Значение, на котором рекурсия заканчивается называют базисом рекурсии. В примере выше базисом является 1.
console.log(pow(2, 3));