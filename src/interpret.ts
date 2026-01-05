var valuesdict:any = {}; // 변수 저장용 object

function Type(code:string): string {
    console.log("처리 중인 코드:", code);
    if (code.startsWith("#")) {
        return ""; //주석 표시가 있다면 null 리턴
    } else if (code.startsWith(" ")) {
        return Type(code.slice(1));//공백 제거
    } else if (code.endsWith(" ")) {
        return Type(code.trimEnd());//공백 제거
    } else if (code.startsWith("반복 ")) {
        let words = code.slice(3).split(":")
        for (let index = 0; index < parseInt(Type(words[0]) as string); index++) {
            Type(words[1])
        }
    } else if (code.startsWith("만약 ")) {
        let words = code.slice(3).split(":")
        if (c_bool(words[0]) == "진실") {
            return Type(words[1])
        }
    } else if (code.startsWith("출력 ")) {
        const print_text = Type(code.slice(3)) as string;
        if (print_text !== "") {
            print(print_text);
        }
        return "";
    } else if (code.startsWith("질문 ")) {
        const prompt_text = Type(code.slice(3)) as string;
        return Type(prompt(prompt_text) as string);
    } else if (code.startsWith("변수 ")) {
        let t = code.slice(3);
        let first_part = t.split(" ")[0];
        let remaining_part = t.slice(first_part.length + 1);
        if (remaining_part.startsWith("는 ")) { //변수를 선언할 때
            valuesdict[first_part] = Type(remaining_part.slice(2));
            return ""
        }else if (first_part in valuesdict){ //변수를 사용할 때
            return Type(valuesdict[first_part]+Type(remaining_part))
        }else{
            errorprint(first_part+" (이)라는 변수는 선언된 적이 없습니다.");
        }
    }else if (["+", "-", "*", "/"].some(op => code.includes(op))) {
        if (["+", "-", "*", "/"].some(op => code.startsWith(op))) {
            return code[0] + Type(code.slice(1));
        }
        return String(eval(code)); //eval 명령어를 활용한 사칙연산 계산
    } else {
        return code
    }
    return "";
}

function c_bool(boolStr:string):string|undefined {
    if (boolStr.includes("==")) {
        let words = boolStr.split("==");
        if (Type(words[0]) === Type(words[1])) {
            return "진실";
        } else {
            return "거짓";
        }
    } else if (boolStr.includes("!=")) {
        let words = boolStr.split("!=");
        if (Type(words[0]) !== Type(words[1])) {
            return "진실";
        } else {
            return "거짓";
        }
    } else if (boolStr === "진실" || boolStr === "거짓") {
        return boolStr;
    } else {
        errorprint("이해할 수 없는 조건문입니다.");
    }
}

function print(text:string):void { //결과 출력
    const outputDiv = document.getElementById('output') as HTMLDivElement;
    const textNode = document.createElement("p");

    outputDiv.classList.add("alert-primary");
    textNode.textContent = ">>" + text;
    outputDiv.appendChild(textNode);
}

function errorprint(text:string):void { //결과 출력
    const outputDiv = document.getElementById('output') as HTMLDivElement;
    const textNode = document.createElement("p");

    outputDiv.classList.add("alert-danger"); //경고라고 명시
    textNode.textContent = ">>" + text;
    outputDiv.appendChild(textNode);
}

function reset_valuesdict():void { //변수 초기화
    valuesdict = {};
}

export { Type, reset_valuesdict}; //Type 함수를 외부에서 사용할 수 있도록 export