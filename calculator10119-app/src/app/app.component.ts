import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  display:string="0"; //画面に表示するため
  subdisplay:string="";

  currentValue:string=""; //右辺
  prevValue:string=""; //左辺
  operator:string=""; //演算子
  lastValue:string=""; //最後に入力された数字
  lastResult:string=""; //計算結果を一時的に保存するための変数
  lastOperator:string=""; //最後に入力した演算子
  perCurrentValue:string=""; //％処理時に使用する右辺
  perCurStorage:string=""; //％処理時に右辺を保存しておく容器

  justCalc:boolean=false; //「＝」直後かどうかを判断するため。
  justPerCalc:boolean=false; //最後に%が押されたかどうかを判断するため。
  justOpe:boolean=false; //最後に演算子が押されたかどうかを判断するため。
  justSqrt:boolean=false; //最後に√が押されたかどうかを判断するため。
  justCE:boolean=false; //最後にCEが押されたかどうかを判断するため。
  justEqAndCE:boolean=false; //最後に=とCEが押されたかどうかを判断するため。
  justDecimalPoint:boolean=false; //小数点入力直後かどうかを判断するため。
  justNumber:boolean=false; //数値入力直後かどうかを判断するため。
  justClear:boolean=true; //全クリア直後かどうかを判断するため。


  append(value:string):void{

    if(this.subdisplay.includes('E')){ //もしsubdisplayにEが含まれていた場合、appendでは何もできない。エラー後になにもできないように。
      return;
    }

    if(this.isOperator(value)){ //もしvalueがoperatorだった場合
      
      if(this.justPerCalc){ //％直後の場合、currentをクリア。
        this.currentValue='';
      }
      if(this.currentValue===''){ //現在の値がない場合。「＝」と「CE」でcurrentValueを消しているため、やり直した計算ができるように。
        if(this.prevValue!==''){ //prevValueとoperatorがある場合、operatorをvalueに変更
          this.operator=value;
        }else{
          this.prevValue='0';
          this.operator=value;
        }
        this.justOpe=true;
        this.justCalc=false; //num1*num2=*num3=の時、num3前の演算子入力で、関数から抜ける前に、justCalcをfalseにする。
        this.justPerCalc=false;
        this.justSqrt=false;
        this.justCE=false;
        this.justEqAndCE=false;
        this.justDecimalPoint=false;
        this.justNumber=false;
        this.justClear=false;
        return; //なにもしない
      }

      if(this.prevValue!==''&&this.operator===''){ //prevValueがあって、operatorがない場合、operatorをvalueに変更。
        this.operator=value;
        this.justOpe=true;
        this.justCalc=false; 
        this.justPerCalc=false;
        this.justSqrt=false;
        this.justCE=false;
        this.justEqAndCE=false;
        this.justDecimalPoint=false;
        this.justNumber=false;
        this.justClear=false;
        return;
      }


      if(this.prevValue!==''&&this.operator!==''){ //1+2の状態で演算子を入力したら。

        this.lastResult=this.prevValue; //元の左辺を一時的に保存（計算前に左辺を逃がして置けば結果が上塗りされない）
        this.lastOperator=this.operator; //最後に入力した演算子を保存

        let calcResult='';
        calcResult=this.calculate(this.prevValue,this.currentValue,this.operator);
        if(calcResult==='0で割ることはできません'){
          this.display='0';
          this.subdisplay='E'; //左にEを表示
          return;
        }
        this.prevValue=calcResult; //計算結果をprevValueに入れ、
        this.operator=value;     //入力された演算子をoperatorに入れる。→3+の状態になる。
      }else{ 
        this.prevValue=this.currentValue; //prevValueに入力した値を突っ込む
        this.operator=value; //operatorに演算子を入れる
        
      }

      this.prevValue=this.formatResult(this.prevValue); //計算結果の桁数制限を行う関数
      this.display=this.prevValue; //計算結果または演算子の前に入力した数字を表示。
      this.lastValue=this.currentValue; //最後の入力値を保存しておく。再利用するときは現状右辺としか使わない
      this.currentValue=''; //次の数字入力用に空にする。

      this.justOpe=true; //最後に演算子が押された判断。
      this.justPerCalc=false; //最後に演算子が押されたため戻す。
      this.justCalc=false; //最後に演算子が押されたため戻す。
      this.justSqrt=false; //最後に演算子が押されたため戻す。
      this.justCE=false; //最後に演算子が押されたため戻す。
      this.justEqAndCE=false;
      this.justDecimalPoint=false;
      this.justNumber=false;
      this.justClear=false;

    } //演算子入力処理ここまで。計算結果は左辺に入っている。
    

    if(value==='.'){ //もしvalueが小数点だった場合
      if(this.justCalc||this.justPerCalc||this.justSqrt||this.justClear){//=直後の場合、クリア
        this.currentValue='';
        this.prevValue='';
        this.operator='';
      }

      if(this.currentValue.includes('.')){ //最後の値に小数点が含まれていた場合
        return; //なにもしない。
      }

      if(this.currentValue===''){ //現在の値がない場合。
        this.currentValue='0'; //現在の値を0.に変更
        this.display='0';
      }

      this.currentValue+='.'; //valueを現在の値に追加。現状「＝」直後の数字に小数点をいれると、最後に入力した値にプラスされる。
      this.display+='.';

      this.justOpe=false; //最後に小数点が押されたため戻す。
      this.justPerCalc=false; //最後に小数点が押されたため戻す。???
      this.justCalc=false; //最後に小数点が押されたため戻す。
      this.justSqrt=false; //最後に小数点が押されたため戻す。
      this.justEqAndCE=false;
      this.justDecimalPoint=true;
      this.justNumber=false;
      this.justClear=false;
    } //小数点入力処理ここまで

    
    if(value==='+/-'){ //もしvalueが+/-だった場合。常に現在の表示を反転させる。
      if(this.currentValue===''&&this.prevValue===''){ //数値がまっさらなら
        this.currentValue='0';
      }
      if(this.justPerCalc){
        this.currentValue=''; //％直後であれば、currentをクリア。％後にcurrentを消せないため。
      }
      
      if(this.currentValue!==''){ //currentに値があれば、currentを反転させる。
        this.currentValue=this.toggle(this.currentValue); //関数呼び出し
        this.display=this.currentValue;
      }else if(this.currentValue===''&&this.prevValue!==''){ //prevに値があれば、prevを反転させる。
        this.prevValue=this.toggle(this.prevValue); //関数呼び出し
        this.display=this.prevValue;
      }

      this.justPerCalc=false; //最後に+/-が押されたため戻す。???
      
    }//+/-処理ここまで

    
    if(value==='%'){ //もしvalueが%だった場合 

      if(this.justPerCalc){//最後に%が押された場合
        if(this.justSqrt){ //%√後、falseにする。
          if(this.operator==='/'){
            this.justPerCalc=false;
          }else{
            this.justPerCalc=false;
            this.currentValue=this.prevValue; //計算結果を右辺とする。
            this.prevValue=this.lastResult; //元の左辺代入。
          }
        }else
        if(this.operator==='+'||this.operator==='-'){ //+/-直後の場合、なにもしない。
          return;
        }else if(this.operator==='*'){
          this.currentValue=this.lastResult;
        }else if(this.operator==='/'){
          this.perCurStorage=this.currentValue; //currentを保存するため逃がす。
          let perCurNumber=Number(this.perCurrentValue); //
          let currentNumber=Number(this.currentValue); //currentを数値に変換
          this.prevValue=this.lastResult; //元の左辺代入。
          this.currentValue=String(currentNumber*perCurNumber); 
          this.currentValue=this.formatResult(this.currentValue);
        }
      }else if(this.justCalc){ //＝直後の場合、lastResultを右辺に入れる。
        if(this.operator==='+'||this.operator==='-'){ //+/-直後の場合、なにもしない。
          return;
        }
        this.currentValue=this.lastResult;
      }else{
        this.lastResult=this.prevValue; //％直後でも＝直後でもない場合、左辺をlastResultに保存。
      }

      if(this.justCE){
        this.operator=this.lastOperator; //演算子numCEnumで％が反応しなかったので、演算子を復活させる。
      }
      if(this.prevValue===''||this.operator===''){
        return; //左辺がない、または演算子もない場合、なにもしない。
      }

      this.lastValue=this.prevValue; //%num=用。
      let percentResult='';
      percentResult=this.percentCalculate(this.prevValue,this.currentValue,this.operator); //計算結果を取得
      if(percentResult==='0で割ることはできません'){
        this.display='0';
        this.subdisplay='E'; //左にEを表示
        return;
      }
      
      if(this.justPerCalc&&this.operator==='/'){
        this.currentValue=this.perCurStorage; //currentを元に戻す。(連続％処理用なので、ほかではほぼいみなし。)
      }
     
      this.prevValue=percentResult; //計算結果を右辺に入れる→左辺に変更
      
      this.prevValue=this.formatResult(this.prevValue); //currentValueに最終的な結果入れる
      this.display=this.prevValue;

      this.lastOperator=this.operator; //最後に入力した演算子を保存

      this.justOpe=false; //最後に%が押されたため戻す。
      this.justPerCalc=true; //最後に%が押されたという判断。
      this.justCalc=false; //最後に%が押されたため戻す。
      this.justSqrt=false; //最後に%が押されたため戻す。
      this.justCE=false; //最後に%が押されたため戻す。
      this.justEqAndCE=false;
      this.justDecimalPoint=false;
      this.justNumber=false;
      this.justClear=false;
    }//%処理ここまで　結果を左辺に入れてみた、明日要確認


    if(value==='√'){ //現在表示されているものを処理する。

      if(this.justPerCalc){
        this.prevValue=this.sqrtCalculate(this.prevValue);
        if(this.prevValue===''){
          this.display='0';
          this.subdisplay='E'; //左にEを表示
          return;
        }
        this.display=this.formatDisplay(this.prevValue); //これやっとかないと表示がおかしくなるぞ.リターンしてるから
       

        this.justOpe=false; //最後に√が押されたため戻す。
        this.justPerCalc=true; //%√後は%後の処理と一緒にする。
        this.justCalc=false; //最後に√が押されたため戻す。
        this.justSqrt=true; //最後に√が押されたという判断。
        this.justDecimalPoint=false;
        this.justNumber=false;
        this.justClear=false;
        return;
      }

      if(this.currentValue!==''){ //表示がcurrentValueの場合
        this.lastValue=this.currentValue; //最後の入力値を保存
        this.currentValue=this.sqrtCalculate(this.currentValue);
        if(this.currentValue===''){
          this.display='0';
          this.subdisplay='E'; //左にEを表示
          return;
        }
        this.display=this.currentValue;
      }

      
      if(this.currentValue===''&&this.prevValue!==''){ //計算後でcurrentValueがないとき、現在表示されているもの（prevValue）を計算。
        this.lastResult=this.prevValue; //元の左辺を一時的に保存（計算前に左辺を逃がして置けば結果が上塗りされない）
        this.prevValue=this.sqrtCalculate(this.prevValue);
        if(this.prevValue===''){
          this.display='0';
          this.subdisplay='E'; //左にEを表示
          return;
        }
        if(this.justOpe){
          this.currentValue=this.prevValue;
          this.prevValue=this.lastResult;
          this.display=this.currentValue;
        }else{
          this.display=this.prevValue;
        }
        
     }
     
    
     this.justOpe=false; //最後に√が押されたため戻す。
      this.justPerCalc=false; //最後に√が押されたため戻す。???
      this.justCalc=false; //最後に√が押されたため戻す。
      this.justSqrt=true; //最後に√が押されたという判断。
      this.justCE=false; //最後に√が押されたため戻す。
      this.justEqAndCE=false;
      this.justDecimalPoint=false;
      this.justNumber=false;
      this.justClear=false;
    } //√処理ここまで。


    if(value==='='){

      if(this.prevValue===''&&this.currentValue===''){ //左辺も右辺もない場合、「＝」が成り立たないのでなにもしない。
        return;
      }
      if(this.prevValue===''&&(this.justDecimalPoint||Number(this.currentValue)===0)&&this.operator===''){
        this.currentValue=String(parseFloat(this.currentValue));
        
        this.justDecimalPoint=false;
        this.justNumber=false;
        this.justCalc=true;

        this.display=this.formatDisplay(this.currentValue);
        return;
      }

      if(this.justPerCalc&&this.operator!=='/'){
        this.currentValue=this.lastResult;
      }

      if(this.operator===''){ //=num=時
        if(this.justCE&&!this.justEqAndCE){ //演算途中のCE後（1+2*3CE5=）
          this.operator=this.lastOperator;
        }else if(this.justNumber){
        this.operator=this.lastOperator;
          this.prevValue=this.currentValue;
          this.currentValue=this.lastValue;
        }else if(this.justSqrt){
          this.operator=this.lastOperator;
        }else{
          this.operator=this.lastOperator;
          this.currentValue=this.lastValue;
        }
        
      }

      if(this.currentValue===''){ //演算子入力後に「＝」を押した場合→これもフラグにするか？
        if(this.justCalc){
        this.currentValue=this.lastValue; //最後に入力した値を右辺とする
        }else{
          if(this.operator==='*'){
          this.currentValue=this.prevValue; //演算子＝、5+=で演算子処理の結果同士で計算させる。
          }else if(this.operator==='/'){
            this.currentValue=this.prevValue;
            this.prevValue='1';
          }else{
            if(this.lastResult===''){
            this.currentValue=this.prevValue;
            this.prevValue='0';
            }else if(this.justOpe&&this.lastOperator==='*'){
              this.currentValue=this.prevValue; //演算子後,下の処理(3*6+=)でバグるため
              this.prevValue=this.lastResult;
            }else if(this.lastOperator==='/'&&this.justOpe){
              this.currentValue=this.prevValue;
              this.prevValue=this.lastValue; //明日再検討 //このままで良ければこの部分削除でOK
            }else if(this.operator==='-'&&this.justOpe){
              let lastNumber=Number(this.lastResult); //最後がーの時、元の左辺を反転表示。
              this.lastResult=String(lastNumber*(-1));
              this.lastValue=this.prevValue; //演算子計算結果を保存。(次右辺として再使用)
              this.prevValue=this.lastResult; //反転した値を左辺に。
              this.display=this.formatDisplay(this.prevValue); //これやっとかないと表示がおかしくなるぞ

              this.justOpe=false; //最後に-が押されたため戻す。
              this.justPerCalc=false; //最後に-が押されたため戻す。???
              this.justCalc=true; //最後に-が押されたため戻す。
              this.justSqrt=false; //最後に-が押されたため戻す。
              this.justCE=false; //最後に-が押されたため戻す。
              this.justEqAndCE=false;
              this.justDecimalPoint=false;
              this.justNumber=false;
              this.justClear=false;
              return; //脱出
            }else{
              this.currentValue=this.lastValue;
            }
          }
        }
      }

          

      this.lastResult=this.prevValue; //元の左辺を一時的に保存（計算前に左辺を逃がして置けば結果が上塗りされない）

      let calcResult='';
      calcResult=this.calculate(this.prevValue,this.currentValue,this.operator);
      if(calcResult==='0で割ることはできません'){
        this.display='0';
        this.subdisplay='E'; //左にEを表示
        return;
      }else if(calcResult===''){ //計算結果が出ない場合、表示はそのまま。
        this.justOpe=false; //最後に=が押されたため戻す。
        this.justPerCalc=false; //最後に=が押されたため戻す。???
        this.justCalc=true; //「＝」直後かどうかを判断するため。
        this.justSqrt=false; //最後に=が押されたため戻す。
        this.justCE=false; //最後に=が押されたため戻す。
        this.justDecimalPoint=false;
        this.justNumber=false;
        this.justClear=true;
        return;
      }
      
      calcResult=this.formatResult(calcResult);//計算結果の桁数制限を行う関数
      this.display=calcResult;
      this.prevValue=calcResult;  //結果は左辺に入っている。
      this.lastValue=this.currentValue; //最後に入力した値を保存 10/14 1/2=+=の検証中に変更
      this.lastOperator=this.operator; //最後に入力した演算子を保存
      this.currentValue=''; //currentValueを空にした方が良いか？

      this.justOpe=false; //最後に=が押されたため戻す。
      this.justPerCalc=false; //最後に=が押されたため戻す。???
      this.justCalc=true; //「＝」直後かどうかを判断するため。
      this.justSqrt=false; //最後に=が押されたため戻す。
      this.justCE=false; //最後に=が押されたため戻す。
      this.justDecimalPoint=false;
      this.justNumber=false;
      this.justClear=false;
    } //=処理ここまで。計算結果は左辺に入っている。
    
    
    if(this.isNumber(value)){ //もしvalueが数値だった場合
      if(this.justCalc||this.justPerCalc||this.justSqrt||this.justClear){ //＝直後または%直後の場合、全クリア
        this.currentValue='';
        this.prevValue='';
        this.operator='';
      }
      if(this.currentValue==='0'){ //現在の値が0の場合、0を消す
        this.currentValue='';
      }
      if(this.currentValue==='-0'){
        this.currentValue='-';
      }

      let isNegative=false;
      if(Number(this.currentValue)<=0&&this.currentValue.includes('-')){//指数表記で数値を入力することはないはず。
        this.currentValue=this.currentValue.slice(1); //「ー」を一旦消す。
        isNegative=true;
      }
      
      if(this.currentValue.includes('.')){ //小数点がある場合
        let i=this.currentValue.indexOf('.');
        if(i===1){ //整数部が一桁の場合、<11にすると、小数点以下第9位までいくので、10にする。
          if(this.currentValue.length<10){ //現在の値の長さが10未満の場合、現在の値にvalueを追加
            this.currentValue+=value;
          }
        }else{
          if(this.currentValue.length<11){ //現在の値の長さが11未満の場合、現在の値にvalueを追加
            this.currentValue+=value;
          }
        }
      }else{
        if(this.currentValue.length<10){ //現在の値の長さが10未満の場合、現在の値にvalueを追加
          this.currentValue+=value;
        }
      }
      if(isNegative){
        this.currentValue='-'+this.currentValue;
      }

      this.display=this.currentValue;

      this.justOpe=false; //最後に数字が押されたため戻す。
      this.justPerCalc=false; //最後に数字が押されたため戻す。???
      this.justCalc=false; //数字が押されたため戻す。
      this.justSqrt=false; //最後に数字が押されたため戻す。
      this.justDecimalPoint=false;
      this.justNumber=true;
      this.justClear=false;

    } //数値処理ここまで

    if(this.display===''){
      this.display='0';
    }
    this.display=this.formatDisplay(this.display); //表示を3桁ごとにアポストロフィいれたる
    
    
  }//append関数ここまで
   

  allclear(value:string){ //全クリア
    this.prevValue='';
    this.operator='';
    this.currentValue='';
    this.display='0';
    this.subdisplay='';
    this.lastValue='';
    this.lastResult='';
    this.lastOperator='';
    this.perCurrentValue='';
    this.perCurStorage='';
    this.justCalc=false;
    this.justPerCalc=false;
    this.justOpe=false;
    this.justSqrt=false;
    this.justCE=false;
    this.justEqAndCE=false;
    this.justDecimalPoint=false;
    this.justNumber=false;
    this.justClear=true; 
  }

  clearentry(value:string){ //直近の数字をキャンセル、表示を０。
    if(this.subdisplay==='E'&&this.display!=='0'){ //桁数制限によるEの場合、計算を利用できるようにする。
      this.subdisplay='';
      this.prevValue=this.display.replace(/'/g,'');
      this.currentValue='';
      this.operator='';
      this.justNumber=false;
      return;
    }
    if(this.justSqrt){
      this.prevValue='';
      this.lastValue='';
      this.lastResult='';
    }

    if(this.justOpe){
      this.currentValue='';
      this.justCE=true;
      this.justNumber=false;
      return;
    }
    this.currentValue='0';
    this.lastOperator=this.operator;
    this.operator='';

    if(this.justCalc){
      this.justEqAndCE=true;
    }else if(this.justPerCalc){
      this.justCE=true;
    }else{
      this.display='0';
    }

    this.justCE=true;
    this.justNumber=false;
  }


//append関数の補助関数

  isOperator(value:string):boolean{ //演算子かどうかを判断する関数
    return value==='+'||value==='-'||value==='*'||value==='/';
    }
  
  isNumber(value:string):boolean{ //数値かどうかを判断する関数
    return !isNaN(Number(value));
  }

  formatDisplay(value:string):string{ //表示を3桁ごとにカンマを入れる関数
    
    if(value.includes('e')){ //指数表記の際に、小数点以下の桁数を調整する。
      value=this.formatExp(value);
    }

    const [integer,decimal] = value.split('.');
    const formatInt=integer.replace(/\B(?=(\d{3})+(?!\d))/g,'\'');
    if(this.justDecimalPoint){ //小数点入力直後の場合、小数点を表示。
      return decimal ? `${formatInt}.${decimal}` : `${formatInt}.`;
    }else{
      return decimal ? `${formatInt}.${decimal}` : formatInt;
    }
  }

  formatResult(value:string):string{ //計算結果の桁数制限を行う関数
    let rv=value;

    let isNegative=false;
    if(Number(rv)<0){ //負の場合、「ー」を一旦消す。
      isNegative=true;
      rv=rv.slice(1);
    }

    let r=Number(rv);

    if(rv.includes('e')){
      rv=this.formatExp(rv);
    }

    if(rv.includes('.')){ //小数の場合
      const i=rv.indexOf('.');
      if(i>9){ //整数部分10桁以上の場合。合計12個以上
        r=Math.round(r)
        rv=String(r);
        //合計10個になり、小数点消える。
      }else if(i===1){
        const tenExp=Math.pow(10,8);
        r=Math.round((r+Number.EPSILON)*tenExp)/tenExp; //整数に直してから四捨五入して、小数に戻す。
        rv=String(r);
        //整数部が一桁の時、小数点以下8位までとなるように。
      }else{ //整数部分9桁以内の場合。最大合計11個
        const tenExp=Math.pow(10,10-i);
        r=Math.round((r+Number.EPSILON)*tenExp)/tenExp; //整数に直してから四捨五入して、小数に戻す。
        rv=String(r);
       //999999999.9、999999999.1。小数点以下9位まで計算。
      }
      if(rv.includes('.')){ //まだ小数点が残っている場合のみ、無駄な0を削除。
        rv=rv.replace(/\.?0+$/,''); //四捨五入処理したものを、指数回避＆整形
      }
    } //ここまでで、小数点の処理が終わって、整数部分が10桁以内の場合の処理が終わっている。

    if(rv.length>10&&!rv.includes('.')){ //整数部分が11桁以上の場合
      this.subdisplay='E'; //左にEを表示
      const i=rv.length;
      const integer=rv.slice(0,i-10); //桁数超えた分を切り取る。
      const decimal=rv.slice(i-10); //超えてない部分を切り取る。
      rv=integer+'.'+decimal;
      if(integer.length===1){
        rv=rv.slice(0,10); //整数部が1桁の場合、小数点込みで10文字となるように。
      }else{
        rv=rv.slice(0,11); //整数部が2桁以上の場合、小数点込みで11文字となるように。
      }
    }

    if(isNegative){
      rv='-'+rv;
    }

    if(rv==='-0'){
      rv='0';
    }
    return rv;
  }


  calculate(prev:string,current:string,operator:string):string{ //基本の四則演算を行う関数
    const prevNumber=Number(prev);
    const currentNumber=Number(current);
    let result='';
    switch(operator){
      case '+':
        result=String(prevNumber+currentNumber);
        break;
      case '-':
        result=String(prevNumber-currentNumber);
        break;
      case '*':
        result=String(prevNumber*currentNumber);
        break;
      case '/':
        if(currentNumber===0){
          return '0で割ることはできません';
        }
        result=String(prevNumber/currentNumber);
        break;
    }
    return result;
  }

  toggle(value:string):string{ //+/-を押した時に、現在の値を反転させる関数
    let toggleValue=value;
    if(Number(toggleValue)<0){ //includes('-')だと、指数表記でバグる。
      toggleValue=toggleValue.slice(1);
    }else if(Number(toggleValue)===0&&toggleValue.includes('-')){
      toggleValue=toggleValue.slice(1);
    }else{
      toggleValue='-'+toggleValue;
    }
    return toggleValue; 
  }

  percentCalculate(prev:string,current:string,operator:string):string{ //
    const prevNumber=Number(prev); //prevValueを数値に変換
    const currentNumber=Number(current); //currentValueを数値に変換
    let result='';
    let resultNumber=0;
        switch(operator){
          case '+':
            resultNumber=prevNumber+((currentNumber/100)*prevNumber);
            result=String(resultNumber);
            break;
          case '-':
            resultNumber=prevNumber-((currentNumber/100)*prevNumber);
            result=String(resultNumber);
            break;
          case '*':
            resultNumber=prevNumber*currentNumber/100;
            result=String(resultNumber);
            break;
          case '/':
            if(currentNumber===0){
              return result='0で割ることはできません';
            }
            resultNumber=prevNumber/(currentNumber/100);
            result=String(resultNumber);
            this.perCurrentValue=String(currentNumber/100); //割り算の時だけ保存。
            break;
        }
      return result;
      }

  sqrtCalculate(value:string):string{ //平方根の計算
    let resultValue:string='';
    let sqrtResult:number=0;
    const valueNumber=Number(value);
   
    if(Number(value)<0){ //負の値を√しようとしたらできないよ
      return value='';
    }

    sqrtResult=Math.sqrt(valueNumber)//平方根を計算。例外は、数字が打たれていない時、
    resultValue=String(sqrtResult);

    resultValue=this.formatResult(resultValue);
   
      return resultValue;
    }

  formatExp(value:string):string{ //指数表記を無理やり展開する関数
    let isNegative=false;
    if(value.startsWith('-')){
      value=value.slice(1);
      isNegative=true;
    }

    let [base,exponent] = value.split('e'); //eを基準に二つに分ける（2e-8→2, -8）
    const expNumber=Number(exponent); //指数部を数値に変換（-8）

    const [int, dec='']=base.split('.'); //数字の部分を小数点を基準に分ける（2→2,''）
    const digits=int+dec; //つまり小数点を抜く作業。
    
    if(expNumber<0){ //指数部が負の場合（小数）
      const addZero=Math.abs(expNumber)-int.length; //0を追加する数を計算。
      const zeros=addZero>0?'0'.repeat(addZero):'';
      value='0.'+zeros+digits; //必要な数だけ0を追加して、整理。
    }else{ //指数部が正の場合、整数部に0を追加する。
      const addZero=expNumber-dec.length;
      const zeros=addZero>0?'0'.repeat(addZero):'';
      value=digits+zeros;
    }
    if(isNegative){
      value='-'+value;
    }
  return value;
  }

 }
  


 

