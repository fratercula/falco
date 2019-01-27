import Sa from './components'

new Sa().log()

let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
console.log(x); // 1
console.log(y); // 2
console.log(z); // { a: 3, b: 4 }

function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}

@testable(true)
class MyTestableClass {}

console.log(MyTestableClass.isTestable) // true

;(async () => {
  await console.log(1)
  console.log(2)
})()
