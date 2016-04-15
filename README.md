passport-leancloud
==============

云引擎中使用 AVUser 作为 passport 策略。

# 如何使用
## 安装
### 源代码安装
clone 到本地项目，并且放进 `node_modules` 文件夹中：

```sh
	git clone https://github.com/wujun4code/passport-leancloud
```

### 通过 npm 安装

```sh
	npm install passport-leancloud
```

## 编写代码
在 `Express` 项目中的 `app.js` 编写如下代码：
```js
    var express = require('express');
	var passport = require('passport');
	var LeanCloudStrategy = require('passport-leancloud');
```

创建 `configuration` ：

```js
	var leancloudStrategy = new ParseStrategy({
		appId:'{这里填写 LeanCloud AppId}'
		appKey:'{这里填写 LeanCloud AppKey}'
	});
```

启用策略：

```js
	passport.use(leancloudStrategy);
```

配合 `Express` 使用：

```js
   var app = express();
   app.use(passport.initialize());
   app.use(passport.session());
```

在需要验证的路由当中使用方式如下：

```js
app.get('/login', function(req, res) {
  res.render('login');
});
app.post('/login',
  passport.authenticate('leancloud', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

// passport 必要的序列化和反序列化
passport.serializeUser(function(user, done) {
  console.log('serializeUser');
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('deserializeUser');
  done(null, user);
});
```

`login` 对应的 `view` 代码可以如下：

```html
<!DOCTYPE HTML>
<html>
  <head>
    <title>passport-leancloud</title>
  </head>
  <body>
        <form action="/login" method="post">
          <label>用户名：</label>
          <input id="username" type="text" name="username" autocomplete="on" placeholder="用户名">
          <label >密码：</label>
          <input id="password" type="password" name="password" autocomplete="on" placeholder="密码">
          <input type="submit" value="登陆"/>
        </form>
  </body>
</html>
```  
