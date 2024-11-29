# 第 2 章 线性表

![image-20220417082727276](chapter02.assets/image-20220417082727276.png)

## 知识回顾

![image-20220417082643804](chapter02.assets/image-20220417082643804.png)

## 2.1 线性表的定义和特点

 ![image-20220417082857829](chapter02.assets/image-20220417082857829.png)

![image-20220417082933248](chapter02.assets/image-20220417082933248.png)

![image-20220417083215343](chapter02.assets/image-20220417083215343.png)

![image-20220417083259600](chapter02.assets/image-20220417083259600.png)

## 2.2 案例引入

![image-20220417084018013](chapter02.assets/image-20220417084018013.png)

![image-20220417084248869](chapter02.assets/image-20220417084248869.png)

![image-20220417084618792](chapter02.assets/image-20220417084618792.png)

![image-20220417084753712](chapter02.assets/image-20220417084753712.png)

![image-20220417084931776](chapter02.assets/image-20220417084931776.png)

![image-20220417085055199](chapter02.assets/image-20220417085055199.png)

![image-20220417085154529](chapter02.assets/image-20220417085154529.png)

![image-20220417085344034](chapter02.assets/image-20220417085344034.png)

## 2.3 线性表的类型定义

![image-20220417085510922](chapter02.assets/image-20220417085510922.png)

![image-20220417090305933](chapter02.assets/image-20220417090305933.png)

![image-20220417090612426](chapter02.assets/image-20220417090612426.png)

## 2.4 线性表的顺序表示和实现

![image-20220417090726606](chapter02.assets/image-20220417090726606.png)

![image-20220417091913256](chapter02.assets/image-20220417091913256.png)

![image-20220417091957599](chapter02.assets/image-20220417091957599.png)

![image-20220417092348055](chapter02.assets/image-20220417092348055.png)

![image-20220417092508172](chapter02.assets/image-20220417092508172.png)

![image-20220417092844360](chapter02.assets/image-20220417092844360.png)

![image-20220417093300258](chapter02.assets/image-20220417093300258.png)

![image-20220417093407395](chapter02.assets/image-20220417093407395.png)

## 补充：类C语言有关操作

![image-20220417125317169](chapter02.assets/image-20220417125317169.png)

![image-20220417125444283](chapter02.assets/image-20220417125444283.png)

> 之所以说数组的本质是指针，是因为在在具体实现上。数组是基于指针实现的，编译器只提供了数组首元素的地址。因此在访问时需要使用首地址+偏移量的形式，所谓的偏移量由下标决定。
>
> 假设存在数组a[10]，当我们访问第一个元素是可以使用a[0],也可以使用*a,或者*(a+0),，当我们访问第二个元素时可以使用a[1],同样的，指针表示为*(a+1),

![image-20220417125538533](chapter02.assets/image-20220417125538533.png)

> 因为malloc的返回值是一个void类型的指针，所以需要强制类型转换
>
> malloc 返回值void类型的指针，需要类型转换成对应数据类型的指针

![image-20220417130257921](chapter02.assets/image-20220417130257921.png)

![image-20220417130448509](chapter02.assets/image-20220417130448509.png)

![image-20220417130555652](chapter02.assets/image-20220417130555652.png)

![image-20220417130924722](chapter02.assets/image-20220417130924722.png)

![image-20220417131135259](chapter02.assets/image-20220417131135259.png)

![image-20220417131159648](chapter02.assets/image-20220417131159648.png)

![image-20220417131244620](chapter02.assets/image-20220417131244620.png)

![image-20220417131402395](chapter02.assets/image-20220417131402395.png)

![image-20220417131523412](chapter02.assets/image-20220417131523412.png)

## 2.4 线性表的链式表示和实现3

![image-20220601093046700](chapter02.assets/image-20220601093046700.png)

