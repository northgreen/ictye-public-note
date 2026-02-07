---
title: 关于QQ在Wayland下输入法无法正常工作的解决方法
tags:
  - Linux
---
说实在的单独这个问题其实也不值得单独写一篇博客但是这事情属实有点抽象

问题来源是QQ在wayland下使用输入法（这里我用的是fcitx5）可能会出现崩溃，输入法闪退的情况

解决起来其实也很简单：让QQ在启动的时候使用`GTK_IM_MODULE=fcitx`

具体来说就是创建以下文件：

```ini title="~/.local/share/applications/qq.desktop" {3}
[Desktop Entry]
Name=QQ
Exec=env GTK_IM_MODULE=fcitx linuxqq %U
Terminal=false
Type=Application
Icon=qq
StartupWMClass=QQ
Categories=Network;
Comment=QQ
```

应该基本能解决问题

接下来就是说些抽象的了：

众所周知这个属性是设置GTK应用使用的输入法模块的，而QQ貌似不是很喜欢Wayland，当这个属性为空或者是`wayland;fctix5;`的时候表现为只在中文输入法（这里使用的是Rime）输入法闪退回英文状态，而在这个属性为`wayland`的时候情况则是直接崩溃

而同样是通过XWayland运行的Steam则完全没有这种情况，也没有在其他应用上碰到这种问题，我个人判断为QQ自己框架的问题，不过目前的话还没有逆向实锤这一点，只是观察到表面的现象，目前来说`3.2.25-45758`版本是有这个问题的
