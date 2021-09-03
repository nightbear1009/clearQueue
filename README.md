# 目標
在cloudamqp轉移的過程中將 message Queue的內容清空

# Local 測試

`起rabbitmq`
```
docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

`follow local.env 設定queue/routingkey/exchange`

`set local env`
```
export $(cat local.env | xargs -L 1)
```


`send msg`
```
node send.js 
```

`起clearQueue`
```
node clearqueue.js
```

`起receiver`
```
node receive.js 
```

運作流程
readme.drawio


TODO
包docker 
包k8s