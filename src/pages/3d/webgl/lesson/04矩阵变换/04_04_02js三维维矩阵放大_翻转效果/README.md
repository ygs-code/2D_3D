WebGL中的三角形有正反面的概念，正面三角形的顶点顺序是逆时针方向， 反面三角形是顺时针方向。

![](https://webglfundamentals.org/webgl/lessons/resources/triangle-winding.svg)

WebGL可以只绘制正面或反面三角形，可以这样开启

<pre class="prettyprint showlinemods notranslate prettyprinted" translate="no"><ul class="modifiedlines"><li class=""><p><span class="pln">  gl</span><span class="pun">.</span><span class="pln">enable</span><span class="pun">(</span><span class="pln">gl</span><span class="pun">.</span><span class="pln">CULL_FACE</span><span class="pun">);</span></p></li></ul></pre>

将它放在 `drawScene` 方法里，开启这个特性后WebGL默认“剔除”背面三角形， "剔除"在这里是“不用绘制”的花哨叫法。

对于WebGL而言，一个三角形是顺时针还是逆时针是根据裁剪空间中的顶点顺序判断的， 换句话说，WebGL是根据你在顶点着色器中运算后提供的结果来判定的， 这就意味着如果你把一个顺时针的三角形沿 X 轴缩放 -1 ，它将会变成逆时针， 或者将顺时针的三角形旋转180度后变成逆时针。由于我们没有开启 CULL_FACE， 所以可以同时看到顺时针（正面）和逆时针（反面）三角形。现在开启了， 任何时候正面三角形无论是缩放还是旋转的原因导致翻转了，WebGL就不会绘制它。 这件事很有用，因为通常情况下你只需要看到你正面对的面。
