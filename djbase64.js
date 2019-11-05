//charCodeAt charAt  String.fromCharCode
//a）2个字节的情况：将这2个字节的一共16个二进制位，按照上面的规则，转成三组(6,6,4)，最后一组除了前面加两个0以外，后面也要加两个0。
//这样得到一个三位的Base64编码，再在末尾补上一个"="号。

// 比如，“Ma"这个字符串是两个字节，可以转化成三组00010011、00010110、00000100以后，对应Base64值分别为T、W、E，再补上一个”="号，
// 因此"Ma"的Base64编码就是TWE=。

// b）1个字节的情况：将这1个字节的8个二进制位，按照上面的规则转成2组(6,2)，最后一组除了前面加二个0以外，后面再加4个0。
// 这样得到一个二位的Base64编码，再在末尾补上两个"="号。

// 比如，“M"这个字母是一个字节，可以转化为二组00010011、00010000，对应的Base64值分别为T、Q，再补上二个”="号，因此"M"的Base64编码就是TQ==。

var djbase64 = {
  enKey: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  encode:function(str){
    var enKey = djbase64.enKey;
    var result = [];
    var position = 0;
    while(position+3 <= str.length){
      var ch1 = str.charCodeAt(position++);
      var ch2 = str.charCodeAt(position++);
      var ch3 = str.charCodeAt(position++);
      result.push(enKey.charAt(ch1>>2));
      result.push(enKey.charAt(((ch1<<4) + (ch2>>4)) & 0x3f));
      result.push(enKey.charAt(((ch2<<4) + (ch3>>4))>>2 &0x3f));
      result.push(enKey.charAt(ch3&0x3f));
    }

    if(position<str.length){
      var ch = str.charCodeAt(position++);
      result.push(enKey.charAt(ch>>2));
      if(position < str.length){
        var ch4 = str.charCodeAt(position);
        result.push(enKey.charAt(((ch<<4) + (ch4>>4))&0x3f));
        result.push(this.enKey.charAt(((ch4<<2)&0x3f)));
        result.push("=")
      }else{
        result.push(this.enKey.charAt(((ch<<4)&0x3f)));
        result.push("==");
      }
    }
    return result.join('');
  },
  decode:function(src){
    let result = [];
    src = src.replace(/=/g,"");
    let pos = 0;
    var enKey = djbase64.enKey;
    let ch1,ch2,ch3,ch4;
    while(pos + 4<=src.length){
        ch1=enKey.indexOf(src[pos++]);
        ch2=enKey.indexOf(src[pos++]);
        ch3=enKey.indexOf(src[pos++]);
        ch4=enKey.indexOf(src[pos++]);
        result.push(String.fromCharCode( ((ch1<<2 &0xff) + (ch2>>4 & 0x3)), (ch2<<4&0xff) + (ch3>>2 & 0xff),(ch3<<6 & 0xff) + (ch4&0x3f)) );
        console.log(result);
    }
    if(src.length - pos == 3){
      ch1=enKey.indexOf(src[pos++]);
      ch2=enKey.indexOf(src[pos++]);
      ch3=enKey.indexOf(src[pos++]);
      result.push(String.fromCharCode( (ch1<<2&0xff) + (ch2>>4 &0x3)));
      result.push(String.fromCharCode((ch2<<4&0xff) + (ch3>>2 & 0xf)));
      console.log(String.fromCharCode((ch2<<4&0xff) + (ch3>>2 & 0xf)))
    }else if(src.length - pos == 2){
      console.log(1111);
      ch1=enKey.indexOf(src[pos++]);
      ch2=enKey.indexOf(src[pos++]);
      result.push(String.fromCharCode( (ch1<<2&0xff) + (ch2>>4 &0x3)))
    }else {

    }
    console.log(result);
    return result.join('');
  }
}

console.log(djbase64.encode("1"),djbase64.encode("1") == btoa("1"));

console.log(djbase64.decode("1"),djbase64.decode("1") == atob("1"));
