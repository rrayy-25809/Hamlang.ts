import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

type Value = {st?: string | number}; // 테스트용 타입 선언
var valuesdict:Value = {}; // 변수 저장용 딕셔너리

document.getElementById('fileButton')?.addEventListener('click', () => {    // 파일 버튼 클릭 이벤트
  const fileInput = (document.getElementById('fileInput') as HTMLInputElement); // 파일 입력 요소 가져오기
  // 선택된 파일 가져오기 (여러 파일인 경우 첫 번째 파일만)
  var file = (fileInput.files as FileList)[0];
  if (file) {
      var reader = new FileReader();
      reader.onload = function(){
          var text = reader.result as string; // 파일의 내용을 변수에 저장
          console.log(text); // 파일의 내용을 콘솔에 출력
          (document.getElementById("input") as HTMLTextAreaElement).value = text; //코드 입력창에 파일 내용 넣기
      };
      reader.readAsText(file);
  }
});

document.getElementById('runButton')?.addEventListener('click', () => {    // 실행 버튼 클릭 이벤트
  const input = (document.getElementById('input') as HTMLTextAreaElement).value; // 코드 입력창의 내용 가져오기
  const output = (document.getElementById('output') as HTMLTextAreaElement); // 결과 출력창 가져오기
  output.value = ''; // 결과 출력창 초기화
  var lines = input.split('\n'); // 줄 단위로 분할
  valuesdict = {};
    // 각 줄을 순회하며 처리
    lines.forEach(line => {
        // 이 부분에서 각 줄에 대한 처리를 할 수 있습니다.
    });
});

function print(text:string):void { //결과 출력
    var outputDiv = document.getElementById('output') as HTMLDivElement;
    outputDiv.classList.add("alert-primary");
    outputDiv.textContent += ">>" + text + "\n"; // 줄 바꿈 추가
}

function errorprint(text:string):void { //결과 출력
    var outputDiv = document.getElementById('output') as HTMLDivElement;
    outputDiv.classList.add("alert-danger"); //경고라고 명시
    outputDiv.textContent += ">>"+text + "\n"; // 줄 바꿈 추가
}