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

根据上面的介绍其实也能想到ResourceLoader和ResourceSaver都提供了类似AddResourceFormatSaver的接口用来将你的ResourceFormater注册进去（gdscript的话应该是snake_case的命名，都一样的）

这几个类你基本的需要考虑有
- 用于识别文件的拓展名
- 文件的基本的格式
- 类型所对应的类
- 这个文件的uid的保存方式（可选）

现在假设我们要让Godot引擎有使用CSV文件的能力，或者说是能将CSV当作自己的一个类型的能力

显而易见，我们的任务是：
- 创建表示CSV表格的类
- 创建两个Formater类
- 将上面这些都注册到引擎中

这里的话让我们实现这个格式：
```csharp title="CsvResource.cs"
using Godot;

namespace SLDemo.addons.csvimport;

public partial class CsvResource : Resource
{
    [Export] public Godot.Collections.Array<Godot.Collections.Array<string>> Data { get; set; } = [];

    public void InsertRow(int row, Godot.Collections.Array<string> values) =>
        Data.Insert(row, values);

    public void Insert(int row, int col, string value) =>
        Data[row].Insert(col, value);
}
```

核心只是这个两层套娃的Array

为了将这个插件注册（实际上只是建立了一个方便创建的东西），还需要创建一个插件：
![[Pasted image 20260207101517.png]]

然后创建这样的脚本：

```csharp title="CsvImport.cs"
#if TOOLS
using Godot;

[Tool]
public partial class CsvImport : EditorPlugin
{
    private readonly string FormatPath = "res://addons/csvimport/CsvResource.cs"; 
    public override void _EnterTree()
    {
		// 注册这个类型，图标是随便填写的
        AddCustomType(
                "CsvResource",
                "Resource",
                ResourceLoader.Load<Script>(FormatPath),
                EditorInterface.Singleton.GetEditorTheme().GetIcon("Node", "EditorIcons"));
    }

    public override void _ExitTree()
    {
	    // 移除这个类型
        RemoveCustomType("CsvResource");
    }
}
#endif
```

现在我们就能在编辑器里面看到我们的类型被成功地创建了

![[Pasted image 20260212154632.png]]

接下来让我们先从更简单的来说
### ResourceFormatSaver

对于这个类，主要需要实现的是这几个方法：
- `Error Save(resource: Resource, path: String, flags: int)` ：顾名思义，就是当保存的时候调用的方法，我们要做的就是将
- `bool Recognize(resource: Resource) `：这个函数就是用来判断此保存程序能不能保存给定的资源对象
- `PackedStringArray GetRecognizedExtensions(resource: Resource)`：此函数应该根据传入的Resource返回拓展名列表

另外其他的几个函数具体可以参考官方的文档

不过在此之前我们先实现一个基础的CsvFormater类来统一管理这些Save和Load的操作：

### ResourceFormatLoader

## 导入

