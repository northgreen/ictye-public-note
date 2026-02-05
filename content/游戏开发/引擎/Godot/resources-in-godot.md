---
title: 关于Godot中自定格式资源
tags:
  - Godot
  - Resource
  - 教程
---
对于godot游戏开发中有时需要将自定的或者一些非常规的资源导入游戏再或者直接允许godot引擎对它进行管理，而这部分很少有教程提及。本笔记内容则是针对这部分需求的讲解

稍微有点麻烦的事，不过其实也不是很难，如果根据官方的文档还有源码其实也能猜到个大概做法

值得吐槽的是godot自己的文档对于这些还不是很完善（

## Godot资源的加载和保存的设计

总而言之，先从理解Godot的资源的加载和保存的设计讲起比较好

这部分的话多看看Godot的文档其实就能理解个七七八八

主要是这两个类：[ResourceLoade](https://docs.godotengine.org/zh-cn/4.x/classes/class_resourceloader.html)和[ResourceSaver](https://docs.godotengine.org/zh-cn/4.x/classes/class_resourcesaver.html)单从名字的话就能将这两个类的作用猜到了，Godot为了能够让各种资源都可以用统一的接口或者说是界面save和load而设计的两个单例类，其中维护若干个[ResourceFormatLoader](https://docs.godotengine.org/zh-cn/4.x/classes/class_resourceformatloader.html)和[ResourceSavertLoader](https://docs.godotengine.org/zh-cn/4.x/classes/class_resourceformatsaver.html)，在使用这两个类提供的公共API来save和load的时候这两个类会自动根据你传入的Resource的类型选择合适的ResourceFormatLoader或者ResourceSavertLoader进行操作

## 具体的实现

其实这方面你大可以只实现导入或者保存的，或者只在编辑器侧使用再者只在

## 导入

