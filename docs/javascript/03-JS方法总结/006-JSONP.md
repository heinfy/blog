# JSONP

## 方法

```js
(function (root) {
  var jsonp = function (options) {
    let script = document.createElement('script');
    let params = '';
    for (let attr in options.data) {
      params += '&' + attr + '=' + options.data[attr];
    }
    let fnName = `myJsonp${Math.random().toString().replace('.', '')}`;
    window[fnName] = options.success;
    script.src = options.url + `?callback=${fnName}${params}`;
    document.body.appendChild(script);
    script.onload = () => {
      document.body.removeChild(script);
    };
    script.onerror = () => {
      setTimeout(() => {
        document.body.removeChild(script);
      }, 500);
    };
  };
  root.jsonp = jsonp;
})(window);
```

## 测试

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>jsonp</title>
    <script src="jsonp.js"></script>
  </head>
  <body>
    <button id="btn">腾讯天气</button>
    <p>调取 豆瓣open api 仿美团周边游：</p>
    <button id="btn1">获取list</button>
    <button id="btn2">获取某类type的列表</button>
    <button id="btn3">某个活动的详情</button>

    <script>
      let btn = document.querySelector('#btn');
      btn.onclick = () => {
        let obj = {
          url: 'https://wis.qq.com/weather/common',
          data: {
            source: 'pc',
            // observe|forecast_1h|forecast_24h|index|alarm|limit|tips|rise|air
            weather_type: 'observe|forecast_1h|air',
            province: '北京市',
            city: '北京市'
          },
          success: function (data) {
            console.log('jsonp请求成功', data);
          }
        };
        jsonp(obj);
      };

      let btn1 = document.querySelector('#btn1');
      btn1.onclick = () => {
        let obj = {
          url: 'https://api.douban.com/v2/event/list',
          data: {
            loc: 'shanghai',
            count: 100
          },
          success: function (data) {
            console.log('jsonp请求成功', data);
          }
        };
        jsonp(obj);
      };

      const typeLists = {
        音乐: 'music',
        戏剧: 'drama',
        展览: 'exhibition',
        讲座: 'salon',
        聚会: 'party',
        运动: 'sports',
        旅行: 'travel',
        公益: 'commonweal',
        电影: 'film',
        全部: 'all'
      };
      let btn2 = document.querySelector('#btn2');
      btn2.onclick = () => {
        let obj = {
          url: 'https://api.douban.com/v2/event/list',
          data: {
            loc: 'shanghai',
            type: 'music',
            day_type: 'default',
            status: 'default'
          },
          success: function (data) {
            console.log('jsonp请求成功', data);
          }
        };
        jsonp(obj);
      };

      let btn3 = document.querySelector('#btn3');
      btn3.onclick = () => {
        let obj = {
          url: 'https://api.douban.com/v2/event/' + '33072896',
          data: {},
          success: function (data) {
            console.log('jsonp请求成功', data);
          }
        };
        jsonp(obj);
      };
    </script>
  </body>
</html>
```

### 腾讯天气 api 文档

请求地址： `https://wis.qq.com/weather/common`

入参格式：

| 参数名       | 必填 | 类型   | 说明                                                                                                                                                                                                                                                                  |
| :----------- | ---- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| source       | Yes  | String | pc：电脑<br />xw：移动设备                                                                                                                                                                                                                                            |
| weather_type | Yes  | String | observe：获取当前天气信息<br />forecast_1h：未来 48 小时的天气信息<br />forecast_24h：未来 7 天的天气信息<br />index：温馨提示信息<br />alarm：警告信息<br />limit：城市限行信息<br />tips：其他提示信息<br />rise：获取日出日落时间信息<br />air：当日的空气质量信息 |
| province     | Yes  | String | 省份，例如：北京市                                                                                                                                                                                                                                                    |
| city         | Yes  | String | 城市，例如：北京市                                                                                                                                                                                                                                                    |

出参格式：

```json
{
  "data": {
    "air": {},
    "alarm": {},
    "forecast_1h": {},
    "forecast_24h": {},
    "index": {}
  },
  "message": "OK",
  "status": 200
}
```

### 豆瓣周边游 api 文档

请求地址：`https://api.douban.com/v2/event/list`

入参格式：

| 参数名   | 必填 | 类型   | 说明                                |
| :------- | ---- | ------ | ----------------------------------- |
| loc      | Yes  | String | 城市，例如：shanghai                |
| count    | No   | Number | 获取周边演出数量                    |
| type     | No   | String | 周边演出种类，例如：all（默认）     |
| day_type | No   | String | 不同时间选择，例如：default（默认） |
| status   | No   | String | 活动是否过期，例如：default（默认） |
| start    | No   | Number | 分页获取 list 数量                  |

```bash
type：
# music --- 音乐   drama --- 戏剧   exhibition --- 展览
# salon --- 讲座   party --- 聚会   sports --- 运动
# travel --- 旅行   commonweal --- 公益   film --- 电影   all --- 全部
day_type：
# default --- 默认 tomorrow --- 明天 weekend --- 周末 week --- 最近一周
status：
#default --- 默认 ongoing --- 正在进行 expired --- 已过期
```

请求地址： `https://api.douban.com/v2/event/活动id`

出参格式：

```json
{
  "image": "",
  "adapt_url": "",
  "loc_name": "",
  "owner": {
    "name": "票牛",
    "avatar": "...e7.jpg",
    "uid": "267084",
    "alt": "https://site.douban.com/267084/",
    "type": "site",
    "id": "267084",
    "large_avatar": ".../icon_default_large.png"
  },
  "alt": "https://www.douban.com/event/32462162/",
  "label": null,
  "id": "32462162",
  "category": "exhibition",
  "title": "上海国际餐饮智慧零售展",
  "wisher_count": 138,
  "has_ticket": false,
  "content": "购买须知 .....",
  "can_invite": "no",
  "time_str": "2020.03.12 周四",
  "album": "1693534881",
  "participant_count": 50,
  "tags": "",
  "image_hlarge": "...public/827022cccc5c9eb.jpg",
  "begin_time": "2020-03-12 09:00:00",
  "price_range": "21 - 60",
  "geo": "31.209749 121.568771",
  "image_lmobile": ".../public/827022cccc5c9eb.jpg",
  "category_name": "展览",
  "loc_id": "108296",
  "url": "https://www.douban.com/event/32462162/",
  "uri": "douban://douban.com/event/32462162",
  "fee_str": "21元起",
  "end_time": "2020-03-14 15:00:00",
  "address": "上海 上海新国际博览中心 上海市浦东新区龙阳路2345号"
}
```
