/*!
 * jquery-captcha-lgh v1.0 (https://github.com/honguangli/jquery-captcha-lgh)
 * Copyright honguangli
 * Licensed under the MIT license
 */
;
let Captcha;
(function($) {
  "use strict";
  // é»˜è®¤é…ç½®
  const defaults = {
    element: null,       // canvasèŠ‚ç‚¹
    length: 4,           // æ ¡éªŒç é•¿åº¦
    code: [],            // æ ¡éªŒç 
    autoRefresh: false,   // è°ƒç”¨æ ¡éªŒæŽ¥å£åŽæ˜¯å¦è‡ªåŠ¨åˆ·æ–°
  };

  const sCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
  const aCode = sCode.split(",");
  const aLength = aCode.length; //èŽ·å–åˆ°æ•°ç»„çš„é•¿åº¦

  Captcha = function(element, options) {
    const self = this;
    self.options = $.extend(true, defaults, options);
    self.element = element;
    self.refresh();
    self.element.on('click', function () {
        self.refresh();
    });
  };

  Captcha.prototype.refresh = function() {
    const self = this;
    const canvas_width = self.element.width();
    const canvas_height = self.element.height();
    const canvas = self.element[0]; //èŽ·å–åˆ°canvasçš„å¯¹è±¡ï¼Œæ¼”å‘˜
    const context = canvas.getContext("2d"); //èŽ·å–åˆ°canvasç”»å›¾çš„çŽ¯å¢ƒï¼Œæ¼”å‘˜è¡¨æ¼”çš„èˆžå°
    canvas.width = canvas_width;
    canvas.height = canvas_height;

    const code = [];
    for (let i = 0; i < self.options.length; i++) {
      const j = Math.floor(Math.random() * aLength); //èŽ·å–åˆ°éšæœºçš„ç´¢å¼•å€¼
      const deg = Math.random() * 30 * Math.PI / 180; //äº§ç”Ÿ0~30ä¹‹é—´çš„éšæœºå¼§åº¦
      const txt = aCode[j]; //å¾—åˆ°éšæœºçš„ä¸€ä¸ªå†…å®¹
      code.push(txt.toLowerCase());
      const x = 10 + i * 20; //æ–‡å­—åœ¨canvasä¸Šçš„xåæ ‡
      const y = 20 + Math.random() * 8; //æ–‡å­—åœ¨canvasä¸Šçš„yåæ ‡
      context.font = "bold 23px Arial";

      context.translate(x, y);
      context.rotate(deg);

      context.fillStyle = randomColor();
      context.fillText(txt, 0, 0);

      context.rotate(-deg);
      context.translate(-x, -y);
    }
    self.options.code = code;
    for (let i = 0; i <= 5; i++) {
      context.strokeStyle = randomColor();
      context.beginPath();
      // æ˜¾ç¤ºçº¿æ¡
      context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
      context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
      // æ˜¾ç¤ºå°ç‚¹
      const x = Math.random() * canvas_width;
      const y = Math.random() * canvas_height;
      context.moveTo(x, y);
      context.lineTo(x + 1, y + 1);
      context.stroke();
    }

    //å¾—åˆ°éšæœºçš„é¢œè‰²å€¼
    function randomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return "rgb(" + r + "," + g + "," + b + ")";
    }
  };

  Captcha.prototype.getCode = function() {
    return this.options.code.join('');
  };

  Captcha.prototype.valid = function(code) {
    const self = this;
    const ans = code.toString().toLowerCase() === self.getCode().toLowerCase();
    if (!ans && self.options.autoRefresh) {
      self.refresh();
    }
    return ans;
  };
})($);