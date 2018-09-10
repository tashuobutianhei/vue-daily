const express = require('express');
const mysql = require('mysql');
const server = express();
const cookoeParser = require('cookie-parser')
const cookieSession = require('cookie-session');



server.use(cookoeParser());//得先设置cookie
server.use(cookieSession({ //session中间件
  name:'user', //session的名字
  maxAge: 2*3600*1000,
  keys:['aaa','bbb','ccc']//秘钥，循环使用  必选
}));


var db=mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1997123',
  database: 'daliy'
});

db.connect(function(err){
  if(err){

  }else{
    console.log('连接成功：')
  }
})

server.use('/logined',function (req,res) {
  res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Credentials','true')
 // "Access-Control-Allow-Credentials", "true"
  //console.log(req.session['user'])
  if(req.session['user']){
   // console.log(12345679)
   // console.log(req.session['user'])
    res.send(req.session['user'])
  }else{
    res.send('b')
  }
  res.end()
})

server.use('/outlogined',function (req,res) {
  res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Credentials','true')
  req.session=null;
  res.end()
})


server.use( '/login', function(req,res){

      res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
      res.setHeader('Access-Control-Allow-Credentials','true')

      if(req.query.username==''||req.query.password==''){
        res.send(JSON.stringify({
          err: '不允许空信息'
        }))
      }else{
        let sql = 'select * from user where username= ? and password = ?';
        db.query(sql,[req.query.username,req.query.password] ,function (err, data) {
          if (err) {
            console.log(66666)
          } else {
            let data2 = JSON.parse(JSON.stringify(data));
            console.log(data2)
            if(data.length!=0){
              let String = JSON.stringify({
                username:  data2[0].username,
                userid:  data2[0].userid,
              });
              console.log(String)
              req.session['user']=String

              res.send(JSON.stringify({
                ok: '登录成功',
                userid:data2[0].userid
              }));
            }else{
              res.send(JSON.stringify({
                err: '用户名密码错误'
              }))
            }

          }
        })
      }
    //res.end();
});

server.use( '/reg', function(req,res){
  console.log(req.query);
  res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Credentials','true')
  if(req.query.username==''||req.query.password==''){
    var data = {
      err: '不允许空信息'
    };
    res.send(JSON.stringify(data))
  }else{
    var sql ='select * from user where username="' + req.query.username+'";';
    db.query(sql,function (err,data) {
      if(err){
        console.log(err)
      }
      if(data){
        if(data.length==0){
          var sql = 'insert  into user(username,password) values (?,?)';
          db.query(sql,[req.query.username,req.query.password,], function (err, data) {
            if (err) {
              console.log(err)
            } else {
              if(data.length!=0){
                res.send(JSON.stringify({
                  ok: '注册成功'
                }))
              }else{
                res.send(JSON.stringify( {
                  err: '用户名密码错误'
                }))
              }

            }
          })
        }else{
          res.send(JSON.stringify({
            err: '账号已存在'
          }))

        }
      }
    })
  }
});

server.use( '/talk', function(req,res){
  res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Credentials','true')

  let arraylist=[];


  const findInTalk = function () {
    //在talk表中寻找该文章的所有评论
    let sql ='select * from talk where article="' + req.query.articleId+'";';
    db.query(sql,function (err,data) {
      if(err){

      }else{

        let data2 = JSON.parse(JSON.stringify(data));

        const getUsername = function(id,item) {
          const promise = new Promise(function(resolve, reject){
            let sql ='select username from user where userid="' +id+'";';
            db.query(sql,function (err,data) {
              if(err){
                reject();
              }else{
                arraylist.push({
                  talkvalue:item.talkvalue,
                  username:JSON.parse(JSON.stringify(data))[0].username,
                  time:item.time
                })
                resolve();
              }
            })
          });
          return promise;
        };

        const  promise = data2.map(function (item,index,arr) {
          return getUsername(item.userid,item)

        })

        Promise.all(promise).then(function (posts) {
          res.send(JSON.stringify(arraylist));
        }).catch(function(reason){

        })

      }
    })
  }

  //在回复表中寻找该文章的所有评论
  let sql2 ='select * from calltalk where article="' + req.query.articleId+'";';
  db.query(sql2,function (err,data) {
    if(err){

    }else{

      let data2 = JSON.parse(JSON.stringify(data));

      const getUsername = function(id,item) {
        const promise = new Promise(function(resolve, reject){
          let sql ='select username from user where userid="' +id+'";';
          db.query(sql,function (err,data) {
            if(err){
              reject();
            }else{
              let arr = item.calltalkvalue.split(':');

              arraylist.push({
                talkvalue:arr[1],
                username:JSON.parse(JSON.stringify(data))[0].username+arr[0],
                time:item.time
              })
              resolve();
            }
          })
        });
        return promise;
      };

      const  promise = data2.map(function (item,index,arr) {
        return getUsername(item.userid,item)

      })

      Promise.all(promise).then(function (posts) {
        //异步执行完在talk表中的事情后再进行在回复表中的事情
        findInTalk()
      }).catch(function(reason){

      })

    }
  })
})


server.use( '/uptalk', function(req,res){
  res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Credentials','true')

  var sql ='insert  into talk(article,talkvalue,userid,time) values(?,?,?,?);'
  db.query(sql,[req.query.articleId,req.query.value,req.query.userid,req.query.time],function (err,data) {
    if(err){
      console.log(err)
    }else{
      res.send(JSON.stringify({
        ok:'评论成功'
      }))
    }
  })

})


server.use( '/upcalltalk', function(req,res){
  res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Credentials','true')
  let sql ='select userid from user where username="' +req.query.username+'";';
  db.query(sql,function (err,data) {
    if(err){

    }else{
      let userid = JSON.parse(JSON.stringify(data))[0].userid;

      let sql ='insert  into calltalk(article,calltalkvalue,calluserid,userid) values(?,?,?,?,?);'
      db.query(sql,[req.query.articleId,req.query.talkvalue,userid,req.query.userid,req.query.time],function (err,data) {
        if(err){
          console.log(err)
        }else{
          res.send(JSON.stringify({
            ok:'评论成功'
          }))
        }
      })
    }
  })



})



server.listen(8088);

