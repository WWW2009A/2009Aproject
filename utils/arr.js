// 1、数组的方法
/* 
    ES3:
        添加元素：
            push() 尾部添加
            unshift() 头部添加
            splice(下标,0,数据1,数据2...) 中间添加
        删除元素：
            pop() 尾部删除
            shift() 头删
            splice(下标,删除几项) 中间删除
        排序：
            sort() 从小到大排序（按照字符编码排序）
            reverse() 倒序
        拼接：
            concat() 合并多个数组
            join() 数组元素合并成字符串
        截取：
            slice(index,个数) 截取子数组
        查询：
            indexOf()/lastIndexOf() --找下标/-1
    ES5:
        forEach((item,index)=>{}) 遍历
        map(fn) 映射
        some(fn) 判断数组是否有符合条件的元素（返回true/false）
        every(fn) 判断数组中是否所有元素都符合条件（返回true/false）
        filter(fn) 过滤数组中所有符合条件的元素（返回新数组）
        reduce(fn) 对数组元素累加求和（从左到右累加）
        reduceRight(fn) 对数组元素累加求和（从右到左累加）
    ES6:
        构造函数方法：
        Array.isArray(arr) 判断变量是不是数组
              Array.of(1,2,3) 将散列转成数组
              Array.from() 将伪数组转成数组
        实例方法：
                fill() 填充数组
        find(fn) 找数组中第一个符合条件的元素
        findIndex(fn) 找数组中第一个符合条件的元素的下标
        copyWithin() 复制填充数组
        keys() values() entries() 遍历数组
        includes() 判断数组中是否包含某个元素


*/

        // 2、数组排序
        
        // 方法一：sort