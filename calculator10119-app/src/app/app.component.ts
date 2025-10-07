import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  display:string="0";
  currentValue:string="";
  prevValue:string="";
  operator:string="";
  prevNumber:number=0;
  currentNumber:number=0;
  result:number=0;
  resultValue:string="";


  append(value:string):void{

    if(this.isOperator(value)){ //もしvalueがoperatorだった場合
      if(this.currentValue===''){ //現在の値がない場合
        if(this.prevValue!==''&&this.operator!==''){
          this.operator=value;
        }
        return; //なにもしない
      }

      if(this.prevValue!==''&&this.operator===''){
        this.operator=value;
        return;
      }
      if(this.resultValue!==''){
        this.currentValue='';
        this.resultValue='';
      }

      if(this.prevValue!==''&&this.operator!==''){
        this.prevNumber=Number(this.prevValue);
        this.currentNumber=Number(this.currentValue);
        switch(this.operator){
          case '+':
            this.result=this.prevNumber+this.currentNumber;
            this.prevValue=String(this.result);
            this.operator=value;
            break;
          case '-':
            this.result=this.prevNumber-this.currentNumber;
            this.prevValue=String(this.result);
            this.operator=value;
            break;
          case '*':
            this.result=this.prevNumber*this.currentNumber;
            this.prevValue=String(this.result);
            this.operator=value;
            break;
          case '/':
            if(this.currentNumber===0){
              this.display='0で割ることはできません';
              return;
            }
            this.result=this.prevNumber/this.currentNumber;
            this.prevValue=String(this.result);
            this.operator=value;
            break;
        }       
      }else{
        this.prevValue=this.currentValue; //prevValueに左辺を突っ込む
        this.operator=value; //operatorに演算子を入れる
      }

      if(this.prevValue.includes('-')){
        if(this.prevValue.includes('.')){
          const i=this.prevValue.indexOf('.');
          const pv=Number(this.prevValue);
          this.prevValue=String(pv.toFixed(10-i).replace(/\.?0+$/,''));
        }
        if(this.prevValue.length>11){
          this.prevValue=this.prevValue.slice(0,11);
          this.display='E '+this.prevValue;
        }else{
        this.display=this.prevValue;
        this.currentValue=""; //現在の値を空にする
        }
      }else{
        if(this.prevValue.includes('.')){
          const i=this.prevValue.indexOf('.');
          const pv=Number(this.prevValue);
          this.prevValue=String(pv.toFixed(9-i).replace(/\.?0+$/,''));
        }
        if(this.prevValue.length>10){
          this.prevValue=this.prevValue.slice(0,10);
          this.display='E '+this.prevValue;
        }else{
          this.display=this.prevValue;
          this.currentValue=""; //現在の値を空にする
        }
      }
    }
    
    if(value==='.'){ //もしvalueが小数点だった場合
      if(this.currentValue.includes('.')){ //最後の値に小数点が含まれていた場合
        return; //なにもしない
      }
      if(this.currentValue===''){ //現在の値がない場合
        this.currentValue='0'; //現在の値を0.に変更
        this.display='0';
      }
       //他の場合
      this.currentValue+='.'; //valueを現在の値に追加
      this.display+='.';
    }
    
    if(value==='+/-'){ //もしvalueが+/-だった場合
      if(this.currentValue===''){ //現在の値がないかoperatorだった場合
        return; //なにもしない
      }
       //他の場合
      let toggleNumber=Number(this.currentValue); //lastValueを数値に変換
      toggleNumber*= -1; //toggleNumberを-1倍
      this.resultValue=String(toggleNumber); //toggleNumberを文字列に変換
      this.currentValue=this.resultValue;
      this.display=this.resultValue;
      this.resultValue="";
    }
    
    if(value==='%'){ //もしvalueが%だった場合 
      if(this.prevValue===''||this.operator===''){
        return; //左辺がなく、演算子もない場合、なにもしない。
      }
      
        this.prevNumber=Number(this.prevValue); //prevValueを数値に変換
        this.currentNumber=Number(this.currentValue); //currentValueを数値に変換
        switch(this.operator){
          case '+':
            this.result=this.prevNumber+((this.currentNumber/100)*this.prevNumber);
            this.resultValue=String(this.result);
            break;
          case '-':
            this.result=this.prevNumber-((this.currentNumber/100)*this.prevNumber);
            this.resultValue=String(this.result);
            break;
          case '*':
            this.result=this.prevNumber*this.currentNumber/100;
            this.resultValue=String(this.result);
            break;
          case '/':
            if(this.currentNumber===0){
              this.display='0で割ることはできません';
              return;
            }
            this.result=this.prevNumber/this.currentNumber/100;
            this.resultValue=String(this.result);
            break;
        }
        
        if(this.resultValue.includes('-')){
          if(this.resultValue.includes('.')){
            const i=this.resultValue.indexOf('.');
            this.resultValue=String(this.result.toFixed(10-i).replace(/\.?0+$/,''));
          }
          if(this.resultValue.length>11){
            this.resultValue=this.resultValue.slice(0,11);
            this.currentValue=this.resultValue;
            this.display='E '+this.resultValue;
            this.resultValue="";
          }else{
            this.display=this.resultValue;
            this.currentValue=this.resultValue;
            this.resultValue="";
          }
        }else{
          if(this.resultValue.includes('.')){
            const i=this.resultValue.indexOf('.');
            this.resultValue=String(this.result.toFixed(9-i).replace(/\.?0+$/,''));
          }
          if(this.resultValue.length>10){
            this.resultValue=this.resultValue.slice(0,10);
            this.currentValue=this.resultValue;
            this.display='E '+this.resultValue;
            this.resultValue="";
          }else{
            this.display=this.resultValue;
            this.currentValue=this.resultValue;
            this.resultValue="";
          }
        }
      
    }

    if(value==='√'){
      if(this.resultValue!==''){
        this.currentValue=this.resultValue;
      }
      if(this.currentValue===''&&this.display!==''){
        this.currentValue=this.display;
    }
      this.currentNumber=Number(this.currentValue);

      if(this.currentValue.includes('-')){
        this.display='E 0';
        this.currentValue='';
        return;
      }
      
      this.result=Math.sqrt(this.currentNumber)//平方根を計算。例外は、数字が打たれていない時、
      this.resultValue=String(this.result);

      if(this.resultValue.includes('.')){
        const i=this.resultValue.indexOf('.');
        this.resultValue=String(this.result.toFixed(9-i).replace(/\.?0+$/,''));
      }
      if(this.resultValue.length>10){
        this.display=this.resultValue.slice(0,10);
        this.currentValue=this.resultValue;
        this.resultValue="";
      }else{
        this.display=this.resultValue;
        this.currentValue=this.resultValue;
        this.resultValue="";
      }
    }

    if(value==='='){
      if(this.prevValue===''){
        return;
      }
      this.prevNumber=Number(this.prevValue);
      this.currentNumber=Number(this.currentValue);
        switch(this.operator){
        case '+':
          this.result=this.prevNumber+this.currentNumber;
          this.resultValue=String(this.result);
          break;
        case '-':
          this.result=this.prevNumber-this.currentNumber;
          this.resultValue=String(this.result);
          break;
        case '*':
          this.result=this.prevNumber*this.currentNumber;
          this.resultValue=String(this.result);
          break;
        case '/':
          if(this.currentNumber===0){
            this.display='0で割ることはできません';
            return;
          }
          
          this.result=this.prevNumber/this.currentNumber;
          this.resultValue=String(this.result);
          break;
      }      
      

      if(this.resultValue.includes('-')){
        if(this.resultValue.includes('.')){
          const i=this.resultValue.indexOf('.');
          this.resultValue=String(this.result.toFixed(10-i).replace(/\.?0+$/,''));
        }
        if(this.resultValue.length>11){
          this.resultValue=this.resultValue.slice(0,11);
          this.display='E '+this.resultValue;
          this.prevValue=this.resultValue;
        }else{
          this.display=this.resultValue;
          this.prevValue=this.resultValue;
        }
      }else{
        if(this.resultValue.includes('.')){
          const i=this.resultValue.indexOf('.');
          this.resultValue=String(this.result.toFixed(9-i).replace(/\.?0+$/,''));
        }
        if(this.resultValue.length>10){
          this.resultValue=this.resultValue.slice(0,10);
          this.display='E '+this.resultValue;
          this.prevValue=this.resultValue;
        }else{
          this.display=this.resultValue;
          this.prevValue=this.resultValue;
        }
      }
    } 
    
    
    if(this.isNumber(value)){ //もしvalueが数値だった場合
      if(this.resultValue!==''){
        this.currentValue='';
        this.prevValue='';
        this.resultValue='';
        this.operator='';
      }
      if(this.currentValue==='0'){
        this.currentValue='';
      }
      if(this.currentValue.length<10){
        this.currentValue+=value;
        this.display=this.currentValue;
      }

    }
    
  }
   


  allclear(value:string){
    this.prevValue='';
    this.operator='';
    this.prevNumber=0;
    this.currentNumber=0;
    this.result=0;
    this.currentValue='';
    this.display='0';
  }

  clearentry(value:string){ //直近の数字をキャンセル、表示を０。演算子もキャンセル、この場合は表示上は変化なし。
    this.currentValue='';
    this.display='0';
  }




  isOperator(value:string):boolean{
    return value==='+'||value==='-'||value==='*'||value==='/';
    }
  
  isNumber(value:string):boolean{
    return !isNaN(Number(value));
  }

 }
  


 

