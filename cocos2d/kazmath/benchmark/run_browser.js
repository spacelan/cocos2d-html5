var echo = document.getElementById('echo');

function printResult(str) {
  console.log(str);
  echo.innerHTML += str + '<br>';
}

function printError(str) {
  console.log(str);
  echo.innerHTML += str + '<br>';
}

function printScore(str) {
  console.log(str);
  echo.innerHTML += str + '<br>';
}

window.onload = function() {
  console.log('Running benchmarks.');
  benchmarks.runAll({notifyResult: printResult,
                     notifyError:  printError,
                     notifyScore:  printScore}, true);
  console.log('Benchmarks completed.');
}