function multipllyArrayValues(numbers: number[]): number[]{
    return numbers.map(x => x * 2)
}

function onlyPositiveArray(numbers: number[]): number[]{
    return numbers.filter(x => x > 0)
}



console.log(multipllyArrayValues([1, 2, 3, 4, 5]))
console.log(onlyPositiveArray([1, -3, -5, 2, 3, -9, 4, 5, -1]))
