# MindDial 支持ChatGPT,Minimax的AI助手微信小程序
基于uniapp的小程序，实现了Chat-Next-Web的功能与UI，可作为ChatGPT小程序，支持gpt3.5、gpt4等接入，后台与后端全套一应俱全，可直接部署上线商用。
## 特色功能
- 自动审核，AI输入输出敏感词全检验，多次违规用户自动拉入黑名单，完全保证应用的合规性
- 多家服务商接入，多KEY配置可实现同一服务商多KEY负载均衡
- go协程优化http2高并发快速流式响应，小程序也支持，非socket方式，更加流畅无bug
- 自动压缩历史记录请求，节省token的同时保证AI效果
- 多对话框自动管理分类
- 多角色多模型
- ... ...（更多功能扫码体验）
### 小程序扫码体验
![小程序二维码](http://source.minddial.top/gh_7a9e33dc0374_344.jpg)

## 小程序页面展示
### 对话列表页面
![对话列表管理](http://source.minddial.top/chat_list.PNG)
### 角色模型切换
![角色模型切换](http://source.minddial.top/mask.PNG)
### 用户中心
![用户中心](http://source.minddial.top/user_center.PNG)

## 后台系统
后台系统基于laravel,简单易用
### 消费记录页面
![消费记录页面](http://source.minddial.top/history.png "消费记录页面")
### 账户变动页面
![账户变动页面](http://source.minddial.top/change_log.png "账户变动页面")

## 安装

环境要求：
- node >= 16

1. 克隆项目
```bash
git clone https://github.com/Feiir/mind-dial-mini
```

2. 进入项目目录
```bash
cd mind-dial-mini
```

3. 安装依赖 (推荐使用 `yarn`)
```bash
yarn install
```

4. 运行
```bash
yarn dev:wx
```

需要后台系统源码与后端程序请联系我获取

#### Email: fov.dei.ty@gmail.com zhcount023@gmail.com
![微信](http://source.minddial.top/IMG_0017.JPG)


