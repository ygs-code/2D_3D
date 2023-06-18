# canvas动画

## 1.canvas 属性

## canvas 属性：canvas只有width和height 两个属性，表示画布的宽高。

canvas的width和height不要用css的样式来设置，如果使用css的样式来设置，画布会失真，会变形。

比如用css className设置会变形 或者用 canvas.style.width 设置也会变形

## 2、动画思想

canvas一旦绘制成功了，canvas就像素化了他们。canvas没有能力，从画布上再次得到这个图形，也就是说我们没有能力去修改已经在画布上的内容。这个就是canvas比较轻量的原因，Flash重的原因之一就有它可以通过对应的api得到已经上“画布”的内容然后再次绘制

如果我们想要让这个canvas图形移动，必须按照清屏-更新-渲染的逻辑进行编程，总之就是重新再画一次。

 canvas动画的原理：**清屏-更新-渲染**，因为canvas绘图完成，就被像素化了，所以不能通过style.left方法进行修改，而是必须要重新绘制

实际上，动画的生存就是相关静态画面连续播放，这个就是动画的过程。把每一次绘制的静态画面叫做“**一帧**”，时间的间隔（定时器的间隔）就表示的是帧的间隔



# 3、面向对象思想实现canvas动画

canvas不能得到已经上屏的对象，所以要维持对象的状态，都使用面向对象来进行编程，因为可以使用面向对象的方式来维持canvas需要的属性和状态；

```
window.onload = () => {
    function Rect(width, height) {
        this.canvas = document.createElement('canvas');

        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        this.hDVrender({canvas: this.canvas, width, height, ctx: this.ctx});
        this.width = width;
        this.height = height;
    }
    Rect.prototype = {
        hDVrender({canvas, width, height, ctx}) {
            canvas.width = width;
            canvas.height = height;
            var ratio = window.devicePixelRatio || 1;
            canvas.style.width = canvas.width + 'px';
            canvas.style.height = canvas.height + 'px';
            canvas.width = canvas.width * ratio;
            canvas.height = canvas.height * ratio;
            ctx.scale(ratio, ratio);
            return ctx;
        },
        render({x, y}) {
            // 擦除画布内容
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = 'green';
            // 重画
            this.ctx.fillRect(x, y, 10, 10);
        },
    };

    let x = 0;
    let y = 0;
    let rect = new Rect(500, 500);
    setInterval(() => {
        x += 10;
        y += 10;
        if (x >= 490) {
            x = 0;
            y = 0;
        }
        rect.render({x, y});
    }, 100);
};

```

